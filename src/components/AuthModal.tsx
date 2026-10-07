import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Lock, Mail, User, X, Loader2 } from 'lucide-react';
import { 
  registerUser, 
  loginUser, 
  getFriendlyErrorMessage, 
  AppUser 
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
  triggerReason?: string; // e.g. "주문하시려면 먼저 로그인이 필요합니다"
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  triggerReason,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Password length validation (Easy Korean explanation for short password)
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('비밀번호가 너무 짧아요. 안전을 위해 6자 이상으로 입력해주세요.');
      return;
    }

    if (tab === 'signup') {
      if (!name.trim()) {
        setErrorMessage('성함(이름)을 입력해주세요.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('비밀번호와 비밀번호 확인이 서로 달라요. 같게 입력해주세요.');
        return;
      }
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('올바른 이메일 주소를 입력해주세요. (예: sungmi@example.com)');
      return;
    }

    setLoading(true);

    try {
      let user: AppUser;
      if (tab === 'signup') {
        user = await registerUser(name, email, password);
      } else {
        user = await loginUser(email, password);
      }
      setLoading(false);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setLoading(false);
      const friendlyMsg = getFriendlyErrorMessage(err?.message || err?.code || 'UNKNOWN');
      setErrorMessage(friendlyMsg);
    }
  };

  const handleSwitchTab = (newTab: 'login' | 'signup') => {
    setTab(newTab);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF7F0] border-2 border-[#D7CEBD] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto">
        
        {/* Top Header */}
        <div className="p-6 border-b border-[#E3DAC8] flex items-center justify-between sticky top-0 bg-[#FAF7F0] z-10">
          <div>
            <h3 className="text-2xl font-black text-[#1A341E]">
              {tab === 'signup' ? '간편 회원가입' : '로그인'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6A5A] mt-0.5">
              {tab === 'signup' 
                ? '이메일과 비밀번호로 10초 만에 가입하세요' 
                : '하루생식 회원 계정으로 로그인하세요'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#EDE7DA] hover:bg-[#DFD7C8] flex items-center justify-center text-[#4B5749] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason banner if triggered by ordering */}
        {triggerReason && (
          <div className="m-6 mb-0 p-3.5 bg-[#E6EFE2] border border-[#BFD9B9] rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-[#1E4E26] font-medium">
            <CheckCircle2 className="w-5 h-5 text-[#2B6035] shrink-0" />
            <span>{triggerReason}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 p-1 bg-[#EBE4D5] rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchTab('signup')}
              className={`py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-white text-[#1E3721] shadow-sm'
                  : 'text-[#5A6858] hover:text-[#203422]'
              }`}
            >
              회원가입
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('login')}
              className={`py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#1E3721] shadow-sm'
                  : 'text-[#5A6858] hover:text-[#203422]'
              }`}
            >
              로그인
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Easy Korean Error Box */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold leading-relaxed">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Name field (for signup) */}
          {tab === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-[#233522] mb-1">
                성함 (이름) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="성함을 직접 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
                />
                <User className="w-5 h-5 text-[#859483] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-bold text-[#233522] mb-1">
              이메일 주소 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="예: user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
              />
              <Mail className="w-5 h-5 text-[#859483] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-[#233522]">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-[#2A5C33] font-semibold">
                6자 이상
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="비밀번호 6자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-base text-[#202E1F] focus:outline-none focus:ring-2 ${
                  password && password.length < 6 
                    ? 'border-amber-400 focus:ring-amber-500' 
                    : 'border-[#D5CABB] focus:ring-[#2C5E3B]'
                }`}
              />
              <Lock className="w-5 h-5 text-[#859483] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {password && password.length < 6 && (
              <p className="text-xs text-amber-700 font-medium mt-1">
                ⚠️ 현재 {password.length}자입니다. 6자 이상이어야 합니다.
              </p>
            )}
          </div>

          {/* Confirm Password field (for signup) */}
          {tab === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-[#233522] mb-1">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 한번 더 입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-base text-[#202E1F] focus:outline-none focus:ring-2 ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-[#D5CABB] focus:ring-[#2C5E3B]'
                  }`}
                />
                <Lock className="w-5 h-5 text-[#859483] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  ❌ 위 비밀번호와 일치하지 않습니다.
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-black text-white bg-[#25522B] hover:bg-[#1E4324] active:scale-[0.98] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>처리 중입니다...</span>
                </>
              ) : (
                <span>{tab === 'signup' ? '회원가입 완료하기' : '로그인하기'}</span>
              )}
            </button>
          </div>

          {/* Tab toggle text link */}
          <div className="text-center text-xs sm:text-sm text-[#5D6B5C] pt-2">
            {tab === 'signup' ? (
              <p>
                이미 아이디가 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="font-bold text-[#24522A] hover:underline cursor-pointer"
                >
                  로그인하기
                </button>
              </p>
            ) : (
              <p>
                아직 회원이 아니신가요?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchTab('signup')}
                  className="font-bold text-[#24522A] hover:underline cursor-pointer"
                >
                  10초 만에 회원가입
                </button>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
