import React, { useState } from 'react';
import { FAQS } from '../data/saengsikData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F5F1E8] border-b border-[#E3DAC9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#29592F] mb-3">
            <HelpCircle className="w-5 h-5 text-[#2C6237]" />
            <span>궁금증을 풀어드려요</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#19341D] leading-tight mb-3">
            자주 묻는 질문
          </h2>
          <p className="text-base sm:text-lg text-[#52604F]">
            하루생식에 관해 고객님들이 가장 자주 문의하시는 내용입니다.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F2] border-2 border-[#D8CEBC] rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F2ECE0] transition-colors"
              >
                <span className="text-lg sm:text-xl font-bold text-[#1E3621] leading-snug">
                  Q. {faq.question}
                </span>
                <span className={`w-8 h-8 rounded-full bg-[#E4DDD0] flex items-center justify-center shrink-0 text-[#3C493A] transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180 bg-[#D4E4D0] text-[#1E4E26]' : ''
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </span>
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-base sm:text-lg text-[#445341] leading-relaxed border-t border-[#E8DECf] pt-4 bg-[#F6F2E8]">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
