import { prisma } from "@/lib/db";
import { addMinutes, subtractMinutes } from "@/lib/date";
import { LimitResult } from "../types";
import { OrderItem } from "@/prisma/generated/prisma/client";

export const orderRepository = {
  findLimitViolations(incomingItems: OrderItem[]): Promise<LimitResult[]> {
    return prisma.$transaction(async (tx) => {
      const limits = await tx.limitRule.findMany({
        where:
          incomingItems.length > 0
            ? { productId: { in: incomingItems.map((i) => i.productId) } }
            : {},
      });

      if (limits.length === 0) return [];

      const violations: LimitResult[] = [];

      await Promise.all(
        limits.map(async (limit) => {
          const since = subtractMinutes(new Date(), limit.timeLimit);

          const items = await tx.orderItem.findMany({
            where: {
              productId: limit.productId,
              order: { createdAt: { gte: since } },
              quantity: { gt: 0 }
            },
            include: {
              order: { select: { createdAt: true } },
            },
            orderBy: {
              order: { createdAt: "desc" },
            },
          });

          const cartItem = incomingItems.find(
            (ii) => ii.productId === limit.productId,
          );
          const cartQty = cartItem?.quantity ?? 0;

          if (items.length >= limit.maxLimit || (items.length+ cartQty) > limit.maxLimit) {
            const item = items[0] || cartItem;
            violations.push({
              limitRule: limit,
              orderedQty: items.length, // DB 
              addedQty: cartQty, // Cart
              item,
              resetsAt: addMinutes(
                item.order?.createdAt ?? new Date(),
                limit.timeLimit,
              ),
            });
          }
        }),
      );

      return violations;
    });
  },

  createBulk(items: OrderItem[], member: boolean): Promise<unknown> {
    return prisma.order.create({
      data: {
        isMember: member,
        items: {
          createMany: {
            data: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
            })),
          },
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  },
};
