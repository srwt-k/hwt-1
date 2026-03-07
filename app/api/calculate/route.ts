// app/api/calculate/route.ts
// POST /api/calculate

import { discountRepository } from "@/features/discounts/repository/discount.repository";
import { CreateOrderSchema } from "@/features/orders/order.schema";
import { calculate } from "@/features/orders/order.service";
import { orderRepository } from "@/features/orders/repository/order.repository";
import { productRepository } from "@/features/products/repository/product.repository";
import { OrderItem } from "@/prisma/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { items, cardNumber } = parsed.data;
    const isMember = cardNumber ? true : false;

    // Create order data with product details
    const products = await productRepository.findAll();
    const merged = items.map(({ id, quantity }) => {
      const product = products.find((p) => p.id === id);
      if (!product) throw new Error(`Product ${id} not found`);
      return {
        productId: product.id,
        quantity,
        name: product.name,
        price: product.price,
      } as OrderItem;
    });

    // Check item violations
    const violations = await orderRepository.findLimitViolations(merged)
    if(violations.length > 0){
      return NextResponse.json(
        { error: "Limit reached", data: violations },
        { status: 409 },
      );
    }

    const discountRules = await discountRepository.findAllWithProduct();
    const result = calculate(merged, discountRules, isMember);
    // Save order to DB
    await orderRepository.createBulk(merged, isMember);

    return NextResponse.json({ data: result });
  } catch (e){
    console.error(e)
    return NextResponse.json(
      { error: "Unable to calculate!" },
      { status: 400 },
    );
  }
}
