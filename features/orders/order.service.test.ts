// features/orders/order.service.test.ts
import { calculate } from "./order.service";
import { DiscountRuleWithProducts } from "./types";
import { OrderItem, Product } from "@/prisma/generated/prisma/client";

import products from "@/prisma/seeds/product/product.json";
import discounts from "@/prisma/seeds/discount/discount.json";

// Helper Function
const makeItem = (id: number, price: number, quantity: number): OrderItem => ({
  id,
  price,
  quantity,
  orderId: 1,
  productId: id,
  name: "",
});

const item = (
  menuItem: { id: number; price: number },
  qty: number,
): OrderItem => makeItem(menuItem.id, menuItem.price, qty);

// Prepare Data
const MENU = Object.fromEntries(
  products.map((p: Product) => [p.name, p]),
) as Record<string, Product>;

const ALL_RULES: DiscountRuleWithProducts[] = discounts.map((rule, i) => ({
  id: i + 1,
  type: rule.type,
  pairSize: rule.pairSize,
  discount: rule.discount,
  label: rule.label,
  createdAt: new Date(),
  updatedAt: new Date(),
  products: rule.productIds.map((productId) => ({
    id: productId,
    productId,
    discountRuleId: i + 1,
  })),
}));

// Test
describe("Calculator", () => {
  // Normal
  describe("Menu pricing — all 7 items", () => {
    it.each(Object.values(MENU))("$name x1 = $price", ({ id, price }) => {
      const { subtotal } = calculate([makeItem(id, price, 1)], ALL_RULES);
      expect(subtotal).toBe(price);
    });

    it("all 7 items x1 subtotal = 460", () => {
      const { subtotal, totalSaved } = calculate(
        Object.values(MENU).map((m) => item(m, 1)),
        ALL_RULES,
      );
      expect(subtotal).toBe(460);
      expect(totalSaved).toBe(0);
    });
  });

  describe("Multiple items", () => {
    it("can order multiple different items", () => {
      const { subtotal } = calculate(
        [
          item(MENU["Red set"], 1),
          item(MENU["Green set"], 1),
          item(MENU["Blue set"], 1),
        ],
        ALL_RULES,
      );
      expect(subtotal).toBe(
        MENU["Red set"].price +
          MENU["Green set"].price +
          MENU["Blue set"].price,
      );
    });

    it("can order multiple quantities of same item", () => {
      const { subtotal } = calculate([item(MENU["Yellow set"], 3)], ALL_RULES);
      expect(subtotal).toBe(MENU["Yellow set"].price * 3);
    });
  });
  // Pair
  describe("Pair discount — Orange x2 = (120+120) - 5%", () => {
    it("subtotal = 240", () => {
      const { subtotal } = calculate([item(MENU["Orange set"], 2)], ALL_RULES);
      expect(subtotal).toBe(240);
    });

    it("saved = 12", () => {
      const { totalSaved } = calculate(
        [item(MENU["Orange set"], 2)],
        ALL_RULES,
      );
      expect(totalSaved).toBe(12);
    });

    it("total = 228", () => {
      const { total } = calculate([item(MENU["Orange set"], 2)], ALL_RULES);
      expect(total).toBe(228);
    });

    it("Orange x1 = no discount", () => {
      const { totalSaved } = calculate(
        [item(MENU["Orange set"], 1)],
        ALL_RULES,
      );
      expect(totalSaved).toBe(0);
    });

    it("Orange x6 = 3 pairs, saved = 36", () => {
      const { totalSaved, total } = calculate(
        [item(MENU["Orange set"], 6)],
        ALL_RULES,
      );
      expect(totalSaved).toBe(36);
      expect(total).toBe(684);
    });
  });

  describe("Pair discount — Pink x4 = (80+80)-5% + (80+80)-5%", () => {
    it("subtotal = 320", () => {
      const { subtotal } = calculate([item(MENU["Pink set"], 4)], ALL_RULES);
      expect(subtotal).toBe(320);
    });

    it("saved = 16 (2 pairs)", () => {
      const { totalSaved } = calculate([item(MENU["Pink set"], 4)], ALL_RULES);
      expect(totalSaved).toBe(16);
    });

    it("total = 304", () => {
      const { total } = calculate([item(MENU["Pink set"], 4)], ALL_RULES);
      expect(total).toBe(304);
    });

    it("Pink x1 = no discount", () => {
      const { totalSaved } = calculate([item(MENU["Pink set"], 1)], ALL_RULES);
      expect(totalSaved).toBe(0);
    });
  });

  describe("Pair discount — Green x3 = (40+40)-5% + 40", () => {
    it("subtotal = 120", () => {
      const { subtotal } = calculate([item(MENU["Green set"], 3)], ALL_RULES);
      expect(subtotal).toBe(120);
    });

    it("saved = 4 (1 pair, 1 leftover)", () => {
      const { totalSaved } = calculate([item(MENU["Green set"], 3)], ALL_RULES);
      expect(totalSaved).toBe(4);
    });

    it("total = 116", () => {
      const { total } = calculate([item(MENU["Green set"], 3)], ALL_RULES);
      expect(total).toBe(116);
    });

    it("Green x1 = no discount", () => {
      const { totalSaved } = calculate([item(MENU["Green set"], 1)], ALL_RULES);
      expect(totalSaved).toBe(0);
    });
  });

  describe("Pair discount — no discount for Red, Blue, Yellow, Purple", () => {
    it.each(["Red set", "Blue set", "Yellow set", "Purple set"])(
      "%s x4 = no pair discount",
      (name) => {
        const { totalSaved } = calculate([item(MENU[name], 4)], ALL_RULES);
        expect(totalSaved).toBe(0);
      },
    );
  });

  describe("Pair discount — combined orders", () => {
    it("Orange x2 + Red x1 — only Orange discounted", () => {
      const { totalSaved } = calculate(
        [item(MENU["Orange set"], 2), item(MENU["Red set"], 1)],
        ALL_RULES,
      );
      expect(totalSaved).toBe(12);
    });

    it("Orange x2 + Pink x4 + Green x3 = saved 32", () => {
      const { totalSaved, total } = calculate(
        [
          item(MENU["Orange set"], 2),
          item(MENU["Pink set"], 4),
          item(MENU["Green set"], 3),
        ],
        ALL_RULES,
      );
      expect(totalSaved).toBe(32);
      expect(total).toBe(648);
    });
  });

  //Member

  describe("Member card — 10% off total", () => {
    it("Red x2 with member card = 90", () => {
      const { total } = calculate([item(MENU["Red set"], 2)], ALL_RULES, true);
      expect(total).toBeCloseTo(90);
    });

    it("10% applied AFTER pair discounts — Orange x2 = 205.20", () => {
      const { total } = calculate(
        [item(MENU["Orange set"], 2)],
        ALL_RULES,
        true,
      );
      expect(total).toBeCloseTo(205.2);
    });

    it("member card + all discountable items = 583.20", () => {
      const { total } = calculate(
        [
          item(MENU["Orange set"], 2),
          item(MENU["Pink set"], 4),
          item(MENU["Green set"], 3),
        ],
        ALL_RULES,
        true,
      );
      expect(total).toBeCloseTo(583.2);
    });

    it("no member discount without card", () => {
      const { total, discounts } = calculate(
        [item(MENU["Red set"], 2)],
        ALL_RULES,
        false,
      );
      expect(total).toBe(100);
      expect(discounts.find((d) => d.productId === 0)).toBeUndefined();
    });

    it("member card on empty cart = 0", () => {
      const { total } = calculate([], ALL_RULES, true);
      expect(total).toBe(0);
    });
  });

  // Other
  describe("Other cases", () => {
    it("empty cart returns zero", () => {
      const { subtotal, total, totalSaved } = calculate([], ALL_RULES);
      expect(subtotal).toBe(0);
      expect(total).toBe(0);
      expect(totalSaved).toBe(0);
    });

    it("total always equals subtotal - totalSaved", () => {
      const { subtotal, total, totalSaved } = calculate(
        [item(MENU["Orange set"], 2), item(MENU["Red set"], 1)],
        ALL_RULES,
        true,
      );
      expect(total).toBeCloseTo(subtotal - totalSaved);
    });

    it("no rules = no discounts", () => {
      const { totalSaved } = calculate([item(MENU["Orange set"], 4)], []);
      expect(totalSaved).toBe(0);
    });
  });
});
