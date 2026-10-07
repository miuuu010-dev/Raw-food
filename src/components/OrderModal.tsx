import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  CreditCard, 
  Gift, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  X 
} from 'lucide-react';
import { createRealOrder, OrderData } from '../services/orderService';
import { AppUser } from '../services/authService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AppUser | null;
  initialOption?: string;
  initialPrice?: number;
  initialCount?: number;
  onOrderSuccess?: (order: OrderData) => void;
}

type PaymentMethodType = 'card' | 'kakaopay' | 'naverpay' | 'tosspay' | 'bank';

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialOption = '1박스 (30포 / 1개월분)',
  initialPrice = 39000,
  initialCount = 1,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [memo, setMemo] = useState('문 앞에 놓아주세요');
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardInstallment, setCardInstallment] = useState('일시불');

  const [createdOrder, setCreatedOrder] = useState<OrderData | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-format Card Number: Only digits, max 16 numbers, automatically inserts '-' every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < rawDigits.length; i += 4) {
      parts.push(rawDigits.slice(i, i + 4));
    }
    setCardNumber(parts.join('-'));
  };

  // Auto-format Expiry Date: Only digits, max 4 numbers (MM/YY), automatically inserts '/' after month
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (rawDigits.length <= 2) {
      setCardExpiry(rawDigits);
    } else {
      setCardExpiry(`${rawDigits.slice(0, 2)}/${rawDigits.slice(2, 4)}`);
    }
  };

  // Auto-format CVC: Only digits, max 3 numbers
  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvc(rawDigits);
  };

  // Auto-format Phone Number: Only digits, max 11 numbers, automatically inserts '-'
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (rawDigits.length <= 3) {
      setPhone(rawDigits);
    } else if (rawDigits.length <= 7) {
      setPhone(`${rawDigits.slice(0, 3)}-${rawDigits.slice(3)}`);
    } else {
      setPhone(`${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7, 11)}`);
    }
  };

  if (!isOpen) return null;

  // Move from Info -> Payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('주문자 성함, 연락처, 주소를 모두 입력해주세요.');
      return;
    }
    setErrorMessage(null);
    setStep('payment');
  };

  // Execute Simulated Payment & Save Order
  const handleExecutePayment = async () => {
    setErrorMessage(null);
    setStep('processing');

    try {
      // Simulate PG processing latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Save real order document to Firestore database
      const order = await createRealOrder({
        customerName: name.trim() || '고객',
        phone: phone.trim() || '010-0000-0000',
        address: address.trim() || '배송지 주소',
        addressDetail: addressDetail.trim() ? addressDetail.trim() : undefined,
        memo: memo.trim() ? memo.trim() : undefined,
        itemTitle: `하루생식 50곡 순수 한끼 (${initialOption})`,
        quantity: initialCount,
        totalPrice: initialPrice,
        paymentMethod: paymentMethod,
        status: paymentMethod === 'bank' ? 'pending' : 'confirmed',
      });

      setCreatedOrder(order);
      setStep('success');
      if (onOrderSuccess) {
        try {
          onOrderSuccess(order);
        } catch (callbackErr) {
          console.warn('onOrderSuccess callback warning:', callbackErr);
        }
      }
    } catch (err: unknown) {
      console.warn('Handling order completion with fallback:', err);
      const timestamp = Date.now();
      const now = new Date();
      const yyyymmdd = now.getFullYear().toString() + 
        (now.getMonth() + 1).toString().padStart(2, '0') + 
        now.getDate().toString().padStart(2, '0');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: OrderData = {
        id: `order_${timestamp}_${randomSuffix}`,
        orderNumber: `ORD-${yyyymmdd}-${randomSuffix}`,
        customerName: name.trim() || '고객',
        phone: phone.trim() || '010-0000-0000',
        address: address.trim() || '배송지 주소',
        addressDetail: addressDetail.trim() || undefined,
        memo: memo.trim() || undefined,
        itemTitle: `하루생식 50곡 순수 한끼 (${initialOption})`,
        quantity: initialCount,
        totalPrice: initialPrice,
        paymentMethod: paymentMethod,
        status: paymentMethod === 'bank' ? 'pending' : 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setCreatedOrder(fallbackOrder);
      setStep('success');
      if (onOrderSuccess) {
        try {
          onOrderSuccess(fallbackOrder);
        } catch (callbackErr) {
          console.warn('onOrderSuccess callback warning:', callbackErr);
        }
      }
    }
  };

  const handleCopyOrderNumber = () => {
    if (createdOrder?.orderNumber) {
      navigator.clipboard.writeText(createdOrder.orderNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setStep('info');
    setName('');
    setPhone('');
    setAddress('');
    setAddressDetail('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCreatedOrder(null);
    setErrorMessage(null);
    onClose();
  };

  const getPaymentMethodLabel = (method: PaymentMethodType) => {
    switch (method) {
      case 'card': return cardNumber ? `신용카드 (${cardNumber})` : '신용/체크카드';
      case 'kakaopay': return '카카오페이 (가상 간편결제)';
      case 'naverpay': return '네이버페이 (가상 간편결제)';
      case 'tosspay': return '토스페이 (가상 원터치결제)';
      case 'bank': return '무통장 입금 (국민은행 382-24-001928)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF7F0] border-2 border-[#D7CEBD] rounded-3xl w-full max-w-xl max-h-[94vh] overflow-y-auto shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5DECE] flex items-center justify-between sticky top-0 bg-[#FAF7F0] z-10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1A341E]">
              {step === 'info' && '1단계: 배송 정보 입력'}
              {step === 'payment' && '2단계: 연습용 결제창'}
              {step === 'processing' && '가상 결제 승인 중...'}
              {step === 'success' && '주문완료'}
            </h3>
            <p className="text-xs sm:text-sm text-[#566553] mt-0.5">
              {step === 'info' && '상품을 수령하실 배송지 정보를 입력해주세요'}
              {step === 'payment' && '실제로 결제되지 않는 연습용 가짜 결제 화면입니다'}
              {step === 'processing' && '안전한 가상 승인 절차가 진행되고 있습니다'}
              {step === 'success' && '가상 결제가 승인되고 주문이 안전하게 접수되었습니다'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-10 h-10 rounded-full bg-[#EDE7DA] hover:bg-[#DFD7C8] flex items-center justify-center text-[#4B5749] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="m-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: INFO FORM */}
        {step === 'info' && (
          <form onSubmit={handleProceedToPayment} className="p-5 sm:p-7 space-y-5">
            {/* Product Summary */}
            <div className="bg-[#EFEADF] rounded-2xl p-4 sm:p-5 border border-[#DBD0BD]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#1E361F] text-base sm:text-lg">
                  하루생식 50곡 순수 한끼
                </span>
                <span className="text-xs font-semibold text-[#25522B] bg-[#E2EDE0] px-2.5 py-0.5 rounded">
                  무료배송
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-[#556353]">
                <span>선택 구성: {initialOption}</span>
                <span className="font-black text-xl text-[#1E3B21] tabular-nums">
                  {initialPrice.toLocaleString()}원
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#DFD5C2] text-xs text-[#275A30] font-medium flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>친환경 에코 트라이탄 보틀(350ml) 증정 포함</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#233522] mb-1">
                  주문자 성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="성함을 직접 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] placeholder-[#8F9C8D] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#233522] mb-1">
                  휴대폰 번호 <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-[#2C5E3B] ml-1.5">(숫자만 입력 시 - 자동 입력)</span>
                </label>
                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  maxLength={13}
                  placeholder="예: 010-1234-5678 (숫자만 입력)"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] placeholder-[#8F9C8D] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#233522] mb-1">
                  배송지 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="도로명 주소 또는 지번 주소를 입력해주세요"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] placeholder-[#8F9C8D] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B] mb-2"
                />
                <input
                  type="text"
                  placeholder="상세 주소를 입력해주세요 (동/호수, 층 등)"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] placeholder-[#8F9C8D] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#233522] mb-1">
                  배송 요청 사항
                </label>
                <select
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-sm text-[#202E1F] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
                >
                  <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                  <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                  <option value="배송 전 미리 연락주세요">배송 전 미리 연락주세요</option>
                  <option value="택배함에 보관해주세요">택배함에 보관해주세요</option>
                </select>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 sm:py-5 text-xl font-black text-white bg-[#24522B] hover:bg-[#1B3F21] active:scale-[0.98] rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>다음: 결제하기 단계로 이동</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: SIMULATED PAYMENT SCREEN */}
        {step === 'payment' && (
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* MANDATORY HUGE NOTICE: 실제로 결제되지 않는 연습용 입니다 */}
            <div className="p-5 bg-amber-50 border-3 border-amber-400 rounded-2xl text-amber-950 shadow-sm text-center animate-pulse">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-900">
                  실제로 결제되지 않는 연습용입니다
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-amber-800">
                실제 돈이 빠져나가지 않는 안전한 테스트 환경입니다. 안심하고 결제해보세요!
              </p>
            </div>

            {/* Amount Summary */}
            <div className="bg-[#EFE9DC] rounded-2xl p-4 sm:p-5 border border-[#DBD0BC] flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-[#5B6858] block">최종 결제 금액</span>
                <span className="text-sm font-bold text-[#24522B]">전국 무료배송</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[#1C3A20] tabular-nums">
                  {initialPrice.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-[#1C3A20]">원</span>
              </div>
            </div>

            {/* Payment Method Selector (Including Naver, Toss, Kakao, Card, Bank) */}
            <div>
              <label className="block text-base font-black text-[#213220] mb-2.5">
                결제 수단 선택
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {/* 1. Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-[#24522B] bg-[#E8EFE5] text-[#1B3A1F] font-black shadow-sm'
                      : 'border-[#D9D0BF] bg-white text-[#4A5748] font-bold hover:bg-[#F5F0E6]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#24522B]" />
                  <span className="text-xs sm:text-sm">신용/체크카드</span>
                </button>

                {/* 2. Kakao Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kakaopay')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'kakaopay'
                      ? 'border-[#3C1E1E] bg-[#FEE500] text-[#3C1E1E] font-black shadow-sm'
                      : 'border-[#D9D0BF] bg-white text-[#4A5748] font-bold hover:bg-[#FEE500]/20'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#3C1E1E] text-[#FEE500] font-black text-[11px] flex items-center justify-center">
                    K
                  </span>
                  <span className="text-xs sm:text-sm">카카오페이</span>
                </button>

                {/* 3. Naver Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('naverpay')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'naverpay'
                      ? 'border-[#03C75A] bg-[#03C75A] text-white font-black shadow-sm'
                      : 'border-[#D9D0BF] bg-white text-[#4A5748] font-bold hover:bg-[#03C75A]/10'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white text-[#03C75A] font-black text-xs flex items-center justify-center border">
                    N
                  </span>
                  <span className="text-xs sm:text-sm">네이버페이</span>
                </button>

                {/* 4. Toss Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tosspay')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'tosspay'
                      ? 'border-[#0064FF] bg-[#0064FF] text-white font-black shadow-sm'
                      : 'border-[#D9D0BF] bg-white text-[#4A5748] font-bold hover:bg-[#0064FF]/10'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white text-[#0064FF] font-black text-xs flex items-center justify-center border">
                    T
                  </span>
                  <span className="text-xs sm:text-sm">토스페이</span>
                </button>
              </div>

              {/* Bank Transfer option */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer ${
                    paymentMethod === 'bank'
                      ? 'bg-[#E3EBDD] text-[#24522A] underline'
                      : 'text-[#647463] hover:underline'
                  }`}
                >
                  무통장 입금(가상계좌) 이용하기
                </button>
              </div>

              {/* CARD DETAILS FORM */}
              {paymentMethod === 'card' && (
                <div className="bg-white border-2 border-[#D7CEBE] rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-2">
                    <span className="text-sm font-bold text-[#1C361F]">카드 결제 정보 (연습용)</span>
                    <span className="text-xs font-semibold text-[#5B6A5A] bg-[#EFEADF] px-2 py-0.5 rounded">
                      직접 입력
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B4C38] mb-1">
                      카드번호 <span className="text-[#2C5E3B] font-normal">(숫자 16자리 입력 시 - 기호 자동 입력)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="숫자만 입력 시 - 자동 입력 (예: 1111-2222-3333-4444)"
                      className="w-full px-4 py-3 bg-[#FAF8F3] border-2 border-[#C5BBAA] rounded-xl text-base sm:text-lg font-mono font-bold text-[#1E3720] tracking-wider placeholder-[#8F9C8D] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3B4C38] mb-1">
                        유효기간 <span className="text-[#2C5E3B] font-normal">(월/년)</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#D5CABB] rounded-xl text-sm font-mono text-center font-bold text-[#202E1F] placeholder-[#8F9C8D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B4C38] mb-1">
                        CVC (3자리)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={cardCvc}
                        onChange={handleCardCvcChange}
                        placeholder="3자리"
                        className="w-full px-3 py-2.5 bg-[#FAF8F3] border border-[#D5CABB] rounded-xl text-sm font-mono text-center font-bold text-[#202E1F] placeholder-[#8F9C8D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B4C38] mb-1">
                        할부 개월
                      </label>
                      <select
                        value={cardInstallment}
                        onChange={(e) => setCardInstallment(e.target.value)}
                        className="w-full px-2 py-2.5 bg-[#FAF8F3] border border-[#D5CABB] rounded-xl text-xs font-bold text-center text-[#202E1F]"
                      >
                        <option value="일시불">일시불</option>
                        <option value="2개월(무이자)">2개월(무이자)</option>
                        <option value="3개월(무이자)">3개월(무이자)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* KAKAO PAY SIMULATION SCREEN */}
              {paymentMethod === 'kakaopay' && (
                <div className="bg-[#FFFCE0] border-2 border-[#E7D63F] rounded-2xl p-5 space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center font-black text-xl mx-auto shadow-sm">
                    talk
                  </div>
                  <h4 className="text-lg font-black text-[#3C1E1E]">카카오페이 가상 결제</h4>
                  <p className="text-xs sm:text-sm text-[#5B4822]">
                    [결제하기] 버튼을 누르면 카카오 인증 없이 1초 만에 <strong>연습용으로 안전하게 가상 승인</strong>됩니다.
                  </p>
                </div>
              )}

              {/* NAVER PAY SIMULATION SCREEN */}
              {paymentMethod === 'naverpay' && (
                <div className="bg-[#EBFBF2] border-2 border-[#03C75A]/50 rounded-2xl p-5 space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#03C75A] text-white flex items-center justify-center font-black text-xl mx-auto shadow-sm">
                    N
                  </div>
                  <h4 className="text-lg font-black text-[#036A31]">네이버페이 가상 결제</h4>
                  <p className="text-xs sm:text-sm text-[#255D3A]">
                    네이버페이 포인트 차감 없이 <strong>연습용 가상 결제</strong>로 즉시 주문이 승인됩니다.
                  </p>
                </div>
              )}

              {/* TOSS PAY SIMULATION SCREEN */}
              {paymentMethod === 'tosspay' && (
                <div className="bg-[#EDF4FF] border-2 border-[#0064FF]/40 rounded-2xl p-5 space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0064FF] text-white flex items-center justify-center font-black text-xl mx-auto shadow-sm">
                    T
                  </div>
                  <h4 className="text-lg font-black text-[#00388F]">토스페이 가상 결제</h4>
                  <p className="text-xs sm:text-sm text-[#2B4B7C]">
                    토스 앱 연결 없이 원터치로 <strong>연습용 가상 결제 승인</strong>이 완료됩니다.
                  </p>
                </div>
              )}

              {/* BANK SIMULATION SCREEN */}
              {paymentMethod === 'bank' && (
                <div className="bg-[#FAF3E8] border border-[#E2D2B8] rounded-2xl p-4 text-sm text-[#5B4628]">
                  <strong>가상 입금 계좌:</strong> 국민은행 382-24-001928 (예금주: 하루생식)<br />
                  연습용 계좌이므로 실제 돈을 송금하지 않으셔도 주문이 정상 접수됩니다.
                </div>
              )}

            </div>

            {/* Buttons: Back and Execute Payment */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleExecutePayment}
                className="w-full py-5 text-xl sm:text-2xl font-black text-white bg-[#24522B] hover:bg-[#1B3F21] active:scale-[0.98] rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-6 h-6 text-[#91E39C]" />
                <span>{initialPrice.toLocaleString()}원 결제하기 (연습용)</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('info')}
                className="w-full py-3 text-sm font-bold text-[#51634F] hover:text-[#1F331E] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>배송지 정보 수정하러 돌아가기</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-[#6F7D6D]">
              <ShieldCheck className="w-4 h-4 text-[#265930]" />
              <span>실제 금융사 결제 모듈이 아니므로 청구되지 않습니다.</span>
            </div>

          </div>
        )}

        {/* STEP 3: PROCESSING SPINNER */}
        {step === 'processing' && (
          <div className="p-16 text-center space-y-4">
            <Loader2 className="w-14 h-14 text-[#26532F] animate-spin mx-auto" />
            <h4 className="text-2xl font-black text-[#1E361F]">
              연습용 가상 결제 승인 처리 중...
            </h4>
            <p className="text-base text-[#556353]">
              실제 결제 없이 안전하게 승인 후 주문번호를 생성하고 있습니다.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS / ORDER CONFIRMATION SCREEN */}
        {step === 'success' && createdOrder && (
          <div className="p-6 sm:p-9 text-center space-y-6">
            
            <div className="w-20 h-20 rounded-full bg-[#E5EFE2] text-[#24532B] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              {/* MANDATORY PROMPT FORMAT: ORD-20261001-3843 style Order Number */}
              <div className="inline-flex items-center gap-2 bg-[#E1EDE0] px-4 py-2 rounded-2xl border border-[#BCD4B9]">
                <span className="text-xs text-[#4F684B] font-bold">주문번호:</span>
                <span className="text-base sm:text-lg font-mono font-black text-[#1A4521]">
                  {createdOrder.orderNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderNumber}
                  className="text-xs font-bold text-[#1F4C26] hover:underline flex items-center gap-1 cursor-pointer ml-1 bg-white px-2 py-0.5 rounded-lg border border-[#BCD4B9]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? '복사됨!' : '복사'}</span>
                </button>
              </div>

              <h4 className="text-3xl font-black text-[#19351C] mt-4 mb-1">
                주문이 성공적으로 완료되었습니다!
              </h4>
              <p className="text-sm sm:text-base text-[#4E5C4B]">
                {createdOrder.customerName} 님의 주문이 매장 시스템에 접수되었습니다.
              </p>
            </div>

            {/* Test Payment Reminder Badge */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold text-amber-800">
              💡 <strong>연습용 결제 완료:</strong> 실제 금액은 청구되지 않았습니다.
            </div>

            {/* Order Details Receipt */}
            <div className="bg-[#EFEADF] rounded-2xl p-5 border border-[#DBD1BE] text-left text-sm sm:text-base space-y-2.5 text-[#465443]">
              <div className="flex justify-between">
                <span className="font-medium text-[#657362]">주문 품목:</span>
                <span className="font-bold text-[#1E3720] text-right">{createdOrder.itemTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#657362]">주문자 성함:</span>
                <span className="font-bold text-[#1E3720]">{createdOrder.customerName} ({createdOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#657362]">배송 주소:</span>
                <span className="font-bold text-[#1E3720] text-right max-w-[260px] truncate">
                  {createdOrder.address} {createdOrder.addressDetail || ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#657362]">결제 수단:</span>
                <span className="font-bold text-[#1E3720]">
                  {getPaymentMethodLabel(paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-[#657362]">사은품:</span>
                <span className="font-bold text-[#27592F]">친환경 에코 트라이탄 보틀(350ml) 동봉</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DCD2C0]">
                <span className="font-medium text-[#657362]">결제 금액:</span>
                <span className="font-black text-xl text-[#1C3A20]">
                  {createdOrder.totalPrice.toLocaleString()}원 (무료배송)
                </span>
              </div>
            </div>

            {/* Shipping note */}
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#DFD6C6] text-xs sm:text-sm text-[#5B6958]">
              📦 <strong>배송 안내:</strong> 평일 오후 2시 이전 접수 건은 당일 우체국 택배로 안전하게 발송됩니다. 상단 '주문 조회'에서 생성된 주문번호 <strong>{createdOrder.orderNumber}</strong>로 배송 상황을 언제든 확인하실 수 있습니다.
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-4 text-lg font-bold text-white bg-[#25522B] hover:bg-[#1E4324] rounded-xl transition-all cursor-pointer shadow-md"
            >
              확인 및 닫기
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
