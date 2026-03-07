"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertError } from "@/components/AlertError";
import { CartCard } from "./CartCard";
import { CartItem } from "../types";
import { useCartStore } from "../store";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Product } from "@/prisma/generated/prisma/client";
import { toast } from "sonner";
import { CalculationResult, LimitResult } from "@/features/orders/types";
import { CalculationDialog } from "./CalculationDialog";
import { LimitViolationDialog } from "./LimitViolationDialog";
import { formatDate } from "@/lib/utils";

export default function CartList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items } = useCartStore();
  const storeSetItemQuantity = useCartStore((s) => s.setItemQuantity);
  const storeIncreaseItem = useCartStore((s) => s.increase);
  const storeDecreaseItem = useCartStore((s) => s.decrease);

  const [cardNumber, setCardNumber] = useState("");

  const increase = (id: number) => storeIncreaseItem(id);
  const decrease = (id: number) => storeDecreaseItem(id);
  const onInput = (ci: CartItem) => storeSetItemQuantity(ci);

  const [result, setResult] = useState<CalculationResult>();
  const [violations, setViolations] = useState<LimitResult[]>([]);

  const [modalOpen, setModalOpen] = useState<"calulation" | "violation">();

  useEffect(() => {
    if (violations.length === 0) return;

    const violationItemIDs = violations.map(
      (v: LimitResult) => v.item.productId,
    );
    const isInCart = items.some((c: CartItem) =>
      violationItemIDs.includes(c.id),
    );
    if (isInCart) {
      setModalOpen("violation");
    }
  }, [items, violations]);

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
        setViolations(checks.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const closeAndRemoveViolationItems = () => {
    for (const eachViolation of violations) {
      storeSetItemQuantity({
        id: eachViolation.limitRule.productId,
        quantity: 0,
      });
      toast.error(
        `We have removed ${eachViolation.item.name}, you can reorder at ${formatDate(eachViolation.resetsAt)}`,
      );
    }
    setModalOpen(undefined);
  };

  const closeAndRemoveCartItems = () => {
    for (const item of items) {
      storeSetItemQuantity({
        id: item.id,
        quantity: 0,
      });
    }
    setModalOpen(undefined);
  };


  const submitCalculate = () => {
    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, cardNumber }),
    })
      .then((res) => res.json().then((json) => ({ res, json })))
      .then((data) => {
        const { res, json } = data;
        if (res.ok) {
          setResult(json.data);
          setModalOpen("calulation");
        } else {
          const errorData = json.data;
          if (errorData) {
            setViolations(errorData);
            setModalOpen("violation");
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <AlertError title="Failed to load cart products" description={error} />
    );

  if (items.length === 0)
    return (
      <div className="text-center">
        <h3 className="text-center text-2xl font-semibold tracking-tight">
          Your cart is empty
        </h3>
        <p className="text-sm text-muted-foreground">
          Try add something please.
        </p>
      </div>
    );

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-3">
        {items.map((c: CartItem) => (
          <CartCard
            key={c.id}
            product={products.find((p) => p.id === c.id)}
            quantity={c.quantity}
            onIncrease={() => increase(c.id)}
            onDecrease={() => decrease(c.id)}
            onInputChange={(changedQty: number) =>
              onInput({ id: c.id, quantity: changedQty })
            }
          />
        ))}

        <div className="flex flex-col gap-2 mt-2">
          <Label className="font-semibold text-stone-700">Membership</Label>
          <Input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Your card number..."
            className="h-12 rounded-2xl bg-white border-stone-100 shadow-sm"
          />
        </div>

        <Button
          className="w-full h-12 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white
                     font-semibold text-base mt-4 cursor-pointer"
          onClick={submitCalculate}
        >
          Calculate
        </Button>

        <CalculationDialog
          open={modalOpen === "calulation"}
          result={result}
          onClose={() =>
            closeAndRemoveCartItems()
          }
        />
        <LimitViolationDialog
          open={modalOpen === "violation"}
          violations={violations}
          onClose={() => 
            closeAndRemoveViolationItems()
          }
        />
      </div>
    </div>
  );
}
