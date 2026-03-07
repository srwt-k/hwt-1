// features/orders/order.schema.ts
import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.number(),
  quantity: z.number().min(0),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  cardNumber: z.string().optional(),
});