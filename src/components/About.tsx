/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Sliders, Users, ExternalLink, Zap } from 'lucide-react';

export default function About() {
  const processes = [
    {
      num: '01',
      title: '브랜드 가치 분석',
      desc: '단순한 형태나 멋을 추구하기보다 브랜드의 깊은 핵심 가치와 비전을 정의합니다.',
      icon: <Sparkles className="w-5 h-5 text-malachite" />
    },
    {
      num: '02',
      title: '목표 고객 & 콘셉트 수립',
      desc: '서비스를 실제로 마주할 목표 고객의 행태를 분석해 선명한 톤앤매너를 제안합니다.',
      icon: <Users className="w-5 h-5 text-malachite" />
    },
    {
      num: '03',
      title: '시각 언어 설계 (Design)',
      desc: '세상과 처음 만나는 브랜드 핵심 디자인, 패키지, 디지털 접점을 아름답게 다듬습니다.',
      icon: <Sliders className="w-5 h-5 text-malachite" />
    },
    {
      num: '04',
      title: '비즈니스 생산성 제고',
      desc: '최종 결과물이 실질적인 비즈니스 효용과 매출 극대화로 직결되도록 지원합니다.',
      icon: <Zap className="w-5 h-5 text-malachite" />
    },
  ];

  return (
    <section id="about" className="py-24 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Main Philosophy Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Visual Slogan Quote */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold tracking-widest text-malachite uppercase bg-malachite-light px-3 py-1 rounded-sm">
              Our Philosophy
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-5 leading-tight">
              디자인은 브랜드가 세상과 처음 마주하는 언어입니다.
            </h3>
            
            <div className="mt-8 relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 shadow-xs">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-malachite" />
              <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">CREATOR QUOTE</p>
              <p className="text-sm font-semibold text-gray-800 leading-relaxed mt-2">
                "진정한 아름다움은 화려한 화장보단 브랜드 본연의 성격과 철학이 가감 없이, 그러나 가장 세련되게 전달될 때 완성됩니다."
              </p>
            </div>
          </div>

          {/* Right Column: User-provided core narrative text */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p className="font-semibold text-gray-950">
                디자인 제작 시 단순한 형태나 멋을 추구하기보다, 브랜드의 가치, 목표 고객, 콘셉트, 톤앤매너를 분석하는 것, 그것이 비즈니스 전체의 생산성을 높이는 핵심 도구라고 생각합니다.
              </p>
              <p>
                단순한 시각 결과물을 넘어, 기업 전반의 실효적인 자산을 풍성하게 일구고 고객의 생산성을 극적으로 높여주는 평생의 파트너 — 바로 <span className="font-extrabold text-gray-950">Nefine</span><span className="font-extrabold text-malachite">.</span>입니다.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
              <div>
                <span className="block text-3xl font-extrabold text-malachite tracking-tight">100%</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1 block">Custom Craft</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-gray-900 tracking-tight">1:1</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1 block">Director Matching</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-gray-900 tracking-tight">200%+</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1 block">Efficiency Gain</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Step Process Cards */}
        <div className="mt-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h4 className="text-xl font-bold tracking-tight text-gray-950">어떻게 해결하나요?</h4>
            <p className="text-xs text-gray-500 mt-1">Nefine만의 맞춤형 프로세스를 통해 안정적이며 수준 높은 솔루션을 도출해냅니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processes.map((proc, index) => (
              <div
                id={`about-process-${proc.num}`}
                key={proc.num}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-malachite/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-mono font-bold text-gray-300">
                      {proc.num}
                    </span>
                    <div className="p-2 bg-malachite-light/80 rounded-lg">
                      {proc.icon}
                    </div>
                  </div>
                  <h5 className="text-sm font-bold text-gray-950 tracking-tight">
                    {proc.title}
                  </h5>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    {proc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
