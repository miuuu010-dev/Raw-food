import React, { useState } from 'react';
import { INGREDIENTS_50, Ingredient } from '../data/saengsikData';
import { Search, ShieldCheck, Sparkles, Sprout, Wind } from 'lucide-react';

export const IngredientsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '전체 원료 (50종)' },
    { id: 'grain', label: '통곡물·두류 (18종)' },
    { id: 'vegetable', label: '신선 채소·근채 (16종)' },
    { id: 'mushroom_seaweed', label: '버섯·해조류 (8종)' },
    { id: 'fruit_seed', label: '과일·씨앗류 (8종)' },
  ];

  const filteredIngredients = INGREDIENTS_50.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="ingredients" className="py-16 sm:py-24 bg-[#F5F1E8] border-b border-[#E3DAC9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Big Fonts */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#29562E] mb-3">
            <Sprout className="w-5 h-5 text-[#306637]" />
            <span>100% 국내산 자연 원료의 힘</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A341D] leading-tight mb-5">
            국내산 50가지 곡물과 채소로<br />
            정직하게 만들었습니다
          </h2>
          
          <p className="text-lg sm:text-xl text-[#4A5747] leading-relaxed">
            자연이 키운 50가지 우리 땅 원료를 엄선하여 담았습니다.<br className="hidden sm:inline" />
            열을 가하지 않는 동결건조 방식으로 원료 본연의 맛과 풍미를 고스란히 지켰습니다.
          </p>
        </div>

        {/* 3 Core Principles Cards (Ingredients & Convenience focused, NO false medical claims) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          <div className="bg-[#FAF8F3] border-2 border-[#D9CFC0] rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E2ECE0] text-[#24522A] flex items-center justify-center font-bold text-xl mb-4">
              01
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C361F] mb-3">
              100% 국내산 원료 엄선
            </h3>
            <p className="text-base sm:text-lg text-[#515F4E] leading-relaxed">
              통곡물, 밭에서 자란 잎채소와 뿌리채소, 청정 바다의 해조류까지 50가지 모든 원료를 우리 땅에서 정직하게 수확한 국내산만 고집합니다.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border-2 border-[#D9CFC0] rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E2ECE0] text-[#24522A] flex items-center justify-center font-bold text-xl mb-4">
              02
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C361F] mb-3">
              영하 40℃ 동결건조 공법
            </h3>
            <p className="text-base sm:text-lg text-[#515F4E] leading-relaxed">
              열풍으로 볶거나 찌지 않고, 신선한 원료를 영하 40도 이하에서 급속 동결건조하여 열로 인한 변형 없이 고유의 색과 맛을 유지합니다.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border-2 border-[#D9CFC0] rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E2ECE0] text-[#24522A] flex items-center justify-center font-bold text-xl mb-4">
              03
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C361F] mb-3">
              합성첨가물 무첨가 원칙
            </h3>
            <p className="text-base sm:text-lg text-[#515F4E] leading-relaxed">
              인공 감미료, 합성 착색료, 합성 보존료, 착향료를 전혀 넣지 않았습니다. 통곡물 고유의 담백하고 구수한 자연의 맛 그대로입니다.
            </p>
          </div>

        </div>

        {/* Interactive 50 Ingredients Directory */}
        <div className="bg-[#FDFCFA] border-2 border-[#D6CDBC] rounded-3xl p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8E0D2]">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1D3A20]">
                50가지 전성분 원산지 사전
              </h3>
              <p className="text-base sm:text-lg text-[#536150] mt-1">
                원하는 원료를 카테고리별로 확인하거나 직접 검색해보세요. (전 원료 국내산 100%)
              </p>
            </div>

            {/* Ingredient Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="곡물 또는 채소 이름 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F4EFE5] border border-[#D5CABB] rounded-xl text-base text-[#222E21] placeholder-[#7F8B7D] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B] focus:bg-white"
              />
              <Search className="w-5 h-5 text-[#6D7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Tabs (Single line with smooth wrap, clear button controls) */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#25542C] text-white shadow-md'
                    : 'bg-[#EDE7DA] text-[#424D40] hover:bg-[#E2DACB]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredIngredients.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8F5EE] border border-[#DFD6C6] hover:border-[#2C5E3B] rounded-xl p-3.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#576A54] mb-1">
                    <span>{item.categoryLabel}</span>
                    <span className="text-[#2B6035] bg-[#E3EFE0] px-1.5 py-0.5 rounded">
                      {item.origin}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#1E3420]">
                    {item.name}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#5B6758] mt-2 line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {filteredIngredients.length === 0 && (
            <div className="py-12 text-center text-[#6A7968]">
              <p className="text-lg">‘{searchQuery}’에 해당하는 원료를 찾을 수 없습니다.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 text-sm font-bold text-[#2A5C33] underline"
              >
                전체 원료 보기로 돌아가기
              </button>
            </div>
          )}

          {/* Bottom Transparency Notice */}
          <div className="mt-6 pt-4 border-t border-[#E8E0D2] flex flex-col sm:flex-row sm:items-center justify-between text-sm sm:text-base text-[#576453] gap-2">
            <span>🌾 <strong>총 50가지</strong> 통곡물(18종) + 채소(16종) + 해조·버섯(8종) + 과일·씨앗(8종)</span>
            <span className="text-[#29562E] font-medium">원산지: 대한민국 전남, 전북, 충북, 경북, 강원 등 전국 우수 산지</span>
          </div>

        </div>

      </div>
    </section>
  );
};
