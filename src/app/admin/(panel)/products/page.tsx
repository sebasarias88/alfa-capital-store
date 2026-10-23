import { Suspense } from "react";
import { ProductsView } from "@/components/admin/products-view";

export const metadata = { title: "Productos" };

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsView />
    </Suspense>
  );
}
