/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, MessageSquare, Briefcase } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-radial-[at_50%_50%] from-white via-zinc-50/60 to-malachite-light/20 pt-24 overflow-hidden"
    >
      {/* Decorative Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e1e5e3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Abstract Orb Shapes (Malachite green and sky blue) */}
      <div className="absolute top-1/4 right-[5%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-malachite/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 left-[10%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Tagline / Subtitle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-start py-1.5 px-3 rounded-full bg-malachite-light/80 border border-malachite/15 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-malachite animate-pulse" />
            <span className="text-xs font-semibold text-malachite-dark tracking-wide uppercase">
              Total Design Company
            </span>
          </motion.div>

          {/* Majestic Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.12]"
          >
            비즈니스의 생산성을 높이는 <br />
            <span className="relative inline-block text-malachite">
              디자인 파트너, <span className="text-gray-950">Nefine</span><span className="text-malachite">.</span>
              <span className="absolute bottom-1.5 left-0 w-full h-2 bg-malachite-light -z-10" />
            </span>
          </motion.h1>

          {/* Subheading Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl"
          >
            단순히 화려하고 예쁜 결과물을 만드는 것을 넘어 서서, <br />
            기업의 본래 가치와 핵심 목표를 정밀하게 분석하여 <br />
            성과로 이어지는 최적의 브랜드 언어 체계를 구축합니다.
          </motion.p>

          {/* Calls to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 items-center"
          >
            <button
              id="hero-btn-works"
              onClick={() => onNavigate('works')}
              className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-malachite" />
              포트폴리오 보기
            </button>
            <button
              id="hero-btn-contact"
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white text-gray-950 font-semibold rounded-lg hover:bg-gray-50 border border-gray-200 transition-all hover:border-gray-300 shadow-xs cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-malachite" />
              간편 문의하기
            </button>
          </motion.div>
        </div>

        {/* Big Interactive Visual representation / Right Column */}
        <div className="lg:col-span-5 flex items-center justify-center relative md:pt-0">
          <div className="absolute -inset-4 bg-gradient-to-tr from-malachite/18 to-sky-400/12 blur-2xl rounded-full opacity-70 z-0" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full relative max-w-[420px] aspect-[4/5] bg-white rounded-3xl shadow-2xl p-3.5 border-4 border-gray-100 flex flex-col justify-between overflow-hidden group z-10"
          >
            {/* The high-quality designer workspace theme image */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
              <img
                src="/src/assets/images/regenerated_image_1780860183461.png"
                alt="Professional Brand Design Studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
              
              {/* Trust overlays within the frame */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[10px] font-mono tracking-widest text-malachite font-bold uppercase">Nefine Creative Lab</p>
                <h3 className="text-lg font-bold tracking-tight mt-1 text-white">신뢰를 만드는 브랜드 파트너</h3>
                <p className="text-xs text-gray-300/90 mt-1 lines-clamp-2">
                  꼼꼼한 시장 분석과 디테일한 아이디어 스케치로 비즈니스의 확실한 변화를 약속합니다.
                </p>
                
                {/* Embedded Status tags inside image */}
                <div className="flex gap-2.5 mt-3 pt-3 border-t border-white/15">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-malachite" />
                    <span className="text-[10px] font-mono font-semibold text-gray-200">99.9% Success Ratio</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-[10px] font-mono font-semibold text-gray-200">1:1 Prime Support</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium floating labels highlighting designer expertise */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 bg-gray-900 text-white text-[11px] font-semibold py-2 px-3.5 rounded-xl shadow-xl z-20 flex items-center gap-1.5"
          >
            <span className="text-malachite">✦</span> Brand Language Systems
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-4 right-4 bg-white text-gray-900 border border-gray-100 text-[11px] font-bold py-2 px-3.5 rounded-xl shadow-xl z-20 flex items-center gap-1.5"
          >
            <span className="text-yellow-500">★</span> Client-Verified Trust
          </motion.div>
        </div>
      </div>

      {/* Bounce scroll down button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <button
          onClick={() => onNavigate('works')}
          className="text-gray-400 hover:text-malachite transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          id="btn-scroll-indicator"
        >
          <span className="text-[10px] tracking-widest uppercase font-semibold font-mono">SCROLL</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
