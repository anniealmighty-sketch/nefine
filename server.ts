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

  // 2. Persistent Portfolio Data Save API
  app.post("/api/portfolio/update", (req, res) => {
    try {
      const { projects } = req.body;
      if (!Array.isArray(projects)) {
        return res.status(400).json({ error: "Invalid projects payload. Must be an array." });
      }

      // Rewrite src/data.ts entirely with the updated list of portfolio items!
      const dataFilePath = path.join(process.cwd(), "src", "data.ts");
      const fileContent = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem } from './types';

export const portfolioData: PortfolioItem[] = ${JSON.stringify(projects, null, 2)};
`;

      fs.writeFileSync(dataFilePath, fileContent, "utf-8");
      res.json({ success: true });
    } catch (err: any) {
      console.error("Save portfolio error:", err);
      res.status(500).json({ error: "Failed to save portfolio", details: err.message });
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
