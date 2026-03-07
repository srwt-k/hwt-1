import { prisma } from "@/lib/db";

const Seed_LimitRule = async () => {
  await prisma.limitRule.create({
    data: {
      name: "Rare Red Set Limit",
      maxLimit: 1,
      product: {
        connect: { id: 1 },
      },
    },
  });
};

export { Seed_LimitRule };
