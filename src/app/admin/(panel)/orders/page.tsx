import { Suspense } from "react";
import { OrdersView } from "@/components/admin/orders-view";

export const metadata = { title: "Pedidos" };

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersView />
    </Suspense>
  );
}
