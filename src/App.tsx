import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { IngredientsSection } from './components/IngredientsSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { HowToEatSection } from './components/HowToEatSection';
import { ProductSection } from './components/ProductSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { SellerOrderDashboard } from './components/SellerOrderDashboard';
import { AuthModal } from './components/AuthModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { OrderData } from './services/orderService';
import { AppUser, getSavedUser, logoutUser } from './services/authService';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'seller'>('store');
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getSavedUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedOptionName, setSelectedOptionName] = useState('1박스 (30포 / 1개월분)');
  const [selectedPrice, setSelectedPrice] = useState(39000);
  const [selectedCount, setSelectedCount] = useState(1);

  // Checks if user is authenticated before allowing order
  const requireAuthThen = (action: () => void) => {
    if (!currentUser) {
      setAuthTriggerReason('주문하시려면 먼저 회원가입 또는 로그인을 해주세요.');
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
      return;
    }
    action();
  };

  // Opens the order modal with default product (requires login)
  const handleOpenOrder = () => {
    requireAuthThen(() => {
      setIsOrderModalOpen(true);
    });
  };

  // Opens order modal with specific selected option from the product section (requires login)
  const handleOpenOrderWithDetails = (quantity: number, optionName: string, totalPrice: number) => {
    requireAuthThen(() => {
      setSelectedCount(quantity);
      setSelectedOptionName(optionName);
      setSelectedPrice(totalPrice);
      setIsOrderModalOpen(true);
    });
  };

  const handleAuthSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setToastMessage(`${user.displayName || '회원'} 님 환영합니다!`);
    setTimeout(() => setToastMessage(null), 4000);

    // If user was in middle of ordering, resume order immediately
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => action(), 100);
    }
  };

  const handleLogout = async () => {
    const name = currentUser?.displayName || '회원';
    await logoutUser();
    setCurrentUser(null);
    setToastMessage(`${name} 님, 로그아웃되었습니다.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOrderSuccess = (order: OrderData) => {
    setToastMessage(`주문번호 ${order.orderNumber}번이 데이터베이스에 실제 접수되었습니다!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // If seller dashboard view is active, render the dedicated Seller Order Management Screen!
  if (currentView === 'seller') {
    return (
      <SellerOrderDashboard 
        onBackToStore={() => setCurrentView('store')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C342C] font-sans flex flex-col selection:bg-[#436A3E]/20 selection:text-[#1F3A1C]">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#25522B] text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm sm:text-base font-bold animate-bounce border border-[#1E4324]">
          <CheckCircle2 className="w-5 h-5 text-[#88D494] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-Zone Header (displays "윤성미 님 환영합니다" and prominent "주문관리" button) */}
      <Header 
        currentUser={currentUser}
        onOrderClick={handleOpenOrder} 
        onLookupClick={() => setIsLookupModalOpen(true)}
        onAdminClick={() => setCurrentView('seller')}
        onAuthClick={() => {
          setAuthTriggerReason(undefined);
          setIsAuthModalOpen(true);
        }}
        onLogoutClick={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero: Big "하루 한잔, 간편한 한끼" headline + Big "주문하기" button */}
        <Hero onOrderClick={handleOpenOrder} />

        {/* 2. Ingredients: 국내산 50가지 곡물, 채소 소개 */}
        <IngredientsSection />

        {/* 3. Target Audience: 이런 분께 좋아요 3가지 (아침 거르는 분, 끼니 챙기기 번거로운 분 등) */}
        <TargetAudienceSection onOrderClick={handleOpenOrder} />

        {/* 4. How To Eat: 물이나 우유에 타서 드세요 (1 → 2 → 3 순서 표시) */}
        <HowToEatSection />

        {/* 5. Product: 상품 1개와 가격, 큰 "주문하기" 버튼 */}
        <ProductSection onOrderClickWithDetails={handleOpenOrderWithDetails} />

        {/* 6. FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer with General Food Compliance Notice & Store Admin Link */}
      <Footer 
        onLookupClick={() => setIsLookupModalOpen(true)}
        onAdminClick={() => setCurrentView('seller')}
      />

      {/* Mobile Sticky Order Bar */}
      <MobileStickyBar onOrderClick={handleOpenOrder} price={selectedPrice} />

      {/* Email & Password Registration and Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
        triggerReason={authTriggerReason}
      />

      {/* Real Customer Checkout Modal (Stores to Cloud Firestore) */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currentUser={currentUser}
        initialOption={selectedOptionName}
        initialPrice={selectedPrice}
        initialCount={selectedCount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Customer Order & Delivery Lookup Modal */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />
    </div>
  );
}
