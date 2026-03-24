"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDateTime, formatOrderNumber } from "@/lib/format";
import { ClipboardList, DollarSign, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types/database";

export default function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setOrders(data || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Today's Orders", value: todayOrders.length, icon: ClipboardList, color: "bg-blue-100 text-blue-700" },
    { label: "Pending", value: pendingOrders.length, icon: TrendingUp, color: "bg-yellow-100 text-yellow-700" },
    { label: "Today's Revenue", value: formatPrice(todayRevenue), icon: DollarSign, color: "bg-green-100 text-green-700" },
    { label: "Total Orders", value: orders.length, icon: Users, color: "bg-purple-100 text-purple-700" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-60 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-amber-100/60 shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500">{stat.label}</p>
                <p className="text-xl font-bold text-stone-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-amber-100/60 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-amber-700 hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-6 text-center text-sm text-stone-500">No orders yet</p>
          ) : (
            <div className="mt-4 divide-y divide-amber-50">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-amber-50/50"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-900">
                        {formatOrderNumber(order.order_number)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-stone-500">{formatDateTime(order.created_at)}</p>
                  </div>
                  <span className="font-semibold text-amber-700">{formatPrice(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
