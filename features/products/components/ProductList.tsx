"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AlertError } from "@/components/AlertError";
import { useCartStore } from "@/features/cart/store";
import { toast } from "sonner";
import { Product } from "@/prisma/generated/prisma/client";
import { LimitResult } from "@/features/orders/types";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [outProducts, setOutProducts] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.increase);
  const handleAdd = (addedProduct: Product) => {
    addItem(addedProduct.id);
    toast.success(`${addedProduct.name} has been add to cart!`, {
      icon: (
        <div
          className="w-4 h-4 shadow-md rounded-full"
          style={{
            background: `linear-gradient(135deg, ${addedProduct.color}, ${addedProduct.color}55)`,
          }}
        />
      ),
    });
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, checksRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders/check"),
        ]);

        if (!productsRes.ok)
          throw new Error(`Products: HTTP ${productsRes.status}`);
        if (!checksRes.ok) throw new Error(`Checks: HTTP ${checksRes.status}`);

        const [products, checks] = await Promise.all([
          productsRes.json(),
          checksRes.json(),
        ]);

        setProducts(products.data);

        const checkData = checks.data;
        if (checkData) {
          setOutProducts(
            checkData.map((cd: LimitResult) => cd.limitRule.productId),
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error)
    return <AlertError title="Failed to load products" description={error} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          soldOut={outProducts.includes(p.id)}
          handleAdd={handleAdd}
        />
      ))}
    </div>
  );
}
