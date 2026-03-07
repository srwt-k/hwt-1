"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "./ui/badge";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/features/cart/store";
import { APP_NAME } from "@/constants";

export function Navbar() {
  const pathname = usePathname();
  const storeCount = useCartStore((s) => s.counter());
  const { isHydrated } = useCartStore();

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background">
      <NavigationMenu className="w-full max-w-none h-full px-6">
        <span className="text-base font-bold text-foreground whitespace-nowrap mr-4">
          {APP_NAME}
        </span>

        <NavigationMenuList className="w-full h-full flex items-center justify-between">
          <NavigationMenuItem>
            <NavigationMenuLink
              active={pathname === "/"}
              href="/"
              className={navigationMenuTriggerStyle()}
            >
              Product
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              active={pathname === "/cart"}
              href="/cart"
              className={navigationMenuTriggerStyle()}
            >
              Cart
              {isHydrated && storeCount > 0 && (
                <Badge className="h-5 px-1.5 text-xs">{storeCount}</Badge>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
