"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/format";
import type { Order } from "@/types/database";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "past">("active");

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  const activeStatuses = ["pending", "confirmed", "preparing", "out_for_delivery"];
  const activeOrders = orders.filter((o) => activeStatuses.includes(o.status));
  const pastOrders = orders.filter((o) => !activeStatuses.includes(o.status));
  const displayOrders = tab === "active" ? activeOrders : pastOrders;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 pb-32 md:py-16">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter text-[#534434] md:text-5xl">
          Your Orders
        </h1>
        <p className="mt-2 text-[#534434]/60">Track and review all your SauPreps orders.</p>
      </header>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 rounded-full bg-[#f5f3ef] p-1.5">
        {(["active", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-3 text-sm font-bold transition-all",
              tab === t
                ? "bg-white text-primary shadow-sm"
                : "text-[#534434]/50 hover:text-[#534434]"
            )}
          >
            {t === "active" ? `Active (${activeOrders.length})` : `History (${pastOrders.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[2rem] bg-[#f5f3ef]" />
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-5xl">📋</p>
          <p className="mt-6 text-xl font-bold text-[#534434]">No {tab} orders yet</p>
          <p className="mt-2 text-[#534434]/60">
            {tab === "active"
              ? "Place an order to get started!"
              : "Your completed orders will appear here."}
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-block rounded-full bg-primary px-8 py-3 font-bold text-white transition-transform hover:scale-105"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="group flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-extrabold tracking-tight text-[#1b1c1a]">
                    {formatOrderNumber(order.order_number)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-[#534434]/60">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold tracking-tighter text-primary">
                  {formatPrice(order.total)}
                </span>
                <ChevronRight className="h-5 w-5 text-[#534434]/30 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
