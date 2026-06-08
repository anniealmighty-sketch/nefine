/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Works from './components/Works';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  // Track active section during scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // safe offset
      
      const sections = ['hero', 'works', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white selection:bg-malachite selection:text-white antialiased text-gray-900 font-sans">
      
      {/* Top Floating Header Navigation */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main className="relative">
        <Hero onNavigate={handleNavigate} />
        <Works />
        <About />
        <Contact />
      </main>

      {/* Elegant Footer */}
      <Footer onNavigate={handleNavigate} />
      
    </div>
  );
}
