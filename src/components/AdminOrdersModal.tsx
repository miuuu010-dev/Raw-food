import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Package, 
  RefreshCw, 
  Search, 
  Send, 
  Truck, 
  X,
  AlertCircle
} from 'lucide-react';
import { OrderData, subscribeToOrdersList, updateOrderStatus } from '../services/orderService';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const unsubscribe = subscribeToOrdersList(
      (newOrders) => {
        setOrders(newOrders);
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
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = selectedFilter === 'all' || o.status === selectedFilter;
    const matchesQuery = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalPrice : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleStatusChange = async (orderId: string, newStatus: OrderData['status']) => {
    try {
      const tracking = trackingInputs[orderId];
      await updateOrderStatus(orderId, newStatus, tracking);
      setActionSuccessMsg('주문 상태가 성공적으로 변경되었습니다.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleSaveTracking = async (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking || !tracking.trim()) {
      alert('송장번호를 입력해주세요.');
      return;
    }
    try {
      await updateOrderStatus(orderId, 'shipping', tracking.trim());
      setActionSuccessMsg('송장번호가 등록되고 [배송중] 상태로 전환되었습니다.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
      alert('송장 등록에 실패했습니다.');
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert('내보낼 주문 데이터가 없습니다.');
      return;
    }
    const headers = ['주문번호', '주문일시', '고객명', '연락처', '주소', '상세주소', '상품명', '수량', '결제금액', '결제방법', '상태', '송장번호', '배송메모'];
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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `haru_saengsik_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold">주문접수/입금대기</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-bold">결제완료/배송준비</span>;
      case 'shipping':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-bold">배송중</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">배송완료</span>;
      case 'cancelled':
        return <span className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold">취소됨</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF7F0] border-2 border-[#D7CEBD] rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
        
        {/* Top Header */}
        <div className="p-6 border-b border-[#E3DAC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-[#FAF7F0] z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A341E]">
                사장님 실시간 주문 관리함
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6A5A] mt-1">
              외부 손님이 주문한 내역이 실시간으로 동기화되어 표시됩니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E6EFE3] hover:bg-[#D7E6D3] text-[#24522A] text-sm font-bold rounded-xl border border-[#C5DABA] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>엑셀(CSV) 저장</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#EDE7DA] hover:bg-[#DFD7C8] flex items-center justify-center text-[#4B5749] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccessMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 pb-2">
          <div className="bg-[#F2ECE0] border border-[#DDD3C2] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#6D7B6C] block">총 주문 건수</span>
            <span className="text-2xl font-black text-[#1C361F] tabular-nums">{orders.length}건</span>
          </div>
          <div className="bg-[#F2ECE0] border border-[#DDD3C2] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#6D7B6C] block">신규 미처리 (접수/대기)</span>
            <span className="text-2xl font-black text-[#B0541E] tabular-nums">{pendingOrdersCount}건</span>
          </div>
          <div className="bg-[#F2ECE0] border border-[#DDD3C2] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#6D7B6C] block">총 누적 매출액</span>
            <span className="text-2xl font-black text-[#26532F] tabular-nums">{totalRevenue.toLocaleString()}원</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '전체' },
              { id: 'pending', label: '접수/대기' },
              { id: 'confirmed', label: '배송준비' },
              { id: 'shipping', label: '배송중' },
              { id: 'delivered', label: '배송완료' },
              { id: 'cancelled', label: '취소' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#25522B] text-white shadow-sm'
                    : 'bg-[#EDE7DA] text-[#475445] hover:bg-[#E2DACB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="고객명, 전화번호, 주문번호 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D5CABB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
            />
            <Search className="w-4 h-4 text-[#7B8B79] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="px-6 pb-6 flex-1 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-[#556353]">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#26532F]" />
              <p>주문 목록을 불러오는 중입니다...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-[#6B7968] bg-[#F5F1E8] rounded-2xl border border-[#DFD6C6]">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-base font-bold">접수된 주문이 없습니다.</p>
              <p className="text-xs mt-1">외부 손님이 메인 페이지에서 [주문하기]를 누르면 여기에 실시간으로 표시됩니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-[#DFD6C6] rounded-2xl p-5 shadow-sm space-y-3"
                >
                  {/* Row 1: Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#1E3721]">
                        {ord.orderNumber}
                      </span>
                      {getStatusBadge(ord.status)}
                      <span className="text-xs text-[#828F80]">
                        {new Date(ord.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#1E3E22] tabular-nums">
                        {ord.totalPrice.toLocaleString()}원
                      </span>
                      <span className="text-xs text-[#6F7D6D] ml-2">
                        ({ord.paymentMethod === 'card' ? '카드결제' : ord.paymentMethod === 'kakaopay' ? '카카오페이' : ord.paymentMethod === 'naverpay' ? '네이버페이' : ord.paymentMethod === 'tosspay' ? '토스페이' : ord.paymentMethod === 'bank' ? '무통장입금' : '간편결제'})
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Customer & Shipping Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-[#7B8879] block">주문자 정보</span>
                      <strong className="text-[#1A311D]">{ord.customerName}</strong>
                      <span className="text-xs text-[#4F5D4D] block font-mono">{ord.phone}</span>
                    </div>

                    <div>
                      <span className="text-xs text-[#7B8879] block">배송지 주소</span>
                      <p className="text-[#2B382A] text-xs sm:text-sm leading-snug">
                        {ord.address} {ord.addressDetail || ''}
                      </p>
                      {ord.memo && (
                        <p className="text-[11px] text-[#86602F] mt-0.5">요청: {ord.memo}</p>
                      )}
                    </div>

                    <div>
                      <span className="text-xs text-[#7B8879] block">주문 품목</span>
                      <span className="text-xs sm:text-sm text-[#273B25] font-semibold block">
                        {ord.itemTitle} ({ord.quantity}개)
                      </span>
                      {ord.trackingNumber && (
                        <span className="text-xs text-[#2A5C33] font-bold block mt-0.5">
                          송장번호: {ord.trackingNumber} (우체국)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Admin Status Actions & Tracking Input */}
                  <div className="pt-3 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF8F3] -mx-5 -mb-5 p-4 rounded-b-2xl">
                    {/* Status Changer Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-[#5F6D5D] mr-1">상태 변경:</span>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ord.id, 'confirmed')}
                        className="px-2.5 py-1 text-xs font-bold bg-[#E6F0FA] text-[#1E4E8A] hover:bg-[#D5E5F7] rounded-lg transition-colors cursor-pointer"
                      >
                        입금/결제확인
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ord.id, 'delivered')}
                        className="px-2.5 py-1 text-xs font-bold bg-[#E6F5EC] text-[#1A6B3D] hover:bg-[#D5EDE0] rounded-lg transition-colors cursor-pointer"
                      >
                        배송완료
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ord.id, 'cancelled')}
                        className="px-2.5 py-1 text-xs font-bold bg-[#F4F4F4] text-[#6A6A6A] hover:bg-[#EAEAEA] rounded-lg transition-colors cursor-pointer"
                      >
                        주문취소
                      </button>
                    </div>

                    {/* Tracking Number Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="우체국 송장번호 입력"
                        defaultValue={ord.trackingNumber || ''}
                        onChange={(e) => {
                          setTrackingInputs((prev) => ({ ...prev, [ord.id]: e.target.value }));
                        }}
                        className="px-3 py-1.5 text-xs bg-white border border-[#D5CABB] rounded-lg w-40 focus:outline-none focus:ring-1 focus:ring-[#2C5E3B]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveTracking(ord.id)}
                        className="px-3 py-1.5 text-xs font-bold bg-[#26532F] hover:bg-[#1E4326] text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                      >
                        송장 등록(발송)
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
