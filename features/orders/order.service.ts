import { OrderItem } from "@/prisma/generated/prisma/client";
import {
  CalculationResult,
  DiscountItem,
  DiscountRuleWithProducts,
} from "./types";

export function calculate(
  items: OrderItem[],
  rules: DiscountRuleWithProducts[],
  hasMemberCard: boolean = false,
): CalculationResult {
  const subtotal = items.reduce(
    (s: number, l: OrderItem) => s + l.price * l.quantity,
    0,
  );
  const discounts:DiscountItem[] = [];
  const pairRules = rules.filter((r) => r.type === "PAIR");

  for (const rule of pairRules) {
    const productIds = rule.products.map((p) => p.productId);

    for (const productId of productIds) {
      // Match product in cart with the rule's product
      const matchItem = items.find((l) => l.id === productId);
      if (!matchItem) continue;

      // How many pair for discount
      const pairs = Math.floor(matchItem.quantity / rule.pairSize);
      if (pairs === 0) continue;

      const saved = matchItem.price * rule.pairSize * rule.discount * pairs;
      discounts.push({ productId, label: rule.label, pairs, saved });
    }
  }

  const afterPairDiscount =
    subtotal - discounts.reduce((s, d) => s + d.saved, 0);

  if (hasMemberCard) {
    const memberRule = rules.find((r) => r.type === "MEMBER");
    if (memberRule) {
      discounts.push({
        productId: 0,
        label: memberRule.label,
        pairs: memberRule.pairSize,
        saved: afterPairDiscount * memberRule.discount,
      });
    }
  }

  const totalSaved = discounts.reduce((s:number, d) => s + d.saved, 0);

  return { subtotal, discounts, totalSaved, total: subtotal - totalSaved };
}
