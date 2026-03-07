import { ProductList } from "../../features/products";

export default async function ProductsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <ProductList />
    </main>
  );
}
