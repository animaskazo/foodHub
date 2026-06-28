export interface Variant {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  variants: Variant[];
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  activeShiftId: string | null;
}

export type UserRole = "admin" | "cajero" | "customer" | "landing";

export interface WaitlistItem {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  restaurantType: string;
  monthlyOrders: string;
  status: "pending" | "contacted" | "rejected";
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  sucursalId: string;
}

export interface OrderItem {
  id: string; // Unique item instance ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: Variant;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";
export type OrderType = "pos" | "online";
export type PaymentMethod = "cash" | "card" | "transfer";

export interface Order {
  id: string;
  sucursalId: string;
  sucursalName: string;
  tableNo?: string; // e.g. "Mesa 3", "Online - Envío", "Para Llevar"
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  type: OrderType;
  paymentMethod?: PaymentMethod;
  paymentStatus: "pending" | "paid";
  customerName: string;
  customerPhone?: string;
  cashierName?: string;
  timestamp: string;
}

export interface Shift {
  id: string;
  sucursalId: string;
  sucursalName: string;
  cashierName: string;
  openedAt: string;
  closedAt: string | null;
  startingCash: number;
  expectedCash: number;
  actualCash: number | null;
  notes: string;
  status: "open" | "closed";
}

export interface CashMovement {
  id: string;
  shiftId: string;
  type: "in" | "out";
  amount: number;
  reason: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}
