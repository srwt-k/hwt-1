import { LimitRule, OrderItem, Prisma } from "@/prisma/generated/prisma/client";

export type DiscountRuleWithProducts = Prisma.DiscountRuleGetPayload<{
  include: {
    products: true;
  };
}>;

export type CalculationResult = {
  discounts: DiscountItem[];
  totalSaved: number;
  total: number;
  subtotal: number;
};
export type DiscountItem = {
  productId: number;
  label: string;
  pairs: number;
  saved: number;
};

export type LimitResult = {
  limitRule: Omit<LimitRule, "product">;
  orderedQty: number;
  addedQty: number;
  item: OrderItem;
  resetsAt: Date;
};
