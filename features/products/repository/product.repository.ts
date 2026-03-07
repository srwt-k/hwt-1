import { prisma }  from "@/lib/db";
import { Product } from "@/prisma/generated/prisma/client";

export const productRepository = {
  findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: { id: "asc" },
    });
  },
};