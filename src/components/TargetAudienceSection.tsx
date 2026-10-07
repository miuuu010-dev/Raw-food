import React from 'react';
import { TARGET_AUDIENCE } from '../data/saengsikData';
import { AlarmClock, CheckCircle, CookingPot, HeartHandshake, Leaf } from 'lucide-react';

interface TargetAudienceSectionProps {
  onOrderClick: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ onOrderClick }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'target-morning':
        return <AlarmClock className="w-8 h-8 text-[#26552D]" />;
      case 'target-busy':
        return <CookingPot className="w-8 h-8 text-[#26552D]" />;
      case 'target-natural':
        return <Leaf className="w-8 h-8 text-[#26552D]" />;
      default:
        return <HeartHandshake className="w-8 h-8 text-[#26552D]" />;
    }
  };

  return (
    <section id="target" className="py-16 sm:py-24 bg-[#FAF7F0] border-b border-[#E5DECE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-sm sm:text-base font-bold text-[#2A5C33] tracking-wider mb-3">
            맞춤 식사 가이드
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A341E] leading-tight mb-4">
            이런 분께 추천해요
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5747] leading-relaxed">
            복잡한 준비 없이 정직한 자연 재료로 가볍고 든든하게 채우는 하루 습관
          </p>
        </div>

        {/* 3 Prominent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {TARGET_AUDIENCE.map((item) => (
            <div
              key={item.id}
              className="bg-[#FDFBF7] border-2 border-[#D9D0BF] hover:border-[#2C5E3B] rounded-3xl p-7 sm:p-8 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#E6F0E3] flex items-center justify-center">
                    {getIcon(item.id)}
                  </div>
                  <span className="text-3xl font-black text-[#8B9886] font-mono">
                    {item.number}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#1B351E] mb-2 leading-tight">
                  {item.title}
                </h3>
                
                {/* Card Subtitle */}
                <p className="text-base sm:text-lg font-semibold text-[#32693A] mb-6">
                  {item.subtitle}
                </p>

                {/* Points List */}
                <ul className="space-y-3.5 mb-6">
                  {item.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-base sm:text-lg text-[#445341] leading-snug">
                      <CheckCircle className="w-5 h-5 text-[#2C6237] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Summary */}
              <div className="pt-4 border-t border-[#EAE3D5] text-sm sm:text-base font-medium text-[#657362]">
                👉 하루생식 1포로 1분 만에 가볍게 해결
              </div>
            </div>
          ))}
        </div>

        {/* Big Conversion Callout in Target Section */}
        <div className="bg-[#EFE9DC] border-2 border-[#D5CABB] rounded-3xl p-8 sm:p-10 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-2xl sm:text-3xl font-black text-[#1B371F] mb-1">
              내일 아침부터 가볍고 든든하게 시작해보세요
            </h4>
            <p className="text-base sm:text-lg text-[#4C5B49]">
              국내산 50가지 곡물과 채소로 준비하는 정직한 하루 한잔
            </p>
          </div>

          <button
            type="button"
            onClick={onOrderClick}
            className="w-full sm:w-auto px-8 py-4 sm:py-5 text-xl font-bold text-white bg-[#26532F] hover:bg-[#1E4326] active:scale-[0.98] rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            지금 주문하기
          </button>
        </div>

      </div>
    </section>
  );
};
