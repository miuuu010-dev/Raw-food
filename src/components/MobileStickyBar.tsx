import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface MobileStickyBarProps {
  onOrderClick: () => void;
  price?: number;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOrderClick, price = 39000 }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#DFD6C6] px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-[#6B796A] font-medium leading-none">
            하루생식 50곡 (30포)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-[#1C3A20] tabular-nums leading-none">
              {price.toLocaleString()}원
            </span>
            <span className="text-[11px] text-[#29562E] font-bold">
              무료배송
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOrderClick}
          className="flex-1 max-w-[190px] py-3 px-4 bg-[#25522B] hover:bg-[#1E4324] active:scale-[0.98] text-white text-base font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>주문하기</span>
        </button>
      </div>
    </div>
  );
};
