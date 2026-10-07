import React, { useState } from 'react';
import { PRODUCT_INFO } from '../data/saengsikData';
import { ArrowRight, Check, Gift, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';

interface ProductSectionProps {
  onOrderClickWithDetails: (quantity: number, optionName: string, totalPrice: number) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ onOrderClickWithDetails }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [customQuantity, setCustomQuantity] = useState<number>(1);

  const options = [
    {
      id: 'opt-1',
      title: '1박스 (30포 / 1개월분)',
      sub: '기본 구성 + 전용 보틀 1개 증정',
      price: 39000,
      origPrice: 48000,
      discountText: '18% 할인',
      boxCount: 1,
    },
    {
      id: 'opt-2',
      title: '2박스 (60포 / 2개월분 알뜰세트)',
      sub: '가장 많은 고객 선택 + 전용 보틀 2개 증정',
      price: 74000,
      origPrice: 96000,
      discountText: '22% 할인',
      boxCount: 2,
    },
    {
      id: 'opt-3',
      title: '3박스 (90포 / 온가족 패키지)',
      sub: '최대 혜택 + 전용 보틀 3개 증정',
      price: 108000,
      origPrice: 144000,
      discountText: '25% 할인',
      boxCount: 3,
    },
  ];

  const currentOption = options[selectedOptionIndex];
  const totalPrice = currentOption.price;

  const handleOrder = () => {
    onOrderClickWithDetails(currentOption.boxCount, currentOption.title, totalPrice);
  };

  return (
    <section id="product" className="py-16 sm:py-24 bg-[#FAF7F0] border-b border-[#E3DAC8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-sm sm:text-base font-bold text-[#27592F] tracking-wider mb-3">
            정직한 상품 안내
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#19351C] leading-tight mb-4">
            상품 안내 및 간편 주문
          </h2>
          <p className="text-lg sm:text-xl text-[#4B5A48] leading-relaxed">
            국내산 50가지 원료를 오롯이 담은 하루생식 1가지 본품에만 정성을 다합니다.
          </p>
        </div>

        {/* Featured Product Box */}
        <div className="bg-[#FCFAF5] border-2 border-[#D7CEBE] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Product Visual Representation */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-gradient-to-b from-[#EFE9DB] to-[#E5DFCFC] rounded-2xl p-8 border border-[#DDD3C2] flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Product Box Visual Artwork */}
                <div className="w-56 sm:w-64 h-64 sm:h-72 bg-[#F3EDE2] border-4 border-[#B9AA92] rounded-2xl shadow-xl flex flex-col items-center justify-between p-5 relative overflow-hidden">
                  
                  {/* Top Seal */}
                  <div className="w-full border-b-2 border-dashed border-[#C5B8A3] pb-2 flex items-center justify-between text-xs font-bold text-[#4B4031]">
                    <span>국내산 100%</span>
                    <span className="text-[#2C5E3B]">동결건조 50곡</span>
                  </div>

                  {/* Center Brand typography */}
                  <div className="my-auto text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#E5EFE2] text-[#2C5E3B] flex items-center justify-center text-xl font-serif font-black mb-2 shadow-inner">
                      生
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#1E361F] tracking-tight">
                      하루생식
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#5F6E5C] mt-1">
                      50곡 순수 한끼
                    </p>
                    <div className="mt-3 text-xs text-[#7B8B77] bg-white/70 py-1 px-3 rounded-full inline-block border border-[#DFE7DD]">
                      개별 이지컷 30포 (900g)
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="w-full bg-[#27532F] text-white text-[11px] font-bold py-1.5 rounded-lg text-center tracking-wide">
                    HARU SAENGSIK 50
                  </div>
                </div>

                {/* Free Gift Notice */}
                <div className="mt-5 w-full bg-[#E6EFE3] border border-[#BFD9B9] rounded-xl p-3 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-[#1E4E26]">
                  <Gift className="w-5 h-5 text-[#245D2D]" />
                  <span>구매 고객 전원 전용 트라이탄 보틀(350ml) 증정</span>
                </div>

              </div>
            </div>

            {/* Right: Product Purchase Module (Large fonts, Large button) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div>
                {/* Badge & Title */}
                <div className="flex items-center gap-2 mb-2 text-sm font-bold text-[#2A5C33]">
                  <span>{PRODUCT_INFO.badge}</span>
                  <span aria-hidden="true">·</span>
                  <span>무료배송</span>
                  <span aria-hidden="true">·</span>
                  <span>동결건조</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-[#1A341E] leading-snug mb-3">
                  {PRODUCT_INFO.name}
                </h3>

                <p className="text-base sm:text-lg text-[#52614F] leading-relaxed mb-6">
                  {PRODUCT_INFO.summary}
                </p>

                {/* Features Checkpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-sm sm:text-base text-[#3A4938]">
                  {PRODUCT_INFO.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-[#27592F] shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Package Options Selection */}
                <div className="space-y-3 mb-8">
                  <label className="block text-base sm:text-lg font-bold text-[#233521]">
                    구성 선택
                  </label>
                  {options.map((opt, idx) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionIndex(idx)}
                      className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedOptionIndex === idx
                          ? 'border-[#26532F] bg-[#F2EFE7] shadow-sm'
                          : 'border-[#DDD4C3] bg-[#FAF8F3] hover:bg-[#F4EFE5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedOptionIndex === idx
                              ? 'border-[#26532F] bg-[#26532F]'
                              : 'border-[#9E9382]'
                          }`}>
                            {selectedOptionIndex === idx && (
                              <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </span>
                          <span className="text-base sm:text-xl font-bold text-[#1D321F]">
                            {opt.title}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#616F5E] ml-7 mt-0.5">
                          {opt.sub}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm text-[#8D8271] line-through block">
                          {opt.origPrice.toLocaleString()}원
                        </span>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs sm:text-sm font-bold text-[#A84523]">
                            {opt.discountText}
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-[#1E4323] tabular-nums">
                            {opt.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Price Summary Bar */}
                <div className="bg-[#EFE9DC] rounded-2xl p-5 sm:p-6 mb-8 border border-[#DBD1BF] flex items-center justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-medium text-[#576453] block">
                      총 결제 예정 금액
                    </span>
                    <span className="text-xs sm:text-sm text-[#27592F] font-bold">
                      우체국 택배 무료배송
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black text-[#1A381E] tabular-nums">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1A381E]">원</span>
                  </div>
                </div>

              </div>

              {/* MANDATORY HUGE ORDER BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleOrder}
                  className="w-full py-5 sm:py-6 text-xl sm:text-2xl font-black text-white bg-[#24522B] hover:bg-[#1B3F21] active:scale-[0.98] rounded-2xl shadow-xl shadow-[#24522B]/20 transition-all cursor-pointer flex items-center justify-center gap-3 border border-[#193B1F]"
                >
                  <ShoppingCart className="w-7 h-7" />
                  <span>주문하기</span>
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>

                <p className="text-center text-xs sm:text-sm text-[#6A7867] mt-3">
                  평일 오후 2시 이전 주문 시 당일 무료 발송됩니다.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
