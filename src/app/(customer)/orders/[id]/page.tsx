"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDateTime, formatOrderNumber } from "@/lib/format";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { Order, OrderItem } from "@/types/database";
import { ArrowLeft, Check, MapPin, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const statusSteps = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"] as const;

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const [orderRes, itemsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).single(),
        supabase.from("order_items").select("*").eq("order_id", id),
      ]);
      setOrder(orderRes.data);
      setOrderItems(itemsRes.data || []);
      setLoading(false);
    }
    if (id) fetchOrder();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <div className="h-10 w-48 animate-pulse rounded-full bg-[#f5f3ef]" />
        <div className="h-48 animate-pulse rounded-[2rem] bg-[#f5f3ef]" />
        <div className="h-64 animate-pulse rounded-[2rem] bg-[#f5f3ef]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto px-6 py-20 text-center">
        <p className="text-5xl">🔍</p>
        <p className="mt-6 text-xl font-bold text-[#534434]">Order not found</p>
      </div>
    );
  }

  const currentStep = ORDER_STATUS_CONFIG[order.status]?.step ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 pb-32 md:py-16">
      <Link
        href="/orders"
        className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#f5f3ef] px-4 py-2 text-sm font-bold text-[#534434] transition-colors hover:bg-[#eae8e4]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Order header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1b1c1a]">
            {formatOrderNumber(order.order_number)}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-2 text-[#534434]/60">{formatDateTime(order.created_at)}</p>
      </header>

      {/* Progress stepper */}
      {order.status !== "cancelled" && (
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-bold text-[#534434]">Order Progress</h2>
          <div className="flex items-start justify-between gap-1">
            {statusSteps.map((step, i) => {
              const stepNum = ORDER_STATUS_CONFIG[step].step;
              const isComplete = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={step} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={cn("h-1 flex-1 rounded-full transition-colors",
                        isComplete ? "bg-primary" : "bg-[#e4e2de]"
                      )} />
                    )}
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold transition-all",
                      isComplete ? "bg-primary text-white" :
                      isCurrent ? "bg-[#f59e0b]/20 text-primary ring-2 ring-primary" :
                      "bg-[#f5f3ef] text-[#534434]/40"
                    )}>
                      {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={cn("h-1 flex-1 rounded-full transition-colors",
                        isComplete ? "bg-primary" : "bg-[#e4e2de]"
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    "text-center text-[10px] font-bold uppercase tracking-widest",
                    isCurrent ? "text-primary" :
                    isComplete ? "text-[#534434]" : "text-[#534434]/30"
                  )}>
                    {ORDER_STATUS_CONFIG[step].label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items + totals */}
      <div className="mb-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-[#534434]">Items Ordered</h2>
        <div className="space-y-4">
          {orderItems.map((oi) => (
            <div key={oi.id} className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#1b1c1a]">{oi.name}</p>
                <p className="text-sm text-[#534434]/60">{formatPrice(oi.price)} × {oi.quantity}</p>
              </div>
              <span className="font-bold text-primary">{formatPrice(oi.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-[#e4e2de] pt-6">
          <div className="flex justify-between text-[#534434]/60">
            <span>Subtotal</span>
            <span className="font-medium text-[#1b1c1a]">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#534434]/60">
            <span>Delivery Fee</span>
            <span className="font-medium text-[#1b1c1a]">{formatPrice(order.delivery_fee)}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-[#534434]">Total</span>
            <span className="text-2xl font-extrabold tracking-tighter text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-[#534434]">Delivery Address</h3>
          </div>
          <p className="text-[#1b1c1a]">{order.delivery_address || "—"}</p>
          <p className="mt-1 text-[#534434]/60">{order.delivery_city || ""}</p>
          {order.delivery_notes && (
            <p className="mt-3 rounded-[1rem] bg-[#f5f3ef] px-4 py-3 text-sm text-[#534434]">
              {order.delivery_notes}
            </p>
          )}
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-[#534434]">Payment</h3>
          </div>
          <p className="text-[#1b1c1a]">
            {order.payment_method === "cash" ? "Cash on Delivery" : "Bank Transfer"}
          </p>
          <p className="mt-1 text-sm text-[#534434]/60">
            {order.payment_method === "cash"
              ? "Pay when your meal arrives."
              : "Upload your bank transfer receipt from the order page."}
          </p>
        </div>
      </div>
    </div>
  );
}
