export type Category = "perfumes" | "watches" | "sunglasses";
export type Gender = "women" | "men" | "unisex";
export type Edition = "original" | "inspiration";
export type ScentFamily = "sweet" | "woody" | "fresh" | "oriental" | "floral" | "citrus";
export type Occasion = "day" | "night" | "office" | "date" | "party";

export type BottleShape = "flacon" | "round" | "tall" | "oud" | "heart" | "hex";
export type WatchShape = "classic" | "chrono" | "square" | "petite";
export type GlassesShape = "aviator" | "cateye" | "square" | "round" | "shield";

export type ProductArt =
  | { kind: "bottle"; shape: BottleShape; liquid: string; cap: string; accent: string }
  | { kind: "watch"; shape: WatchShape; dial: string; strap: string; accent: string }
  | { kind: "glasses"; shape: GlassesShape; frame: string; lens: string; accent: string };

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  house: string;
  category: Category;
  gender: Gender;
  edition: Edition;
  price: number;
  compareAt?: number;
  stock: number;
  description: string;
  art: ProductArt;
  /** Uploaded image (data URL) that replaces the illustration */
  image?: string;
  featured: boolean;
  isNew: boolean;
  active: boolean;
  sizeMl?: number;
  family?: ScentFamily;
  notes?: ScentNotes;
  /** 1–5 */
  longevity?: number;
  /** 1–5 */
  sillage?: number;
  occasions?: Occasion[];
  specs?: { label: string; value: string }[];
}

export type OrderStatus = "new" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cash" | "transfer" | "nequi";
export type OrderChannel = "web" | "whatsapp" | "instagram";

export interface OrderItem {
  productId: string;
  name: string;
  category: Category;
  edition: Edition;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; neighborhood: string; address: string };
  items: OrderItem[];
  discount: number;
  total: number;
  status: OrderStatus;
  payment: PaymentMethod;
  channel: OrderChannel;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsapp: string;
  instagram: string;
  city: string;
  announcement: string;
  comboDiscount: number;
  lowStockThreshold: number;
}
