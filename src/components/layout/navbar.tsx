"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store/cart";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

export function Navbar() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase.auth]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    ...(user ? [{ href: "/orders", label: "Orders" }, { href: "/profile", label: "Profile" }] : []),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbf9f5] shadow-[0_4px_20px_rgba(83,68,52,0.05)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-[#534434]">
          SauPreps
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-all hover:scale-105",
                isActive(link.href)
                  ? "border-b-2 border-primary pb-0.5 font-bold text-primary"
                  : "text-[#534434] hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative">
            <button className="relative p-2 text-primary transition-transform hover:scale-105">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          {user ? (
            <Link href="/profile">
              <button className="p-2 text-[#534434] transition-transform hover:scale-105 hover:text-primary">
                <User className="h-5 w-5" />
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="rounded-full bg-primary px-6 py-2 font-bold text-white transition-transform hover:scale-105 active:scale-95">
                Login
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-full p-2 text-[#534434] transition-colors hover:bg-[#f5f3ef] hover:text-primary md:hidden">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#fbf9f5]">
              <div className="mt-6 pb-6">
                <span className="text-xl font-bold tracking-tighter text-[#534434]">SauPreps</span>
              </div>
              <nav className="mt-2 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-2.5 text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-[#534434] hover:bg-[#f5f3ef] hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Link href="/login" className="rounded-full px-4 py-2.5 text-base font-medium text-[#534434] hover:bg-[#f5f3ef] hover:text-primary">
                    Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
