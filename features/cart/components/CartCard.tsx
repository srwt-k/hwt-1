import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/prisma/generated/prisma/client";

export function CartCard({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onInputChange,
}: {
  product?: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onInputChange: (changedQty: number) => void;
}) {
  const [qty, setQty] = useState(quantity);

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  if(!product) return null;

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="w-16 h-16 rounded-xl shrink-0"
          style={{
            background: `linear-gradient(135deg, ${product.color}, ${product.color}55)`,
          }}
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{product.name}</p>
          <p className="mt-0.5">
            <span className="font-bold text-base">{product.price}</span>
            <small className="text-muted-foreground ml-1">{product.currency}</small>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="icon"
            onClick={onDecrease}
            disabled={qty === 0}
            className="w-9 h-9 rounded-full bg-blue-400 text-white
                       hover:bg-blue-500 hover:scale-110
                       active:scale-95 active:bg-blue-600
                       disabled:opacity-40 disabled:scale-100
                       transition-all duration-150 cursor-pointer"
          >
            <span className="text-lg font-bold leading-none">-</span>
          </Button>

          <Input
            type="text"
            className="w-14 text-center font-semibold text-sm"
            value={qty}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQty(Number(e.target.value) || 0)
            }
            onBlur={(e: FocusEvent<HTMLInputElement>) =>
              onInputChange(Number(e.target.value) || 0)
            }
          />

          <Button
            size="icon"
            onClick={onIncrease}
            className="w-9 h-9 rounded-full bg-blue-400 text-white
                       hover:bg-blue-500 hover:scale-110
                       active:scale-95 active:bg-blue-600
                       transition-all duration-150 cursor-pointer"
          >
            <span className="text-lg font-bold leading-none">+</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
