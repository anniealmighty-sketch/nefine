/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, MessageCircle, ExternalLink, Send, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';

export default function Contact() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [kakaoCopied, setKakaoCopied] = useState(false);

  // Proposal Form States
  const [brandName, setBrandName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'kakao'>('email');
  const [projectType, setProjectType] = useState('브랜드 로고 (BI/CI)');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Copy handles
  const copyToClipboard = (text: string, type: 'email' | 'kakao') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } else {
      setKakaoCopied(true);
      setTimeout(() => setKakaoCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !clientContact) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://formspree.io/f/xojzddoa", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "회사명_개인명": brandName,
          "연락처": clientContact,
          "회신_방법_선호": contactMethod === 'email' ? '이메일' : '카카오 ID',
          "프로젝트_종류": projectType,
          "요청사항_및_상세내용": message,
          _subject: `[Nefine Project Inquiry] ${brandName}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          setSubmitError(errorData.errors.map((err: any) => err.message).join(", "));
        } else {
          setSubmitError("데이터 전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      }
    } catch (err) {
      setSubmitError("인터넷 연결을 확인하고 다시 제출해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setBrandName('');
    setClientContact('');
    setMessage('');
    setSubmitError(null);
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-malachite uppercase bg-malachite-light px-3 py-1 rounded-sm">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-4">
            새로운 생산성, <br />
            Nefine<span className="text-malachite">.</span>과 함께 시작해 보세요.
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            아이디어 초기 기획부터 최종 런칭까지 브랜드 가치 향상에 집중합니다. <br />
            편리하시는 이메일 혹은 카카오톡으로 상시 문의가 가능합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Contact Info & QR code */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              
              {/* Email Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl text-malachite border border-gray-100 shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono tracking-widest text-gray-400 font-bold">EMAIL INQUIRY</p>
                      <p className="text-sm font-bold text-gray-950 mt-0.5">dn_designn@naver.com</p>
                    </div>
                  </div>
                  <button
                    id="btn-copy-email"
                    onClick={() => copyToClipboard('dn_designn@naver.com', 'email')}
                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-malachite transition-colors cursor-pointer"
                    title="복사하기"
                  >
                    {emailCopied ? <Check className="w-4.5 h-4.5 text-malachite" /> : <Copy className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {emailCopied && (
                  <p className="text-[10px] font-semibold text-malachite-dark mt-2.5 absolute bottom-1 right-4">선택한 메일 ID가 복사되었습니다!</p>
                )}
              </div>

              {/* KakaoTalk Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl text-malachite border border-gray-100 shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono tracking-widest text-gray-400 font-bold">KAKAOTALK ID</p>
                      <p className="text-sm font-bold text-gray-950 mt-0.5">annie6180</p>
                    </div>
                  </div>
                  <button
                    id="btn-copy-kakao"
                    onClick={() => copyToClipboard('annie6180', 'kakao')}
                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-malachite transition-colors cursor-pointer"
                    title="ID 복사하기"
                  >
                    {kakaoCopied ? <Check className="w-4.5 h-4.5 text-malachite" /> : <Copy className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {kakaoCopied && (
                  <p className="text-[10px] font-semibold text-malachite-dark mt-2.5 absolute bottom-1 right-4">카카오톡 ID가 복사되었습니다!</p>
                )}
              </div>

            </div>

            {/* Premium Vector KakaoTalk QR Code Component */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-malachite" />
                KakaoTalk QR Code
              </h4>
              
              {/* Sleek, high-fidelity real QR code matching the attached image */}
              <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 relative mb-4 flex items-center justify-center w-48 h-48">
                {/* QR Code image dynamically generated with exact URL decoded from the user's attachment */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http%3A%2F%2Fqr.kakao.com%2Ftalk%2F7p6gMyLCHbN6p402B_F6Qv_BvI4-&color=2d2d2d"
                  alt="KakaoTalk QR Code"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                
                {/* Central speech bubble identical to Kakao's default QR brand mark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 bg-[#2d2d2d] rounded-full border-[2.2px] border-white shadow-xs flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <path d="M12,3C6.48,3,2,6.58,2,11c0,2.82,1.82,5.29,4.55,6.46l-0.95,3.48c-0.1,0.36,0.3,0.67,0.61,0.48l4.13-2.51 c0.54,0.06,1.09,0.09,1.66,0.09c5.52,0,10-3.58,10-8S17.52,3,12,3z" />
                    </svg>
                  </div>
                </div>
                
                {/* Floating scanning guide animation */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-malachite/60 animate-bounce" />
              </div>

              <p className="text-xs text-gray-500 font-medium max-w-[200px] leading-relaxed">
                휴대폰 카메라로 QR 코드를 스캔하시면 카카오 채널로 바로 연동됩니다.
              </p>
            </div>

          </div>

          {/* Right Column: Dynamic Proposal Inquiry Form */}
          <div className="lg:col-span-7 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-xs relative">
            
            {!isSubmitted ? (
              <form id="form-design-inquiry" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-950">간편 프로젝트 설계 문의</h3>
                  <p className="text-xs text-gray-400 mt-1">간단한 가이드라인을 작성해 주시면 24시간 이내로 포인트를 분석하여 답변드립니다.</p>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Brand/Client Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="input-brand-name" className="text-xs font-bold text-gray-700">
                      회사명 / 개인명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-brand-name"
                      type="text"
                      required
                      placeholder="예: 니파인"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-malachite transition-colors"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="input-client-contact" className="text-xs font-bold text-gray-700">
                      연락처(이메일 혹은 카카오톡ID) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-client-contact"
                      type="text"
                      required
                      placeholder="예: dn_designn@naver.com"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-malachite transition-colors"
                    />
                  </div>
                </div>

                {/* Selector Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Contact Mode */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-700">
                      회신 방법 선호
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="contact-mode-email"
                        onClick={() => setContactMethod('email')}
                        className={`py-3 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          contactMethod === 'email'
                            ? 'bg-malachite text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        이메일 회신
                      </button>
                      <button
                        type="button"
                        id="contact-mode-kakao"
                        onClick={() => setContactMethod('kakao')}
                        className={`py-3 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          contactMethod === 'kakao'
                            ? 'bg-malachite text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        카카오톡 ID 회신
                      </button>
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="select-project-type" className="text-xs font-bold text-gray-700">
                      프로젝트 종류
                    </label>
                    <select
                      id="select-project-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-malachite transition-colors cursor-pointer"
                    >
                      <option>브랜드 로고 (BI/CI)</option>
                      <option>브로슈어 / 리플렛</option>
                      <option>월그래픽</option>
                      <option>웹 상세페이지 / 랜딩페이지</option>
                      <option>기타 디자인 문의</option>
                    </select>
                  </div>
                </div>

                {/* Additional Needs Text Area */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="textarea-message" className="text-xs font-bold text-gray-700">
                    원하시는 구체적 디자인 톤앤매너 혹은 제작 요청 사항
                  </label>
                  <textarea
                    id="textarea-message"
                    rows={11}
                    placeholder={`1. 프로젝트 일정 :\n2. 업종 / 서비스 설명 :\n3. 자사 홈페이지 주소 :\n4. 원하는 컨셉 키워드 3개 :\n5. 레퍼런스 주소 :\n6. 메인 컬러 / 서브 컬러 :\n7. 원하시는 서비스 : (사이즈 및 개수)\n8. 예산 :\n9. 상담 가능 시간 :`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-hidden focus:border-malachite transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Error message */}
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  id="btn-submit-proposal"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-950 text-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-gray-800 disabled:bg-gray-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 text-malachite animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-malachite" />
                  )}
                  {isSubmitting ? '제출 중...' : '프로젝트 무료 상담 가이드 제출하기'}
                </button>
              </form>
            ) : (
              // Submitted Success State - Proposal receipt card
              <div id="proposal-receipt-card" className="flex flex-col gap-6 text-center py-6">
                <div className="w-16 h-16 bg-malachite-light text-malachite rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-xl font-extrabold text-gray-950">프로젝트 설계서가 제출되었습니다!</h3>
                  <p className="text-xs text-gray-400 mt-1">접수번호: NF-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>

                {/* Receipt Ticket Details */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left max-w-md mx-auto w-full shadow-inner relative overflow-hidden">
                  {/* Decorative Ticket Cuts */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 border-r border-gray-200 rounded-full -translate-y-1/2" />
                  <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 border-l border-gray-200 rounded-full -translate-y-1/2" />

                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 text-center">
                    Proposal Receipt Details
                  </h4>

                  <ul className="space-y-2.5 text-xs">
                    <li className="flex justify-between">
                      <span className="text-gray-400 font-medium">인벤터 / Client</span>
                      <span className="font-bold text-gray-800">{brandName}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400 font-medium">연락처 / Contact</span>
                      <span className="font-semibold text-gray-800 font-mono">{clientContact}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400 font-medium">분야 / Category</span>
                      <span className="font-bold text-malachite-dark">{projectType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400 font-medium">회신 / Reply via</span>
                      <span className="font-semibold text-gray-800 uppercase text-[10px] bg-gray-100 px-2 py-0.5 rounded-sm">
                        {contactMethod}
                      </span>
                    </li>
                  </ul>
                  
                  {message.trim().length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                      <p className="text-[10px] font-mono text-gray-400 font-bold mb-1">MEMO / INSTRUCTIONS</p>
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "{message}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    선택하신 회신 방법({contactMethod === 'email' ? '이메일' : '카카오 ID'})에 맞춰 담당 총괄 디렉터가 포인트를 심층 분석하여 신속히 연락해 드리겠습니다.
                  </p>
                  
                  <button
                    id="btn-reset-proposal-form"
                    onClick={handleResetForm}
                    className="mt-6 text-xs text-gray-400 hover:text-malachite underline font-semibold transition-colors cursor-pointer"
                  >
                    수정하기 혹은 다른 제품 문의 접수
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
