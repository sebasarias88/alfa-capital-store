import { formatPrice } from "./format";
import { PAYMENT_LABEL } from "./labels";
import type { Order } from "./types";

export const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export function orderMessage(order: Order, storeName: string) {
  const lines = order.items.map((it) => `• ${it.qty} × ${it.name} — ${formatPrice(it.price * it.qty)}`);
  return [
    `Hola ${storeName} 👋 Quiero hacer este pedido:`,
    ``,
    `*Pedido ${order.id}*`,
    ...lines,
    order.discount > 0 ? `Descuento combo: -${formatPrice(order.discount)}` : null,
    `*Total: ${formatPrice(order.total)}*`,
    ``,
    `👤 ${order.customer.name}`,
    `📍 ${order.customer.address}, ${order.customer.neighborhood}`,
    `💳 ${PAYMENT_LABEL[order.payment]}`,
    order.notes ? `📝 ${order.notes}` : null,
    ``,
    `🛵 Domicilio gratis en Armenia`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export const productQuestion = (name: string) => `Hola 👋 Me interesa *${name}*. ¿Está disponible?`;
