/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioData } from '../data';
import { PortfolioItem, ProjectCategory } from '../types';
import { 
  Grid, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  Palette, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  Edit3, 
  RefreshCw,
  Upload
} from 'lucide-react';

export default function Works() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  
  // Synchronized state with smart merging of code-defined items and user edits
  const [projects, setProjects] = useState<PortfolioItem[]>(() => {
    try {
      const savedEditsStr = localStorage.getItem('nefine_portfolio_edits');
      let edits: Record<string, PortfolioItem> = {};
      
      if (savedEditsStr) {
        edits = JSON.parse(savedEditsStr);
      } else {
        // Safe Migration: Convert legacy nefine_portfolio_items to individual path-independent edits
        const savedItemsStr = localStorage.getItem('nefine_portfolio_items');
        if (savedItemsStr) {
          try {
            const savedItems = JSON.parse(savedItemsStr) as PortfolioItem[];
            if (Array.isArray(savedItems)) {
              savedItems.forEach(item => {
                const original = portfolioData.find(p => p.id === item.id);
                // Record it as an edit ONLY if the item has actually been altered by the user
                if (original && JSON.stringify(original) !== JSON.stringify(item)) {
                  edits[item.id] = item;
                }
              });
              localStorage.setItem('nefine_portfolio_edits', JSON.stringify(edits));
            }
          } catch (err) {
            console.error('Error migrating legacy items:', err);
          }
        }
      }

      // Merge current portfolioData from source code with user edits.
      // This is crucial: new items added to data.ts will instantly show up!
      return portfolioData.map(item => {
        let merged = { ...item };
        if (edits[item.id]) {
          merged = { ...merged, ...edits[item.id] };
        }
        // HEAL PATHS: If the browser localStorage has stale "/uploads/" dynamic files, but the code-defined portfolioData has beautiful Base64 strings, always heal them!
        if (merged.imageUrl && merged.imageUrl.startsWith('/uploads/') && item.imageUrl && item.imageUrl.startsWith('data:')) {
          merged.imageUrl = item.imageUrl;
        }
        if (merged.innerImageUrl && merged.innerImageUrl.startsWith('/uploads/') && item.innerImageUrl && item.innerImageUrl.startsWith('data:')) {
          merged.innerImageUrl = item.innerImageUrl;
        }
        return merged;
      });
    } catch (e) {
      console.error('Error loading portfolio state:', e);
      return portfolioData;
    }
  });

  // Fetch the persisted portfolio items from the non-disruptive JSON storage backend
  React.useEffect(() => {
    let isMounted = true;
    async function loadBackendPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        if (isMounted && data && data.success && Array.isArray(data.projects)) {
          // Robustly clean stale dynamic uploads from backend response as well
          const sanitized = data.projects.map((project: any) => {
            const original = portfolioData.find(p => p.id === project.id);
            const updated = { ...project };
            if (updated.imageUrl && updated.imageUrl.startsWith('/uploads/') && original && original.imageUrl && original.imageUrl.startsWith('data:')) {
              updated.imageUrl = original.imageUrl;
            }
            if (updated.innerImageUrl && updated.innerImageUrl.startsWith('/uploads/') && original && original.innerImageUrl && original.innerImageUrl.startsWith('data:')) {
              updated.innerImageUrl = original.innerImageUrl;
            }
            return updated;
          });
          setProjects(sanitized);
          localStorage.setItem('nefine_portfolio_items', JSON.stringify(sanitized));
        }
      } catch (err) {
        console.error('Error fetching backend portfolio custom items:', err);
      }
    }
    loadBackendPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [uploadingField, setUploadingField] = useState<'cover' | 'inner' | null>(null);

  const uploadImageToServer = async (file: File, type: 'cover' | 'inner') => {
    if (!editingProject) return;
    setUploadingField(type);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Data: reader.result,
              fileName: file.name
            })
          });
          const result = await response.json();
          if (result.success && result.imageUrl) {
            if (type === 'cover') {
              setEditingProject(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
            } else {
              setEditingProject(prev => prev ? { ...prev, innerImageUrl: result.imageUrl } : null);
            }
          } else {
            alert('이미지 업로드에 실패했습니다: ' + (result.error || 'Unknown error'));
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Upload handler error:', err);
      alert('업로드 중 오류 발생: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const categories: ProjectCategory[] = ['All', 'Brochure', 'WallGraphic', 'Logo', 'DetailPage'];

  const categoryDisplayNames: Record<ProjectCategory, string> = {
    All: '전체보기',
    Brochure: '브로슈어·리플렛',
    WallGraphic: '월그래픽',
    Logo: '로고',
    DetailPage: '상세페이지'
  };

  const filteredItems = selectedCategory === 'All'
    ? projects
    : projects.filter(item => item.category === selectedCategory);

  const handleUpdateProject = async (updated: PortfolioItem) => {
    const updatedList = projects.map(p => p.id === updated.id ? updated : p);
    setProjects(updatedList);
    
    try {
      // 1. Persist specific edit so it stays persistent on updates
      const savedEditsStr = localStorage.getItem('nefine_portfolio_edits');
      const edits = savedEditsStr ? JSON.parse(savedEditsStr) : {};
      edits[updated.id] = updated;
      localStorage.setItem('nefine_portfolio_edits', JSON.stringify(edits));

      // 2. Fallback full set saving for legacy compatibility
      localStorage.setItem('nefine_portfolio_items', JSON.stringify(updatedList));

      // 3. Persist permanently back to server: rewrites /src/data.ts safely
      const response = await fetch('/api/portfolio/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projects: updatedList })
      });
      const result = await response.json();
      if (!result.success) {
        console.error('Failed to save to files:', result.error);
      }
    } catch (e) {
      console.error('Error saving project update:', e);
    }
    
    setEditingProject(null);
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('모든 포트폴리오 데이터를 초기 원본 상태로 안전하게 복귀하시겠습니까? (서버 원본 복구 포함)')) {
      try {
        const response = await fetch('/api/portfolio/reset', {
          method: 'POST'
        });
        const result = await response.json();
        if (result.success) {
          // reload page to pickup default values natively from new imports
          localStorage.removeItem('nefine_portfolio_items');
          localStorage.removeItem('nefine_portfolio_edits');
          window.location.reload();
        } else {
          alert('데이터 복구 실패: ' + result.error);
        }
      } catch (err: any) {
        console.error('Reset target error:', err);
        // Local only fallback
        setProjects(portfolioData);
        localStorage.removeItem('nefine_portfolio_items');
        localStorage.removeItem('nefine_portfolio_edits');
        setEditingProject(null);
        setSelectedProject(null);
      }
    }
  };

  return (
    <section id="works" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-widest text-malachite uppercase bg-malachite-light px-3 py-1 rounded-sm">
              Works Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-4">
              Nefine<span className="text-malachite">.</span> 디자인 포트폴리오 컬렉션
            </h2>
          </div>
          
          {/* Editor Control Toggles */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              id="btn-toggle-design-editor"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-lg scale-[1.02]'
                  : 'bg-white hover:bg-gray-50 text-gray-650 border-gray-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              {isEditMode ? '편집 모드 완료' : '디자인 편집기 활성화'}
            </button>
            
            {isEditMode && (
              <button
                id="btn-reset-portfolio-default"
                onClick={handleResetToDefault}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-gray-150 hover:bg-red-50 hover:text-red-600 text-gray-500 transition-all border border-gray-200 flex items-center gap-1"
                title="기본값 복원"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                초기화
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              id={`filter-btn-${cat.toLowerCase()}`}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-malachite text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {categoryDisplayNames[cat]}
            </button>
          ))}
        </div>

        {/* Portfolio Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                id={`work-card-${item.id}`}
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => {
                  if (isEditMode) {
                    setEditingProject(item);
                  } else {
                    setSelectedProject(item);
                  }
                }}
                className={`group relative bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isEditMode ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-gray-100'
                }`}
              >
                {/* Image Area with Zoom & Hover Effect */}
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay indicator depending on edit mode */}
                  {isEditMode ? (
                    <div className="absolute inset-0 bg-amber-950/60 flex flex-col items-center justify-center gap-1">
                      <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-full shadow-lg">
                        <Edit3 className="w-4 h-4" />
                        대표 이미지 및 슬라이드 편집
                      </span>
                      <span className="text-[10px] text-gray-300 font-medium">클릭 시 수정창 열림</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-950 font-bold text-xs rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-4 h-4 text-malachite" />
                        자세히 보기
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Text Area */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-malachite bg-malachite/10 px-2 py-0.5 rounded-xs">
                      {categoryDisplayNames[item.category]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-malachite transition-colors">
                    {item.client}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detailed Modal Overlay */}
        <AnimatePresence>
          {selectedProject && !isEditMode && (
            <div
              id="details-modal-overlay"
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                id="details-modal-box"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  id="btn-close-modal"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-5 right-5 z-10 p-2.5 bg-gray-150 rounded-full hover:bg-gray-200 text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-10 flex flex-col gap-8">
                  
                  {/* Modal Header: Category & Client Name */}
                  <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-malachite px-2.5 py-1 rounded-sm">
                        {categoryDisplayNames[selectedProject.category]}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        {selectedProject.client}
                      </h3>
                    </div>
                  </div>

                  {/* Images Section - Highly Enlarged & Stacked */}
                  <div className="flex flex-col gap-8">
                    {/* 표지 이미지 (Cover Image) */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          표지 (Cover Image)
                        </span>
                      </div>
                      <div className="rounded-2xl overflow-hidden bg-gray-50 shadow-md border border-gray-100 w-full">
                        <img
                          src={selectedProject.imageUrl}
                          alt={`${selectedProject.title} 표지`}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover max-h-[650px] mx-auto hover:scale-[1.005] transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* 내지 이미지 (Inner Content) */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-malachite"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          내지 (Inner Content)
                        </span>
                      </div>
                      <div className="rounded-2xl overflow-hidden bg-gray-50 shadow-md border border-gray-100 w-full">
                        <img
                          src={selectedProject.innerImageUrl || 'https://picsum.photos/seed/placeholder/800/600'}
                          alt={`${selectedProject.title} 내지`}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover max-h-[650px] mx-auto hover:scale-[1.005] transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/800/600';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Panel */}
                  <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>고객사: {selectedProject.client}</span>
                    </div>
                    <a
                      href="#contact"
                      onClick={() => setSelectedProject(null)}
                      className="text-malachite hover:text-malachite-dark font-semibold flex items-center gap-1.5 transition-colors group/contact-link"
                    >
                      이런 스타일 작업 문의하기
                      <ArrowUpRight className="w-4 h-4 text-malachite group-hover/contact-link:translate-x-0.5 group-hover/contact-link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Design Editor Modal */}
        <AnimatePresence>
          {editingProject && isEditMode && (
            <div
              id="edit-modal-overlay"
              className="fixed inset-0 bg-gray-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setEditingProject(null)}
            >
              <motion.div
                id="edit-modal-box"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                      <Palette className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-955">디자인 정보 에디터</h3>
                      <p className="text-xs text-gray-505">원하는 이미지 경로 및 설명글을 설정하세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="p-1 px-2.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Editable Inputs Form */}
                <div className="space-y-6">
                  {/* Outer card info section */}
                  <div className="border border-amber-100 p-4 rounded-2xl bg-amber-50/10 space-y-4">
                    <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🏷️ 1. 외부 노출 정보 (포트폴리오 카드 표시)</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                          고객사 (Client)
                        </label>
                        <input
                          type="text"
                          className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 focus:border-amber-500 text-gray-900 bg-white"
                          value={editingProject.client}
                          onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                          placeholder="고객사를 입력해 주세요."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                          카탈로그 분류 (카테고리)
                        </label>
                        <select
                          className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 focus:border-amber-500 text-gray-800 bg-white"
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Exclude<ProjectCategory, 'All'> })}
                        >
                          <option value="Brochure">브로슈어·리플렛</option>
                          <option value="WallGraphic">월그래픽</option>
                          <option value="Logo">로고</option>
                          <option value="DetailPage">상세페이지</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. 표지 이미지 업로드 */}
                  <div className="border border-gray-150 p-4 rounded-2xl bg-gray-50/30">
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                      📸 2. 표지 이미지 등록 (Cover Image)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Direct Upload Area */}
                      <label className="border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white group/upload-cover h-[130px]">
                        {uploadingField === 'cover' ? (
                          <div className="flex flex-col items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mb-1.5" />
                            <span className="text-xs font-bold text-gray-750">서버로 업로드 중...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 group-hover/upload-cover:text-amber-500 mb-1.5 transition-colors" />
                            <span className="text-xs font-bold text-gray-700">기기에서 이미지 직접 선택</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingField !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              uploadImageToServer(file, 'cover');
                            }
                          }}
                        />
                      </label>

                      {/* Real-time image sandbox preview */}
                      <div className="relative h-[130px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <img
                          src={editingProject.imageUrl}
                          alt="Preview Cover"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/800/600';
                          }}
                        />
                        <span className="absolute bottom-2 left-2 text-[9px] bg-black/75 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          표지 미리보기
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <input
                        type="text"
                        className="w-full text-xs px-3.5 py-2.2 bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 focus:border-amber-500 font-mono text-gray-800"
                        value={editingProject.imageUrl}
                        onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                        placeholder="표지 이미지 주소 (https://... 또는 /src/assets/images/...)"
                      />
                    </div>
                  </div>

                  {/* 3. 내지 이미지 등록 */}
                  <div className="border border-gray-150 p-4 rounded-2xl bg-gray-50/30">
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                      📸 3. 내지 이미지 등록 (Inner Image)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Direct Upload Area */}
                      <label className="border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white group/upload-inner h-[130px]">
                        {uploadingField === 'inner' ? (
                          <div className="flex flex-col items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mb-1.5" />
                            <span className="text-xs font-bold text-gray-750">서버로 업로드 중...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 group-hover/upload-inner:text-amber-500 mb-1.5 transition-colors" />
                            <span className="text-xs font-bold text-gray-700">기기에서 이미지 직접 선택</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingField !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              uploadImageToServer(file, 'inner');
                            }
                          }}
                        />
                      </label>

                      {/* Real-time image sandbox preview */}
                      <div className="relative h-[130px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <img
                          src={editingProject.innerImageUrl || ''}
                          alt="Preview Inner"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/800/600';
                          }}
                        />
                        <span className="absolute bottom-2 left-2 text-[9px] bg-black/75 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          내지 미리보기
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <input
                        type="text"
                        className="w-full text-xs px-3.5 py-2.2 bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 focus:border-amber-500 font-mono text-gray-800"
                        value={editingProject.innerImageUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, innerImageUrl: e.target.value })}
                        placeholder="내지 이미지 주소 (https://... 또는 /src/assets/images/...)"
                      />
                    </div>
                  </div>

                </div>

                {/* Actions Panel */}
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2.5 text-xs font-bold rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateProject(editingProject)}
                    className="px-5 py-2.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    수정사항 적용 완료
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
