// app/api/orders/check/route.ts
// GET /api/orders/check

import { NextResponse } from "next/server";
import { orderRepository } from "@/features/orders/repository/order.repository";

export async function GET() {
  const limitProducts = await orderRepository.findLimitViolations([]);
  return NextResponse.json({ data: limitProducts });
}
