import { OrderItem } from "@/prisma/generated/prisma/client";

export type CartStore = {
  items: CartItem[];
  isHydrated: boolean;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  setItemQuantity: (item: CartItem) => void;
  counter:  () => number;
}

export type CartItem = Pick<OrderItem, "id" | "quantity">;