import type { Category, Edition, Gender, Occasion, OrderChannel, OrderStatus, PaymentMethod, ScentFamily } from "./types";

export const CATEGORY_LABEL: Record<Category, string> = {
  perfumes: "Perfumería",
  watches: "Relojes",
  sunglasses: "Gafas",
};

export const GENDER_LABEL: Record<Gender, string> = {
  women: "Dama",
  men: "Caballero",
  unisex: "Unisex",
};

export const EDITION_LABEL: Record<Edition, string> = {
  original: "Original",
  inspiration: "Inspiración 1.1",
};

export const FAMILY_LABEL: Record<ScentFamily, string> = {
  sweet: "Dulce",
  woody: "Amaderado",
  fresh: "Fresco",
  oriental: "Oriental",
  floral: "Floral",
  citrus: "Cítrico",
};

export const OCCASION_LABEL: Record<Occasion, string> = {
  day: "Día",
  night: "Noche",
  office: "Oficina",
  date: "Cita",
  party: "Fiesta",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Nuevo",
  confirmed: "Confirmado",
  shipping: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "Contra entrega",
  transfer: "Transferencia",
  nequi: "Nequi",
};

export const CHANNEL_LABEL: Record<OrderChannel, string> = {
  web: "Página web",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
};

export const NEIGHBORHOODS = [
  "Centro",
  "Norte",
  "La Castellana",
  "Providencia",
  "Laureles",
  "Granada",
  "El Bosque",
  "La Clarita",
  "Fundadores",
  "Los Kioskos",
  "Nueva Cecilia",
  "La Patria",
];
