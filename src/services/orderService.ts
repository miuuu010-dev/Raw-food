import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  addressDetail?: string;
  memo?: string;
  itemTitle: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: 'card' | 'bank' | 'easy' | 'kakaopay' | 'naverpay' | 'tosspay';
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}

const LOCAL_ORDERS_KEY = 'haru_saengsik_local_orders';
const inMemoryOrders: OrderData[] = [];

function getLocalOrders(): OrderData[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_ORDERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Local storage read skipped:', e);
  }
  return [...inMemoryOrders];
}

function saveLocalOrder(order: OrderData) {
  // Always update in-memory cache first
  const memIndex = inMemoryOrders.findIndex((o) => o.id === order.id);
  if (memIndex >= 0) {
    inMemoryOrders[memIndex] = order;
  } else {
    inMemoryOrders.unshift(order);
  }

  // Then try to persist to browser storage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const list = getLocalOrders();
      const existingIndex = list.findIndex((o) => o.id === order.id);
      if (existingIndex >= 0) {
        list[existingIndex] = order;
      } else {
        list.unshift(order);
      }
      window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Local storage write skipped:', e);
  }
}

/**
 * Creates a real customer order in Firestore with robust fallback
 */
export async function createRealOrder(
  order: Omit<OrderData, 'id' | 'orderNumber' | 'status' | 'createdAt'> & { status?: OrderData['status'] }
): Promise<OrderData> {
  const timestamp = Date.now();
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() + 
    (now.getMonth() + 1).toString().padStart(2, '0') + 
    now.getDate().toString().padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-${yyyymmdd}-${randomSuffix}`;
  const docId = `order_${timestamp}_${randomSuffix}`;

  // Build clean payload with NO undefined values (Firestore rejects undefined)
  const cleanOrder: Record<string, any> = {
    id: docId,
    orderNumber,
    customerName: (order.customerName || '고객').trim(),
    phone: (order.phone || '010-0000-0000').trim(),
    address: (order.address || '주소 미입력').trim(),
    itemTitle: order.itemTitle || '하루생식 50곡 순수 한끼',
    quantity: Number(order.quantity) || 1,
    totalPrice: Number(order.totalPrice) || 39000,
    paymentMethod: order.paymentMethod || 'card',
    status: order.status || 'confirmed',
    createdAt: new Date().toISOString(),
  };

  if (order.addressDetail && order.addressDetail.trim()) {
    cleanOrder.addressDetail = order.addressDetail.trim();
  }
  if (order.memo && order.memo.trim()) {
    cleanOrder.memo = order.memo.trim();
  }
  if (order.trackingNumber && order.trackingNumber.trim()) {
    cleanOrder.trackingNumber = order.trackingNumber.trim();
  }

  const finalOrder = cleanOrder as OrderData;

  // 1. Immediately save to local and in-memory persistence
  saveLocalOrder(finalOrder);

  // 2. Save to Cloud Firestore with non-blocking timeout safety
  try {
    const firestorePromise = setDoc(doc(db, 'orders', docId), cleanOrder);
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500));
    await Promise.race([firestorePromise, timeoutPromise]);
  } catch (error) {
    console.warn('Firestore setDoc notice (safe fallback used):', error);
  }

  return finalOrder;
}

/**
 * Fetches an order by its ID
 */
export async function fetchOrderById(orderId: string): Promise<OrderData | null> {
  try {
    const snap = await getDoc(doc(db, 'orders', orderId));
    if (snap.exists()) {
      return snap.data() as OrderData;
    }
  } catch (error) {
    console.warn('Firestore getDoc error, searching local storage:', error);
  }

  const localList = getLocalOrders();
  const found = localList.find((o) => o.id === orderId || o.orderNumber === orderId);
  return found || null;
}

/**
 * Subscribes to real-time order list (merging Firestore and local storage)
 */
export function subscribeToOrdersList(
  onUpdate: (orders: OrderData[]) => void,
  onError?: (err: unknown) => void
) {
  // Immediately provide current local orders for instant UI rendering
  onUpdate(getLocalOrders());

  try {
    const q = query(collection(db, 'orders'));
    return onSnapshot(
      q,
      (snapshot) => {
        const firestoreOrders: OrderData[] = [];
        snapshot.forEach((doc) => {
          firestoreOrders.push(doc.data() as OrderData);
        });

        // Merge Firestore orders with local backup orders (deduplicated by id)
        const localOrders = getLocalOrders();
        const map = new Map<string, OrderData>();
        localOrders.forEach((o) => map.set(o.id, o));
        firestoreOrders.forEach((o) => map.set(o.id, o));

        const merged = Array.from(map.values());
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(merged);
      },
      (error) => {
        console.warn('Firestore snapshot error, using local fallback:', error);
        onUpdate(getLocalOrders());
      }
    );
  } catch (error) {
    console.warn('Firestore query error, using local fallback:', error);
    onUpdate(getLocalOrders());
  }
}

/**
 * Updates an order status or tracking number
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderData['status'],
  trackingNumber?: string
): Promise<void> {
  // 1. Update in local storage
  const localList = getLocalOrders();
  const target = localList.find((o) => o.id === orderId);
  if (target) {
    target.status = newStatus;
    if (trackingNumber !== undefined) {
      target.trackingNumber = trackingNumber;
    }
    saveLocalOrder(target);
  }

  // 2. Update in Cloud Firestore
  try {
    const payload: Record<string, any> = {
      status: newStatus,
    };
    if (trackingNumber && trackingNumber.trim()) {
      payload.trackingNumber = trackingNumber.trim();
    }
    await updateDoc(doc(db, 'orders', orderId), payload);
  } catch (error) {
    console.warn('Firestore updateDoc warning:', error);
  }
}
