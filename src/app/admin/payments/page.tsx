"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDateTime, formatOrderNumber } from "@/lib/format";
import { PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import type { Order } from "@/types/database";

export default function AdminPaymentsPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_method", "bank_transfer")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  const filtered = orders.filter(
    (o) => filter === "all" || o.payment_status === filter
  );

  const updatePaymentStatus = async (orderId: string, status: "confirmed" | "rejected") => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("id", orderId);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(`Payment ${status}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, payment_status: status } : o))
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Bank Transfer Payments</h1>
        <Select value={filter} onValueChange={(val) => val && setFilter(val)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-stone-500">
          <span className="text-5xl">💳</span>
          <p className="mt-4">No bank transfer payments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id} className="border-amber-100/60 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">
                        {formatOrderNumber(order.order_number)}
                      </span>
                      <Badge
                        variant="outline"
                        className={PAYMENT_STATUS_CONFIG[order.payment_status]?.color + " text-xs"}
                      >
                        {PAYMENT_STATUS_CONFIG[order.payment_status]?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>{formatDateTime(order.created_at)}</span>
                      <span>·</span>
                      <span className="font-semibold text-amber-700">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-amber-700 hover:underline"
                    >
                      <ExternalLink className="inline h-3 w-3" /> View Order
                    </a>
                    {order.payment_status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updatePaymentStatus(order.id, "confirmed")}
                          className="h-8 rounded-full bg-green-600 text-xs font-semibold hover:bg-green-700"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePaymentStatus(order.id, "rejected")}
                          className="h-8 rounded-full border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
