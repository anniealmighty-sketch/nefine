import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up payload limits higher (e.g. 100MB) to support raw Base64 image uploads
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // Ensure "uploads" directory exists inside the project workspace
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Serve the dynamic uploaded images statically from /uploads
  app.use("/uploads", express.static(uploadDir));

  // --- FULL-STACK API ENDPOINTS ---

  const portfolioFile = path.join(uploadDir, "portfolio.json");

  // Load the original fallback portfolio items dynamically on startup
  let defaultData: any[] = [];
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data.ts");
    if (fs.existsSync(dataFilePath)) {
      const dataModule = await import("./src/data.js");
      defaultData = dataModule.portfolioData || [];
    }
  } catch (err) {
    try {
      const dataModuleAlt = await import("./src/data");
      defaultData = dataModuleAlt.portfolioData || [];
    } catch (err2) {
      console.error("Could not dynamically import src/data.ts, falling back to static parsed read.", err2);
      // Fallback: simple parser to extract JSON array content if import fails
      try {
        const fileContent = fs.readFileSync(path.join(process.cwd(), "src", "data.ts"), "utf-8");
        const startIdx = fileContent.indexOf("[");
        const endIdx = fileContent.lastIndexOf("]");
        if (startIdx !== -1 && endIdx !== -1) {
          const jsonStr = fileContent.substring(startIdx, endIdx + 1);
          defaultData = JSON.parse(jsonStr);
        }
      } catch (err3) {
        console.error("Fallback file reading of src/data.ts failed too:", err3);
      }
    }
  }

  // 0. Live Portfolio Query API
  app.get("/api/portfolio", (req, res) => {
    try {
      if (fs.existsSync(portfolioFile)) {
        const fileContent = fs.readFileSync(portfolioFile, "utf-8");
        const parsed = JSON.parse(fileContent);
        return res.json({ success: true, projects: parsed });
      }
      res.json({ success: true, projects: defaultData });
    } catch (err: any) {
      console.error("Load portfolio error:", err);
      res.json({ success: false, error: err.message, projects: defaultData });
    }
  });

  // 1. Live Image Upload API
  app.post("/api/upload-image", (req, res) => {
    try {
      const { base64Data, fileName } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // Check if it is a standard data URI or raw base64 data
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = "png";

      if (matches && matches.length === 3) {
        extension = matches[1].split("/")[1] || "png";
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(base64Data, "base64");
      }

      // Sanitize the filename to avoid directory traversals or illegal chars
      const sanitizedName = fileName
        ? fileName.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
        : "image";
      const uniqueFileName = `upload_${Date.now()}_${sanitizedName}.${extension}`;
      const destPath = path.join(uploadDir, uniqueFileName);

      fs.writeFileSync(destPath, buffer);

      const imageUrl = `/uploads/${uniqueFileName}`;
      res.json({ success: true, imageUrl });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload image", details: err.message });
    }
  });

  // Helper to convert any image path starting with /uploads/ in portfolio projects to Base64
  const convertUploadPathsToBase64 = (projects: any[]) => {
    return projects.map((project: any) => {
      const updated = { ...project };
      ["imageUrl", "innerImageUrl"].forEach((field) => {
        if (updated[field] && updated[field].startsWith("/uploads/")) {
          const fileName = updated[field].replace("/uploads/", "");
          const filePath = path.join(uploadDir, fileName);
          if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            const base64 = fileData.toString("base64");
            const ext = path.extname(fileName).toLowerCase();
            const mime = ext === ".png" ? "image/png" : "image/jpeg";
            updated[field] = `data:${mime};base64,${base64}`;
          }
        }
      });
      return updated;
    });
  };

  // 2. Persistent Portfolio Data Save API
  app.post("/api/portfolio/update", (req, res) => {
    try {
      const { projects } = req.body;
      if (!Array.isArray(projects)) {
        return res.status(400).json({ error: "Invalid projects payload. Must be an array." });
      }

      // Process uploaded images and convert them to Base64 for fully self-contained entries
      const processedProjects = convertUploadPathsToBase64(projects);

      // Save to portfolioFile (uploads/portfolio.json)
      fs.writeFileSync(portfolioFile, JSON.stringify(processedProjects, null, 2), "utf-8");

      // Save to src/data.ts for robust, compiled persistence in exports and deployments
      const srcDataPath = path.join(process.cwd(), "src", "data.ts");
      const esmContent = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem } from './types';

export const portfolioData: PortfolioItem[] = ${JSON.stringify(processedProjects, null, 2)};
`;
      fs.writeFileSync(srcDataPath, esmContent, "utf-8");

      // Ensure that defaultData is in sync for current server session too
      defaultData = processedProjects;

      res.json({ success: true, projects: processedProjects });
    } catch (err: any) {
      console.error("Save portfolio error:", err);
      res.status(500).json({ error: "Failed to save portfolio", details: err.message });
    }
  });

  // 3. Reset Portfolio Data API
  app.post("/api/portfolio/reset", (req, res) => {
    try {
      if (fs.existsSync(portfolioFile)) {
        fs.unlinkSync(portfolioFile);
      }
      res.json({ success: true });
    } catch (err: any) {
      console.error("Reset portfolio error:", err);
      res.status(500).json({ error: "Failed to reset portfolio", details: err.message });
    }
  });

  // --- MIDDLEWARE SETUP FOR DEV VS. PRODUCTION ---

  if (process.env.NODE_ENV !== "production") {
    // Development mode: integration with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serving already-compiled assets from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0 and port 3000 as required by full-stack guidelines
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
