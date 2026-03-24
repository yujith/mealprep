"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBasket, ClipboardList, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/menu", icon: UtensilsCrossed, label: "Menu" },
  { href: "/cart", icon: ShoppingBasket, label: "Cart" },
  { href: "/orders", icon: ClipboardList, label: "Orders" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around rounded-t-[2rem] bg-[#fbf9f5]/80 px-4 pb-6 pt-3 shadow-[0_-10px_30px_rgba(83,68,52,0.1)] backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 p-2 transition-all duration-300",
              isActive
                ? "-translate-y-2 scale-110 rounded-full bg-[#f59e0b] p-3 text-white shadow-lg"
                : "text-[#534434] hover:bg-[#f5f3ef] hover:rounded-full"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label === "Cart" && itemCount > 0 && !isActive && (
              <span className="absolute -right-0.5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
            <span className={cn("text-[10px] font-medium", isActive && "mt-0.5")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
