/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2 text-2xl font-black tracking-tight text-white group cursor-pointer focus:outline-hidden self-start"
              id="footer-logo-btn"
            >
              <span>Nefine</span>
              <span className="h-2.5 w-2.5 rounded-full bg-malachite transition-transform duration-300 group-hover:scale-125"></span>
            </button>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              단순히 아름다운 형태를 넘어 서서, 브랜드 고유 가치와 타겟을 정확히 분석하여 비즈니스 생산성을 배가하는 지속 가능한 디자인 파트너 nefine입니다.
            </p>
          </div>

          {/* Sitemaps */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">Navigations</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('works')}
                  className="hover:text-malachite transition-colors cursor-pointer"
                  id="footer-nav-works"
                >
                  Works / Portfolios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-malachite transition-colors cursor-pointer"
                  id="footer-nav-about"
                >
                  About Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-malachite transition-colors cursor-pointer"
                  id="footer-nav-contact"
                >
                  Contact Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Socials / Resources */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Direct Links</h4>
            <div className="flex gap-3">
              <a
                href="#contact"
                className="p-2.5 bg-gray-900 hover:bg-gray-805 rounded-xl text-gray-400 hover:text-white transition-colors border border-gray-800"
                title="카카오 문의"
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <MessageCircle className="w-4 h-4 text-malachite" />
                  <span>annie6180</span>
                </div>
              </a>
              <a
                href="#contact"
                className="p-2.5 bg-gray-900 hover:bg-gray-805 rounded-xl text-gray-400 hover:text-white transition-colors border border-gray-800"
                title="이메일"
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Mail className="w-4 h-4 text-malachite" />
                  <span>dn_designn@naver.com</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 font-mono">
          <p>© {currentYear} Nefine. All rights reserved. Created with Antigravity System.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#about" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#about" className="hover:text-gray-400 transition-colors">Terms of Services</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
