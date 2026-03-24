export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { OrdersClosedBanner } from "@/components/shared/orders-closed-banner";
import { createClient } from "@/lib/supabase/server";
import { isOrderingOpen } from "@/lib/order-window";
import type { OrderWindowSettings } from "@/lib/order-window";

async function getOrderWindowStatus() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return { open: true, reason: "", nextOpenLabel: "" };

    // Cast through unknown: new columns exist after migration, types are not regenerated yet
    const row = data as unknown as Record<string, unknown>;

    const settings: OrderWindowSettings = {
      is_accepting_orders: (row.is_accepting_orders as boolean) ?? true,
      auto_cutoff_enabled: (row.auto_cutoff_enabled as boolean) ?? true,
      cutoff_day: (row.cutoff_day as number) ?? 4,
      cutoff_time: (row.cutoff_time as string) ?? "23:59:00",
      reopen_day: (row.reopen_day as number) ?? 1,
      reopen_time: (row.reopen_time as string) ?? "06:00:00",
    };

    return isOrderingOpen(settings);
  } catch {
    return { open: true, reason: "", nextOpenLabel: "" };
  }
}

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orderStatus = await getOrderWindowStatus();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <OrdersClosedBanner status={orderStatus} />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
