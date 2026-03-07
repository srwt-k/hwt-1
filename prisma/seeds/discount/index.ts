import { prisma } from "@/lib/db";
import data from "./discount.json";

const Seed_Discount = async () => {
  for (const rule of data) {
    const created = await prisma.discountRule.create({
      data: {
        type: rule.type,
        pairSize: rule.pairSize,
        discount: rule.discount,
        label: rule.label,
      },
    });

    await prisma.discountRuleProduct.createMany({
      data: rule.productIds.map((productId: number) => ({
        discountRuleId: created.id,
        productId,
      })),
    });
  }
};

export { Seed_Discount };
