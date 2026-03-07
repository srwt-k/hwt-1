"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/prisma/generated/prisma/client";

export function ProductCard({
  product,
  soldOut,
  handleAdd,
}: {
  product: Product;
  soldOut: boolean;
  handleAdd: (p: Product) => void;
}) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div
        className="w-full h-20 shadow-md px-2 relative z-20 aspect-video object-cover"
        style={{
          background: `linear-gradient(135deg, ${product.color}, ${product.color}55)`,
        }}
      />
      <CardHeader>
        <CardAction>
          <span className="font-normal text-base shrink-0 ml-2">
            {product.price}
          </span>
          <small className="text-muted-foreground ml-1">
            {product.currency}
          </small>
        </CardAction>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardFooter className="p-4 pt-2">
        <Button
          className={`w-full rounded-full ${soldOut ? "bg-black" : "bg-blue-400"} text-white shadow-none border-none
             hover:bg-blue-500 hover:scale-110
             active:scale-95 active:bg-blue-600
             disabled:opacity-40 disabled:scale-100
             transition-all duration-150 cursor-pointer`}
          size="sm"
          onClick={() => handleAdd(product)}
          disabled={soldOut}
        >
          {soldOut ? "Sold Out" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
