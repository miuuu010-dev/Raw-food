import React from 'react';
import { ShieldAlert, Settings, ClipboardList } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
  onLookupClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onLookupClick }) => {
  return (
    <footer className="bg-[#EFEAE0] text-[#424F40] border-t border-[#DFD6C6] pt-12 pb-24 sm:pb-16 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Mandatory Regulatory Compliance Notice (General Food Disclaimer) */}
        <div className="bg-[#E6E0D2] border border-[#D5CABB] rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
          <ShieldAlert className="w-6 h-6 text-[#725227] shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-[#4E4738] leading-relaxed">
            <strong>[식품 등의 표시·광고에 관한 법률 안내]</strong> 본 제품은 질병의 예방 및 치료를 위한 의약품이 아닌, 국내산 통곡물과 채소를 동결건조하여 만든 <strong>일반식품</strong>입니다. 하루생식은 과장된 광고나 효능 대신 신선한 원재료와 정직한 간편함의 가치만을 전합니다.
          </div>
        </div>

        {/* Store Information */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#D8CEBD]">
          
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-xl font-black text-[#1E3A24] mb-3">
              <span className="w-8 h-8 rounded-full bg-[#D7E8D3] text-[#24542B] flex items-center justify-center text-sm font-serif">
                生
              </span>
              <span>하루생식 (HARU SAENGSIK)</span>
            </div>
            <p className="text-sm text-[#5C6A5A] leading-relaxed mb-4">
              우리 땅에서 자란 50가지 순수 통곡물과 채소로 정직하게 만든 건강한 한 끼 식사. 바쁜 일상 속 가볍고 든든한 하루를 응원합니다.
            </p>
            <div className="text-xs text-[#6F7C6E]">
              상호명: 하루생식 주식회사 · 대표자: 김하루 · 사업자등록번호: 214-88-01923<br />
              통신판매업신고: 2026-서울강남-01824호 · 식품제조가공업 제2023-019283호
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-bold text-[#1E3722] text-base mb-3">고객만족센터</h4>
            <div className="text-2xl font-black text-[#1F4824] mb-1 font-mono">
              1588-5050
            </div>
            <p className="text-xs sm:text-sm text-[#5B6A5A] leading-relaxed">
              운영시간: 평일 09:30 ~ 18:00 (점심시간 12:30 ~ 13:30)<br />
              주말 및 공휴일 휴무 · 카카오톡 플러스친구 [@하루생식]
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-[#1E3722] text-base mb-3">배송 및 반품 안내</h4>
            <p className="text-xs sm:text-sm text-[#5B6A5A] leading-relaxed mb-3">
              배송사: 우체국 택배 (전국 무료배송)<br />
              출고일: 평일 오후 2시 이전 결제 완료 시 당일 출고
            </p>

            <div className="flex items-center gap-2 pt-2">
              {onLookupClick && (
                <button
                  type="button"
                  onClick={onLookupClick}
                  className="text-xs font-bold text-[#2A5C33] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>내 주문조회</span>
                </button>
              )}
              {onAdminClick && (
                <>
                  <span className="text-[#A2ADA1]">·</span>
                  <button
                    type="button"
                    onClick={onAdminClick}
                    className="text-xs font-bold text-[#4B5E4A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>사장님 주문관리</span>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718070] gap-2">
          <p>© 2026 HARU SAENGSIK Corp. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">이용약관</a>
            <span>·</span>
            <a href="#" className="hover:underline">개인정보처리방침</a>
            <span>·</span>
            <a href="#" className="hover:underline">원산지 증명서 확인</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
