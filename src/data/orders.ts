import { NEIGHBORHOODS } from "@/lib/labels";
import type { Order, OrderChannel, OrderStatus, PaymentMethod, Product } from "@/lib/types";

const FIRST_NAMES = [
  "Valentina", "Santiago", "Mariana", "Juan Pablo", "Laura", "Andrés", "Daniela", "Camilo",
  "Sofía", "Sebastián", "Isabella", "Mateo", "Natalia", "Felipe", "Juliana", "Esteban",
  "Paula", "Alejandro", "Manuela", "David", "Carolina", "Julián", "Tatiana", "Kevin",
];
const LAST_NAMES = [
  "Gómez", "Restrepo", "Ramírez", "Osorio", "Giraldo", "Valencia", "Cardona", "López",
  "Marín", "Zapata", "Henao", "Arango", "Ospina", "Castaño", "Muñoz", "Salazar",
];

/** Deterministic PRNG so every demo starts with the same data */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rand: () => number, list: readonly T[]) => list[Math.floor(rand() * list.length)];

interface Customer {
  name: string;
  phone: string;
  neighborhood: string;
  address: string;
}

export function generateSeedOrders(products: Product[], now = new Date(), days = 90): Order[] {
  const rand = mulberry32(20261023);

  const customers: Customer[] = Array.from({ length: 46 }, () => ({
    name: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
    phone: `+57 3${10 + Math.floor(rand() * 15)} ${Math.floor(rand() * 900) + 100} ${Math.floor(rand() * 9000) + 1000}`,
    neighborhood: pick(rand, NEIGHBORHOODS),
    address: `Calle ${Math.floor(rand() * 50) + 1} # ${Math.floor(rand() * 30) + 1}-${Math.floor(rand() * 90) + 10}`,
  }));

  // Weight perfumes heavier — they are the core of the business
  const weighted = products.flatMap((p) =>
    Array.from({ length: p.category === "perfumes" ? (p.edition === "inspiration" ? 5 : 2) : p.category === "watches" ? 2 : 3 }, () => p),
  );

  const orders: Order[] = [];
  let seq = 1000;

  for (let d = days; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const weekday = date.getDay();
    // Growth trend + weekend peaks
    const base = 0.6 + ((days - d) / days) * 1.6;
    const weekendBoost = weekday === 5 || weekday === 6 ? 1.3 : 0;
    const count = Math.max(0, Math.round(base + weekendBoost + (rand() - 0.5) * 2));

    for (let k = 0; k < count; k++) {
      const customer = rand() < 0.35 ? customers[Math.floor(rand() * 10)] : pick(rand, customers);
      const lines = rand() < 0.7 ? 1 : rand() < 0.8 ? 2 : 3;
      const items = new Map<string, Order["items"][number]>();
      for (let l = 0; l < lines; l++) {
        const p = pick(rand, weighted);
        const existing = items.get(p.id);
        if (existing) existing.qty += 1;
        else
          items.set(p.id, {
            productId: p.id,
            name: p.name,
            category: p.category,
            edition: p.edition,
            price: p.price,
            qty: 1,
          });
      }
      const list = [...items.values()];
      const subtotal = list.reduce((s, it) => s + it.price * it.qty, 0);

      const created = new Date(date);
      created.setHours(9 + Math.floor(rand() * 13), Math.floor(rand() * 60), 0, 0);
      if (created > now) created.setTime(now.getTime() - Math.floor(rand() * 3) * 3600_000);

      let status: OrderStatus = "delivered";
      if (d === 0) status = pick(rand, ["new", "new", "confirmed", "shipping"] as const);
      else if (d <= 2) status = pick(rand, ["confirmed", "shipping", "delivered", "delivered"] as const);
      else if (rand() < 0.06) status = "cancelled";

      orders.push({
        id: `AC-${++seq}`,
        createdAt: created.toISOString(),
        customer: {
          name: customer.name,
          phone: customer.phone,
          neighborhood: customer.neighborhood,
          address: customer.address,
        },
        items: list,
        discount: 0,
        total: subtotal,
        status,
        payment: pick(rand, ["cash", "cash", "transfer", "nequi", "nequi"] as PaymentMethod[]),
        channel: pick(rand, ["whatsapp", "whatsapp", "instagram", "web"] as OrderChannel[]),
      });
    }
  }

  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
