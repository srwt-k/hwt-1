import { prisma } from "@/lib/db";
import { DiscountRuleWithProducts } from "@/features/orders/types";

export const discountRepository = {
  findAllWithProduct(): Promise<DiscountRuleWithProducts[]> {
      return prisma.discountRule.findMany({
        include: { products: true },
      });
    },
};
