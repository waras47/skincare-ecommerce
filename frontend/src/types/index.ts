export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  skinType: string | null;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipient: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantName: string;
  sku: string;
  price: string;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: { name: string };
}

export interface RecentReview extends Review {
  product: { name: string; slug: string };
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  skinTypes: string[];
  basePrice: string;
  createdAt: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  qty: number;
  variant: ProductVariant & { product: Product };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled" | "failed";
export type PaymentStatus = "pending" | "success" | "failed";

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  qty: number;
  price: string;
  variant: ProductVariant & { product: Product };
  review?: Review | null;
}

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  status: PaymentStatus;
  paidAt: string | null;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
  payment: Payment | null;
  address: Address;
  user?: { name: string; email: string };
}

export interface SkinQuizOption {
  id: string;
  questionId: string;
  text: string;
  skinTypeValue: string;
}

export interface SkinQuizQuestion {
  id: string;
  orderNo: number;
  text: string;
  options: SkinQuizOption[];
}

export interface QuizResult {
  skinType: string;
  recommendations: Product[];
}

export interface DashboardMetric {
  total: number;
  last7: number;
  prev7: number;
}

export interface DashboardStats {
  products: DashboardMetric;
  orders: DashboardMetric;
  customers: DashboardMetric;
  revenue: DashboardMetric;
}
