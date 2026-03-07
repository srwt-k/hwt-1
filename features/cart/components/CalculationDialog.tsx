"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalculationResult } from "@/features/orders/types";
import { formatNumber } from "@/lib/utils";

interface Props {
  result?: CalculationResult;
  onClose: () => void;
  open: boolean;
}

export function CalculationDialog({ open, result, onClose }: Props) {
  if (!result) return null;

  const pairDiscounts = result.discounts.filter((d) => d.productId !== 0);
  const memberDiscount = result.discounts.find((d) => d.productId === 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Calculate Total
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {/* Subtotal */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-foreground">Total (before discount)</p>
              <p className="text-lg font-bold mt-1">{formatNumber(result.subtotal, "currency")}</p>
            </CardContent>
          </Card>

          {/* Pair discounts */}
          {pairDiscounts.length > 0 && (
            <Card>
              <CardContent className="p-4 flex flex-col gap-2">
                <p className="text-sm font-semibold">Discounted Items</p>
                {pairDiscounts.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{d.label}</span>
                    <span className="text-foreground">-{formatNumber(d.saved, "currency")}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Member discount */}
          {memberDiscount && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-foreground">
                  Discount from {memberDiscount.label}
                </p>
                <p className="text-lg font-bold mt-1">
                  -{formatNumber(memberDiscount.saved, "currency")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Final total */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-bold">Final Total</p>
              <p className="text-lg font-bold mt-1">{formatNumber(result.total, "currency")}</p>
            </CardContent>
          </Card>

          {/* Recalculate button */}
          <Button
            onClick={onClose}
            className="w-auto mx-auto px-8 rounded-full bg-blue-400 hover:bg-blue-500 text-white
                     font-semibold text-base mt-4 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
