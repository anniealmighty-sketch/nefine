/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Works', id: 'works' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      id="header-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#1b2434]/95 border-b border-white/[0.06] backdrop-blur-md shadow-lg ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Brand Logo - Nefine */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white group cursor-pointer focus:outline-hidden"
          id="btn-logo-home"
        >
          <span className="text-white transition-colors duration-300">Nefine</span>
          <span className="h-2.5 w-2.5 rounded-full bg-malachite transition-transform duration-300 group-hover:scale-125"></span>
        </button>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-10">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative text-sm font-medium tracking-wide transition-colors py-2 cursor-pointer focus:outline-hidden ${
                    activeSection === item.id
                      ? 'text-malachite font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-malachite rounded-full" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button
            id="btn-quick-inquire"
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 bg-malachite text-white text-xs font-semibold rounded-lg hover:bg-malachite-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center gap-1"
          >
            Inquire Now
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          id="btn-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-hidden cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-drawer" className="absolute top-full left-0 w-full bg-[#1b2434] border-b border-white/[0.06] shadow-xl py-6 px-8 flex flex-col gap-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left text-lg font-medium py-2 transition-colors focus:outline-hidden ${
                    activeSection === item.id ? 'text-malachite font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            id="btn-mobile-quick-inquire"
            onClick={() => {
              onNavigate('contact');
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-3.5 bg-malachite text-white text-sm font-semibold rounded-lg hover:bg-malachite-dark text-center transition-colors shadow-md cursor-pointer"
          >
            Inquire / Contact Portfolio
          </button>
        </div>
      )}
    </header>
  );
}
