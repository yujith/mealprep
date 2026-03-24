"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDateTime, formatOrderNumber } from "@/lib/format";
import { PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import type { Order } from "@/types/database";

export default function AdminOrdersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<
    (Order & { profiles?: { full_name: string; phone: string } | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchOrders() {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (ordersError) {
        console.error("Orders fetch error:", ordersError);
        setOrders([]);
        setLoading(false);
        return;
      }

      // Batch-fetch all profiles in one query
      const userIds = Array.from(new Set((ordersData || []).map((o) => o.user_id)));
      const { data: profilesData } = userIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id, full_name, phone")
            .in("id", userIds)
        : { data: [] };

      const profileMap = new Map(
        (profilesData || []).map((p) => [p.id, { full_name: p.full_name, phone: p.phone }])
      );

      const ordersWithProfiles = (ordersData || []).map((order) => ({
        ...order,
        profiles: profileMap.get(order.user_id) || null,
      }));

      setOrders(ordersWithProfiles);
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesSearch =
      !search ||
      formatOrderNumber(o.order_number).toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-40" /></div>
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Orders</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-stone-500">No orders found</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card className="border-amber-100/60 shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">
                        {formatOrderNumber(order.order_number)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                      <Badge variant="outline" className={PAYMENT_STATUS_CONFIG[order.payment_status]?.color + " text-[10px]"}>
                        Pay: {PAYMENT_STATUS_CONFIG[order.payment_status]?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>{order.profiles?.full_name || "Unknown"}</span>
                      <span>·</span>
                      <span>{formatDateTime(order.created_at)}</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-amber-700">
                    {formatPrice(order.total)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
