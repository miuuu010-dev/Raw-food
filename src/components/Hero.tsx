import React from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick }) => {
  return (
    <section id="hero" className="relative bg-[#F8F5EE] border-b border-[#E8E2D3] pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Subtle organic background foliage glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E3EBDD]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#EFE8D6]/80 blur-2xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top clean text kicker (zero-pill rule) */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#34653D] tracking-wide mb-3">
              <span>국내산 100% 원료</span>
              <span aria-hidden="true" className="text-[#8FA68E]">·</span>
              <span>동결건조 자연식</span>
              <span aria-hidden="true" className="text-[#8FA68E]">·</span>
              <span>합성첨가물 무첨가</span>
            </div>

            {/* MANDATORY HUGE HEADLINE: "하루 한잔, 간편한 한끼" */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#19351C] leading-[1.2] sm:leading-[1.15] tracking-tight mb-6">
              하루 한잔, <br className="hidden sm:inline" />
              <span className="text-[#285731] underline decoration-[#A9C79B] decoration-4 underline-offset-8">
                간편한 한끼
              </span>
            </h1>

            {/* Subtitle with large, clear text focused on ingredients and convenience */}
            <p className="text-lg sm:text-2xl text-[#3E4A3B] leading-relaxed mb-8 sm:mb-10 font-normal">
              바쁜 아침, 물이나 우유에 가볍게 흔들어 마시는 순수 생식.<br className="hidden sm:inline" />
              국내산 <strong className="font-bold text-[#19351C]">50가지 통곡물과 신선 채소</strong>를 
              정직하게 한 포에 담아 담백하고 든든합니다.
            </p>

            {/* MANDATORY LARGE ORDER BUTTON & SECONDARY ACTION */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <button
                type="button"
                onClick={onOrderClick}
                className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 text-xl sm:text-2xl font-black text-white bg-[#24522B] hover:bg-[#1B3F21] active:scale-[0.98] rounded-2xl shadow-lg shadow-[#24522B]/20 transition-all cursor-pointer flex items-center justify-center gap-3 border border-[#1B3F21]"
              >
                <span>지금 주문하기</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>

              <a
                href="#ingredients"
                className="w-full sm:w-auto px-6 py-5 sm:py-6 text-lg sm:text-xl font-bold text-[#2A482A] bg-[#EBE4D5] hover:bg-[#E3DC唯C] hover:bg-[#E2DACB] rounded-2xl transition-colors text-center border border-[#D8CEBC]"
              >
                50가지 원료 보기
              </a>
            </div>

            {/* Trust points for users of all ages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full pt-4 border-t border-[#DFD8C7] text-[#475543] text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B6035] shrink-0" />
                <span>100% 우리 땅 국내산 원료</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B6035] shrink-0" />
                <span>영양 보존 동결건조 공법</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2B6035] shrink-0" />
                <span>1포씩 뜯는 이지컷 스틱</span>
              </div>
            </div>

          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F3] border-2 border-[#D8CFBD] rounded-3xl p-6 sm:p-8 shadow-sm relative">
              
              {/* Product Visual Container with Natural Styling */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#EFEADF] to-[#E5DFCFC] p-6 sm:p-8 border border-[#DDD3BF] flex flex-col items-center text-center overflow-hidden">
                
                {/* Visual Drink & Bowl Illustration */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 flex items-center justify-center">
                  
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-[#E0EEDC] rounded-full filter blur-xl opacity-70" />

                  {/* Aesthetic Glass Shake Graphic */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Glass Cup */}
                    <div className="w-24 sm:w-28 h-36 sm:h-40 bg-gradient-to-b from-white/80 via-[#D1DEC8]/90 to-[#B8CCAE]/90 rounded-b-3xl rounded-t-lg border-2 border-white/90 shadow-lg relative overflow-hidden backdrop-blur-sm flex flex-col justify-end p-2">
                      {/* Fluid Level */}
                      <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-[#608655] to-[#8FA980] rounded-b-2xl relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-2 bg-white/40 rounded-full" />
                        {/* Tiny grain particles */}
                        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#E3EDDC]/80" />
                        <div className="absolute bottom-7 right-4 w-1.5 h-1.5 rounded-full bg-[#F3F7ED]/70" />
                        <div className="absolute bottom-12 left-5 w-2 h-2 rounded-full bg-[#E5EFE0]/60" />
                      </div>
                      {/* Glass Straw */}
                      <div className="absolute -top-6 right-6 w-2.5 h-44 bg-[#C2D8BA]/70 rounded-full rotate-12 border border-white/70" />
                    </div>
                  </div>

                  {/* Left Grain Bowl Accent */}
                  <div className="absolute -bottom-2 -left-3 bg-[#E9E2D0] border-2 border-[#D6CBB5] rounded-full p-2.5 shadow-md flex items-center gap-1.5">
                    <span className="text-xl">🌾</span>
                    <span className="text-xs font-bold text-[#453E31]">국내산 현미·보리</span>
                  </div>

                  {/* Right Vegetable Accent */}
                  <div className="absolute -top-2 -right-2 bg-[#E1EDDB] border-2 border-[#BCD4B4] rounded-full p-2.5 shadow-md flex items-center gap-1.5">
                    <span className="text-xl">🥬</span>
                    <span className="text-xs font-bold text-[#2A482A]">케일·신선초</span>
                  </div>
                </div>

                {/* Card description */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1D3A20] mb-1">
                    하루생식 50곡 순수 한끼
                  </h3>
                  <p className="text-sm sm:text-base text-[#576453]">
                    1박스 30포 (한 달 분) · 전용 보틀 증정
                  </p>
                  
                  <div className="mt-4 inline-flex items-center justify-center gap-3 bg-[#FAF8F2] px-4 py-2.5 rounded-xl border border-[#DED4C1]">
                    <span className="text-sm text-[#7D7364] line-through">48,000원</span>
                    <span className="text-xl sm:text-2xl font-black text-[#26532F]">
                      39,000원
                    </span>
                    <span className="text-xs font-semibold text-[#8B4826] bg-[#F8E8DF] px-2 py-0.5 rounded">
                      무료배송
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Feature */}
              <div className="mt-4 p-3.5 bg-[#F2EDE1] rounded-xl text-center">
                <p className="text-sm sm:text-base font-medium text-[#465342]">
                  🥄 <strong>준비 시간 단 1분!</strong> 물 200ml에 넣고 흔들면 끝
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
