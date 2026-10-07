import React, { useState } from 'react';
import { CheckCircle2, Clock, Package, Search, Truck, X } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { OrderData } from '../services/orderService';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<OrderData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryTerm = searchInput.trim();
    if (!queryTerm) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Search by phone or orderNumber
      const ordersRef = collection(db, 'orders');
      
      // Attempt 1: Query by orderNumber
      const qOrder = query(ordersRef, where('orderNumber', '==', queryTerm));
      const snapOrder = await getDocs(qOrder);

      const foundOrders: OrderData[] = [];
      snapOrder.forEach((doc) => foundOrders.push(doc.data() as OrderData));

      // Attempt 2: If no matches by orderNumber, search by phone
      if (foundOrders.length === 0) {
        const cleanPhone = queryTerm.replace(/[^0-9]/g, '');
        // Search by exact phone
        const qPhone = query(ordersRef, where('phone', '==', queryTerm));
        const snapPhone = await getDocs(qPhone);
        snapPhone.forEach((doc) => foundOrders.push(doc.data() as OrderData));
      }

      setResults(foundOrders);
    } catch (error) {
      console.error('Lookup failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: OrderData['status']) => {
    switch (status) {
      case 'pending': return '주문접수 (입금/결제 확인 중)';
      case 'confirmed': return '결제확인 (상품 포장 및 배송 준비 중)';
      case 'shipping': return '배송중 (택배사 전달 완료)';
      case 'delivered': return '배송완료';
      case 'cancelled': return '주문취소';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF7F0] border-2 border-[#D7CEBD] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E3DAC8] flex items-center justify-between sticky top-0 bg-[#FAF7F0] z-10">
          <div>
            <h3 className="text-2xl font-black text-[#1A341E]">
              내 주문 및 배송 조회
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6A5A] mt-0.5">
              주문 시 입력하신 휴대폰 번호 또는 주문번호를 입력하세요.
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

        {/* Search form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="휴대폰 번호(예: 010-1234-5678) 또는 주문번호"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-[#D5CABB] rounded-xl text-base text-[#202E1F] focus:outline-none focus:ring-2 focus:ring-[#2C5E3B]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#24522B] hover:bg-[#1B3F21] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>조회</span>
            </button>
          </form>

          {/* Results list */}
          <div className="mt-6">
            {loading ? (
              <div className="py-12 text-center text-[#5D6B5C]">
                주문 내역을 검색하고 있습니다...
              </div>
            ) : hasSearched && results && results.length === 0 ? (
              <div className="py-12 text-center text-[#6A7867] bg-[#F4EFE6] rounded-2xl border border-[#DED4C3]">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-base">일치하는 주문 내역이 없습니다.</p>
                <p className="text-xs mt-1">입력하신 휴대폰 번호 또는 주문번호를 다시 한번 확인해주세요.</p>
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-4">
                {results.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border-2 border-[#D7CEBE] rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
                      <div>
                        <span className="text-xs text-[#808D7F] block">주문번호</span>
                        <strong className="text-sm font-mono text-[#1D3620]">{ord.orderNumber}</strong>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-[#E6EFE2] text-[#225529] px-3 py-1 rounded-full text-xs font-bold">
                          {getStatusText(ord.status)}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm space-y-1.5 text-[#465343]">
                      <div className="flex justify-between">
                        <span className="text-[#7A8778]">상품명:</span>
                        <span className="font-bold text-[#1F3922]">{ord.itemTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7A8778]">받으시는 분:</span>
                        <span>{ord.customerName} ({ord.phone})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7A8778]">배송지:</span>
                        <span className="text-right max-w-[260px] truncate">{ord.address} {ord.addressDetail || ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7A8778]">결제 금액:</span>
                        <span className="font-black text-[#1E3B21]">{ord.totalPrice.toLocaleString()}원</span>
                      </div>
                      {ord.trackingNumber && (
                        <div className="mt-2 p-3 bg-[#EAF3E7] rounded-xl flex items-center justify-between text-xs text-[#204F27]">
                          <span className="font-bold">우체국 택배 송장번호:</span>
                          <span className="font-mono font-black text-sm">{ord.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
};
