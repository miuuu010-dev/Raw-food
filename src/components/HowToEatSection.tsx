import React, { useState } from 'react';
import { HOW_TO_STEPS, DRINK_COMBINATIONS } from '../data/saengsikData';
import { ArrowRight, Droplets, Flame, Milk, Sparkles, UtensilsCrossed } from 'lucide-react';

export const HowToEatSection: React.FC = () => {
  const [selectedLiquid, setSelectedLiquid] = useState<string>('water');

  const currentCombination = DRINK_COMBINATIONS.find((c) => c.id === selectedLiquid) || DRINK_COMBINATIONS[0];

  return (
    <section id="how-to-eat" className="py-16 sm:py-24 bg-[#F5F2E9] border-b border-[#E3DAC8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-sm sm:text-base font-bold text-[#2A5C33] tracking-wider mb-3">
            간편 섭취 가이드
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#19341D] leading-tight mb-4">
            물이나 우유에 타서 드세요
          </h2>
          <p className="text-lg sm:text-xl text-[#4C5B49] leading-relaxed">
            특별한 조리 도구 없이, 보틀이나 컵에 넣고 흔들면 1분 만에 완성됩니다.
          </p>
        </div>

        {/* 1 → 2 → 3 Step Sequence Cards with Prominent Large Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 relative">
          
          {HOW_TO_STEPS.map((stepItem, idx) => (
            <div
              key={stepItem.step}
              className="bg-[#FCFAF5] border-2 border-[#D7CEBE] hover:border-[#2C5E3B] rounded-3xl p-7 sm:p-8 shadow-sm relative flex flex-col justify-between transition-all"
            >
              <div>
                {/* Step Header with Large 1, 2, 3 badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#26532F] text-white flex items-center justify-center text-3xl font-black shadow-md">
                    {stepItem.step}
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[#356B3D] bg-[#E3EFE0] px-3 py-1 rounded-full">
                    STEP {stepItem.step}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#1C361F] mb-3 leading-snug">
                  {stepItem.title}
                </h3>

                {/* Step Action Description */}
                <p className="text-base sm:text-lg text-[#3B4838] leading-relaxed mb-6 font-medium">
                  {stepItem.action}
                </p>
              </div>

              {/* Step Tip */}
              <div className="bg-[#EFE9DD] rounded-2xl p-4 border border-[#DDD3C2]">
                <p className="text-sm sm:text-base text-[#52604F] leading-snug">
                  💡 <strong className="text-[#2C3829]">핵심 팁:</strong> {stepItem.tip}
                </p>
              </div>

              {/* Direction Indicator between cards (desktop only) */}
              {idx < 2 && (
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#25522B] text-white items-center justify-center shadow">
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Interactive Taste Recommendation: Water vs Milk vs Soy Milk */}
        <div className="bg-[#FBF9F3] border-2 border-[#D8CEBC] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1B361F] mb-2">
              취향에 맞게 골라 타보세요
            </h3>
            <p className="text-base sm:text-lg text-[#52614F]">
              어떤 음료에 타느냐에 따라 색다른 자연의 풍미를 즐길 수 있습니다.
            </p>
          </div>

          {/* Liquid Selector Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            {DRINK_COMBINATIONS.map((combo) => (
              <button
                key={combo.id}
                type="button"
                onClick={() => setSelectedLiquid(combo.id)}
                className={`w-full sm:w-auto px-6 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-3 border ${
                  selectedLiquid === combo.id
                    ? 'bg-[#25542C] text-white border-[#1F4525] shadow-md scale-[1.02]'
                    : 'bg-[#EDE7DA] text-[#434F41] border-[#DACFBF] hover:bg-[#E3DC唯C] hover:bg-[#E2DACB]'
                }`}
              >
                {combo.id === 'water' && <Droplets className="w-6 h-6" />}
                {combo.id === 'milk' && <Milk className="w-6 h-6" />}
                {combo.id === 'soymilk' && <Sparkles className="w-6 h-6" />}
                <span>{combo.name}</span>
              </button>
            ))}
          </div>

          {/* Active Liquid Guide Card */}
          <div className="bg-[#EFE9DD] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto border border-[#DBD1BE] text-center">
            <div className="inline-block text-sm sm:text-base font-bold text-[#234C28] bg-[#D7E8D3] px-3 py-1 rounded-full mb-3">
              {currentCombination.tag}
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-[#1C361F] mb-2">
              {currentCombination.name} 조합
            </h4>
            <p className="text-base sm:text-lg text-[#404D3E] leading-relaxed">
              {currentCombination.desc}
            </p>
          </div>

          {/* Golden Rule Note */}
          <div className="mt-8 text-center text-sm sm:text-base text-[#61705E]">
            ⚠️ <strong>온도 주의사항:</strong> 열에 약한 신선 원료의 특성을 살리기 위해 뜨거운 끓는 물 대신 시원한 물이나 미지근한 물에 타주세요.
          </div>

        </div>

      </div>
    </section>
  );
};
