import React from 'react';
import { ClipboardList, LogIn, LogOut, Settings, ShoppingBag, User } from 'lucide-react';
import { AppUser } from '../services/authService';

interface HeaderProps {
  currentUser: AppUser | null;
  onOrderClick: () => void;
  onLookupClick: () => void;
  onAdminClick: () => void;
  onAuthClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser,
  onOrderClick, 
  onLookupClick, 
  onAdminClick,
  onAuthClick,
  onLogoutClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2D6] transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single element wordmark */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            className="group flex items-center gap-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#1E3A24]"
          >
            <span className="w-9 h-9 rounded-full bg-[#E5EFE2] text-[#2C5E3B] flex items-center justify-center text-lg font-serif shadow-inner">
              生
            </span>
            <span>하루생식</span>
          </a>

          {/* User Welcome Greeting on Header (when logged in) */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#DFD6C6]">
              <span className="w-7 h-7 rounded-full bg-[#E2EDE0] text-[#24522A] flex items-center justify-center text-xs font-bold">
                <User className="w-4 h-4" />
              </span>
              <span className="text-base font-black text-[#1E3E22]">
                <strong className="text-[#25542C] underline decoration-[#8FC791] decoration-2 underline-offset-4 font-black">
                  {currentUser.displayName || '회원'}
                </strong> 님 환영합니다
              </span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[15px] font-medium text-[#465144]">
          <a href="#hero" className="hover:text-[#204928] transition-colors">
            소개
          </a>
          <a href="#ingredients" className="hover:text-[#204928] transition-colors">
            50가지 원료
          </a>
          <a href="#target" className="hover:text-[#204928] transition-colors">
            이런 분께 추천
          </a>
          <a href="#how-to-eat" className="hover:text-[#204928] transition-colors">
            섭취 방법
          </a>
          <a href="#product" className="hover:text-[#204928] transition-colors">
            상품 안내
          </a>
          <button
            type="button"
            onClick={onLookupClick}
            className="hover:text-[#204928] transition-colors cursor-pointer flex items-center gap-1 text-[#335938] font-semibold"
          >
            <ClipboardList className="w-4 h-4" />
            <span>주문 조회</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Button, Login/Greeting & Admin link */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* If Logged In: Show Logout */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLogoutClick}
                className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-bold text-[#6D7B6C] hover:text-[#263825] hover:bg-[#EFE8D9] rounded-xl transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            /* If Not Logged In: Show Login / Sign Up button */
            <button
              type="button"
              onClick={onAuthClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#27532F] bg-[#E8EFE5] hover:bg-[#DCE7D9] rounded-xl transition-colors cursor-pointer border border-[#C5D8C1]"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인/가입</span>
            </button>
          )}

          {/* Prominent Seller Order Management Link */}
          <button
            type="button"
            onClick={onAdminClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#1E4324] bg-[#E2EDE0] hover:bg-[#D4E4D1] rounded-xl transition-all cursor-pointer border border-[#BFD5BD] shadow-2xs"
            title="판매자 주문관리 화면 열기"
          >
            <ClipboardList className="w-4 h-4 text-[#26532F]" />
            <span className="font-black">주문관리</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
          </button>

          {/* Order Button */}
          <button
            onClick={onOrderClick}
            type="button"
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-bold text-white bg-[#26532F] hover:bg-[#1E4326] active:scale-[0.98] rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>주문하기</span>
          </button>
        </div>
      </div>

      {/* Mobile Welcome Greeting Banner (visible when logged in on small screens) */}
      {currentUser && (
        <div className="md:hidden bg-[#E9EFE6] border-t border-[#D5E4D1] px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-bold text-[#1E3C21]">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#26532F] text-white flex items-center justify-center text-[10px]">
              ✓
            </span>
            <span>
              <strong>{currentUser.displayName || '회원'}</strong> 님 환영합니다
            </span>
          </div>
          <button
            type="button"
            onClick={onLogoutClick}
            className="text-xs text-[#5E6D5D] hover:underline"
          >
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
};
