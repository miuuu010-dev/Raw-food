import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Loader2, 
  MapPin, 
  Package, 
  Phone, 
  Plus, 
  RefreshCw, 
  Search, 
  Sparkles, 
  Truck, 
  User, 
  X 
} from 'lucide-react';
import { OrderData, subscribeToOrdersList, updateOrderStatus, createRealOrder } from '../services/orderService';

interface SellerOrderDashboardProps {
  onBackToStore: () => void;
}

export const SellerOrderDashboard: React.FC<SellerOrderDashboardProps> = ({ onBackToStore }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrderNotice, setNewOrderNotice] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);
  
  // Track previous orders count to show live notification when new orders arrive
  const previousOrdersCount = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener: updates automatically without page refresh!
    const unsubscribe = subscribeToOrdersList(
      (latestOrders) => {
        if (previousOrdersCount.current !== null && latestOrders.length > previousOrdersCount.current) {
          const newest = latestOrders[0];
          setNewOrderNotice(`🔔 새 주문이 실시간으로 도착했습니다! (${newest.customerName} 님 · ${newest.orderNumber})`);
          setTimeout(() => setNewOrderNotice(null), 5000);
        }
        previousOrdersCount.current = latestOrders.length;
        setOrders(latestOrders);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to subscribe to orders:', error);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = selectedFilter === 'all' || o.status === selectedFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Metrics
  const totalCount = orders.length;
  const pendingOrConfirmedCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const shippingCount = orders.filter((o) => o.status === 'shipping').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalPrice : sum), 0);

  // Status Change Handlers
  const handleSetStatus = async (order: OrderData, newStatus: OrderData['status']) => {
    try {
      let tracking = order.trackingNumber;
      if (newStatus === 'shipping' && !tracking) {
        // Auto-assign random delivery tracking number if none exists
        const randomTracking = '6892' + Math.floor(10000000 + Math.random() * 90000000);
        tracking = randomTracking;
      }
      await updateOrderStatus(order.id, newStatus, tracking);
      
      const statusLabel = newStatus === 'shipping' ? '배송중' : newStatus === 'delivered' ? '배송완료' : '접수완료';
      setActionSuccessNotice(`주문 [${order.orderNumber}] 상태가 "${statusLabel}"(으)로 변경되었습니다.`);
      setTimeout(() => setActionSuccessNotice(null), 3500);
    } catch (err) {
      console.error(err);
      alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // Helper: Export to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('내보낼 주문 내역이 없습니다.');
      return;
    }
    const headers = ['주문번호', '주문일시', '주문자명', '연락처', '배송지', '상세주소', '상품명', '수량', '결제금액', '결제수단', '주문상태', '송장번호', '배송요청'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      o.customerName,
      o.phone,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${(o.addressDetail || '').replace(/"/g, '""')}"`,
      `"${o.itemTitle.replace(/"/g, '""')}"`,
      o.quantity,
      o.totalPrice,
      o.paymentMethod,
      o.status,
      o.trackingNumber || '',
      `"${(o.memo || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `하루생식_주문목록_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Create test order
  const handleCreateTestOrder = async () => {
    try {
      const randomNames = ['윤성미', '김지현', '박준형', '이서연', '최도윤'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      await createRealOrder({
        customerName: randomName,
        phone: '010-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
        address: '서울시 서초구 반포대로 ' + Math.floor(10 + Math.random() * 200),
        addressDetail: '10' + Math.floor(1 + Math.random() * 9) + '호',
        itemTitle: '하루생식 50곡 순수 한끼 (30포 / 1개월분)',
        quantity: 1,
        totalPrice: 39000,
        paymentMethod: 'kakaopay',
        status: 'confirmed',
        memo: '문 앞에 놓아주세요',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">주문접수</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold">결제완료</span>;
      case 'shipping':
        return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-full text-xs font-bold">배송중</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">배송완료</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold">주문취소</span>;
    }
  };

  const getPaymentMethodBadge = (method: OrderData['paymentMethod']) => {
    switch (method) {
      case 'card': return <span className="text-xs text-[#2A4B29] font-medium bg-[#E8EFE5] px-2 py-0.5 rounded">신용카드</span>;
      case 'kakaopay': return <span className="text-xs text-[#3C1E1E] font-bold bg-[#FEE500] px-2 py-0.5 rounded">카카오페이</span>;
      case 'naverpay': return <span className="text-xs text-white font-bold bg-[#03C75A] px-2 py-0.5 rounded">네이버페이</span>;
      case 'tosspay': return <span className="text-xs text-white font-bold bg-[#0064FF] px-2 py-0.5 rounded">토스페이</span>;
      case 'bank': return <span className="text-xs text-[#6A4B1A] font-medium bg-[#FAF3E8] px-2 py-0.5 rounded">무통장입금</span>;
      default: return <span className="text-xs text-[#445543] font-medium bg-[#EDE7DA] px-2 py-0.5 rounded">간편결제</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#2C342C]">
      
      {/* Top Banner & Header */}
      <div className="bg-[#FAF8F3] border-b border-[#DFD6C6] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-[#2A522F] bg-[#E7EFE4] hover:bg-[#D9E6D5] rounded-xl transition-all cursor-pointer border border-[#C5D8C1]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>쇼핑몰 화면으로 돌아가기</span>
            </button>

            <div className="h-6 w-px bg-[#DFD6C6] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#26532F] text-white flex items-center justify-center font-bold text-sm">
                管
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A341E]">
                판매자 주문관리 시스템
              </h1>
            </div>
          </div>

          {/* Real-time Indicator Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#E6EFE2] border border-[#BFD9B9] rounded-full text-xs font-bold text-[#1E4E26]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>실시간 자동 동기화 켜짐 (새로고침 불필요)</span>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#355E38] bg-[#EBE4D5] hover:bg-[#DDD3C2] rounded-xl border border-[#D5CABB] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">엑셀(CSV) 저장</span>
            </button>

            <button
              type="button"
              onClick={handleCreateTestOrder}
              className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-bold text-white bg-[#25522B] hover:bg-[#1E4324] rounded-xl transition-colors cursor-pointer"
              title="연습용 새 주문 1건 즉시 추가하기"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">연습 주문 생성</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating Real-time Alerts */}
      {newOrderNotice && (
        <div className="fixed top-24 right-6 z-50 bg-[#25522B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#1E4324] animate-bounce">
          <Sparkles className="w-5 h-5 text-[#8CE397]" />
          <span className="text-sm font-bold">{newOrderNotice}</span>
        </div>
      )}

      {actionSuccessNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1A4521] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#113017]">
          <CheckCircle2 className="w-5 h-5 text-[#76DB84]" />
          <span className="text-sm font-bold">{actionSuccessNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#FAF8F3] border-2 border-[#DCD3C3] p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-[#6D7B6C] block">전체 주문</span>
            <span className="text-2xl sm:text-3xl font-black text-[#1C361F] tabular-nums mt-1 block">
              {totalCount}건
            </span>
          </div>

          <div className="bg-[#EFF5FD] border-2 border-[#BDD5F5] p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-[#1E5296] block">결제완료 (배송준비)</span>
            <span className="text-2xl sm:text-3xl font-black text-[#184886] tabular-nums mt-1 block">
              {pendingOrConfirmedCount}건
            </span>
          </div>

          <div className="bg-[#F5EEFB] border-2 border-[#DAC1F5] p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-[#68249B] block">배송중</span>
            <span className="text-2xl sm:text-3xl font-black text-[#5B1F89] tabular-nums mt-1 block">
              {shippingCount}건
            </span>
          </div>

          <div className="bg-[#EDF8F1] border-2 border-[#B9E5C6] p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-[#1D6C3A] block">배송완료</span>
            <span className="text-2xl sm:text-3xl font-black text-[#175C31] tabular-nums mt-1 block">
              {deliveredCount}건
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-[#FAF8F3] border-2 border-[#DCD3C3] p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-[#6D7B6C] block">총 결제 금액</span>
            <span className="text-xl sm:text-2xl font-black text-[#26532F] tabular-nums mt-1 block">
              {totalRevenue.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#FAF8F3] border-2 border-[#DDD4C3] rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '전체보기' },
              { id: 'confirmed', label: '결제완료' },
              { id: 'shipping', label: '배송중' },
              { id: 'delivered', label: '배송완료' },
              { id: 'pending', label: '입금대기' },
              { id: 'cancelled', label: '주문취소' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#25522B] text-white shadow-sm'
                    : 'bg-[#EDE7DA] text-[#475445] hover:bg-[#E2DACB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="주문번호, 주문자명, 연락처, 주소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D5CABB] rounded-xl text-sm text-[#202E1F] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
            />
            <Search className="w-4 h-4 text-[#7B8B79] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* MANDATORY: ORDERS TABLE (주문번호, 주문자, 상품, 금액, 상태 표로 표시) */}
        <div className="bg-white border-2 border-[#DDD4C3] rounded-3xl overflow-hidden shadow-sm">
          
          <div className="p-4 sm:p-5 border-b border-[#EAE3D5] flex items-center justify-between bg-[#FCFAF6]">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#25522B]" />
              <h2 className="text-lg sm:text-xl font-black text-[#1C361F]">
                주문 목록 내역 ({filteredOrders.length}건)
              </h2>
            </div>
            <span className="text-xs text-[#6F7D6D]">
              * 새 주문이 접수되면 새로고침 없이 즉시 표에 추가됩니다.
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-[#556353]">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#26532F]" />
              <p className="text-base font-bold">주문 데이터를 실시간으로 동기화하고 있습니다...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center text-[#6B7968]">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-bold">해당하는 주문 내역이 없습니다.</p>
              <p className="text-xs text-[#7B8879] mt-1">
                쇼핑몰에서 고객이 [주문하기]를 누르면 이 표에 실시간으로 나타납니다.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F5EE] border-b border-[#E8E0D2] text-[#4F5D4D] text-xs sm:text-sm font-bold">
                    <th className="py-4 px-4 sm:px-6">주문번호 / 일시</th>
                    <th className="py-4 px-4 sm:px-6">주문자 정보</th>
                    <th className="py-4 px-4 sm:px-6">주문 상품</th>
                    <th className="py-4 px-4 sm:px-6">결제 금액</th>
                    <th className="py-4 px-4 sm:px-6 text-center">상태</th>
                    <th className="py-4 px-4 sm:px-6 text-center">상태 변경 액션</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EFE9DD] text-sm">
                  {filteredOrders.map((ord) => (
                    <tr 
                      key={ord.id}
                      className="hover:bg-[#FAF8F2] transition-colors"
                    >
                      {/* Column 1: 주문번호 / 일시 */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="font-mono font-bold text-sm text-[#1B351E]">
                          {ord.orderNumber}
                        </div>
                        <div className="text-xs text-[#7A8778] mt-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(ord.createdAt).toLocaleString('ko-KR')}</span>
                        </div>
                        {ord.trackingNumber && (
                          <div className="mt-1.5 text-xs text-[#2A5C33] font-bold bg-[#E6EFE2] px-2 py-0.5 rounded inline-block">
                            우체국 {ord.trackingNumber}
                          </div>
                        )}
                      </td>

                      {/* Column 2: 주문자 정보 */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-base font-black text-[#1E331E]">
                            {ord.customerName}
                          </strong>
                        </div>
                        <div className="text-xs text-[#4F5F4E] font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#889886]" />
                          <span>{ord.phone}</span>
                        </div>
                        <div className="text-xs text-[#5E6D5D] mt-1 max-w-xs leading-snug">
                          {ord.address} {ord.addressDetail || ''}
                        </div>
                        {ord.memo && (
                          <div className="text-[11px] text-[#865B20] mt-1 bg-[#FBF6EE] px-2 py-0.5 rounded border border-[#EDE2D0]">
                            요청: {ord.memo}
                          </div>
                        )}
                      </td>

                      {/* Column 3: 주문 상품 */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="font-semibold text-[#1F3620] leading-snug">
                          {ord.itemTitle}
                        </div>
                        <div className="text-xs text-[#6F7E6E] mt-1">
                          수량: <strong className="text-[#1F3620]">{ord.quantity}개</strong> · 전용 보틀 증정
                        </div>
                      </td>

                      {/* Column 4: 결제 금액 및 결제수단 */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="text-base font-black text-[#1A3A1F] tabular-nums">
                          {ord.totalPrice.toLocaleString()}원
                        </div>
                        <div className="mt-1">
                          {getPaymentMethodBadge(ord.paymentMethod)}
                        </div>
                      </td>

                      {/* Column 5: 상태 배지 */}
                      <td className="py-4 px-4 sm:px-6 align-top text-center">
                        {getStatusBadge(ord.status)}
                      </td>

                      {/* Column 6: MANDATORY ACTION BUTTONS ("배송중", "배송완료"로 바꾸는 버튼) */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                          
                          {/* "배송중" 으로 바꾸는 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(ord, 'shipping')}
                            disabled={ord.status === 'shipping'}
                            className={`w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                              ord.status === 'shipping'
                                ? 'bg-purple-100 text-purple-400 cursor-not-allowed border border-purple-200'
                                : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs active:scale-95'
                            }`}
                            title="주문 상태를 [배송중]으로 변경합니다"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>배송중</span>
                          </button>

                          {/* "배송완료" 로 바꾸는 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(ord, 'delivered')}
                            disabled={ord.status === 'delivered'}
                            className={`w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed border border-emerald-200'
                                : 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs active:scale-95'
                            }`}
                            title="주문 상태를 [배송완료]로 변경합니다"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>배송완료</span>
                          </button>

                          {/* Extra: 접수완료로 복원 (필요 시) */}
                          {ord.status !== 'confirmed' && ord.status !== 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleSetStatus(ord, 'confirmed')}
                              className="px-2 py-1 text-[11px] font-bold text-[#6D7D6C] hover:bg-[#EFE9DD] rounded-lg transition-colors cursor-pointer"
                              title="접수완료 상태로 되돌리기"
                            >
                              접수복원
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
