// app/api/products/route.ts
// GET /api/products

import { NextResponse } from "next/server";
import { productRepository } from "@/features/products/repository/product.repository";

export async function GET() {
  const products = await productRepository.findAll();
  return NextResponse.json({ data: products });
}
