import { prisma } from "@/lib/db";
import data from "./product.json";

const Seed_Product = async () => {
  await prisma.product.createMany({
    data: data,
  });
};

export { Seed_Product };
