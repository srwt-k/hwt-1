import "./globals.css";

import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Food Store",
  description: "A food store app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <Navbar/>
        <Toaster />
        <div className="max-w-7xl mx-auto p-3">{children}</div>
      </body>
    </html>
  );
}
