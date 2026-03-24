"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDateTime, formatOrderNumber } from "@/lib/format";
import { PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import type { Order, OrderItem, OrderStatus, DeliveryMethod } from "@/types/database";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = useMemo(() => createClient(), []);

  const [order, setOrder] = useState<
    (Order & { profiles: { full_name: string; phone: string; address: string } | null }) | null
  >(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<OrderStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      const [orderRes, itemsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single(),
        supabase.from("order_items").select("*").eq("order_id", id),
      ]);

      if (orderRes.error) {
        console.error("Order fetch error:", orderRes.error);
        setLoading(false);
        return;
      }

      // Fetch profile separately since there's no FK relationship
      let profileData = null;
      if (orderRes.data?.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, address")
          .eq("id", orderRes.data.user_id)
          .single();
        profileData = profile;
      }

      const data = { ...orderRes.data, profiles: profileData } as typeof order;
      if (data) {
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.payment_status);
        setDeliveryMethod(data.delivery_method || "");
        setAdminNotes(data.admin_notes || "");
      }
      setOrderItems(itemsRes.data || []);
      setLoading(false);
    }
    if (id) fetchOrder();
  }, [id, supabase]);

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        payment_status: paymentStatus as "pending" | "confirmed" | "rejected",
        delivery_method: (deliveryMethod || null) as DeliveryMethod | null,
        admin_notes: adminNotes,
      })
      .eq("id", order.id);

    if (error) toast.error("Failed to save");
    else toast.success("Order updated");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-60 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return <div className="py-20 text-center text-stone-500">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-stone-900">
          {formatOrderNumber(order.order_number)}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-sm text-stone-500">{formatDateTime(order.created_at)}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-amber-100/60 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-stone-900">Customer</h3>
            <div className="mt-3 space-y-1 text-sm text-stone-600">
              <p><span className="font-medium text-stone-700">Name:</span> {order.profiles?.full_name || "—"}</p>
              <p><span className="font-medium text-stone-700">Phone:</span> {order.profiles?.phone || "—"}</p>
              <p><span className="font-medium text-stone-700">Address:</span> {order.delivery_address || "—"}</p>
              <p><span className="font-medium text-stone-700">City:</span> {order.delivery_city || "—"}</p>
              {order.delivery_notes && (
                <p><span className="font-medium text-stone-700">Notes:</span> {order.delivery_notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100/60 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-stone-900">Items</h3>
            <div className="mt-3 divide-y divide-amber-50">
              {orderItems.map((oi) => (
                <div key={oi.id} className="flex justify-between py-2">
                  <span className="text-sm text-stone-600">{oi.name} × {oi.quantity}</span>
                  <span className="text-sm font-medium text-stone-900">{formatPrice(oi.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-amber-100 pt-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span><span>{formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900">
                <span>Total</span><span className="text-amber-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-100/60 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-stone-900">Manage Order</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Order Status</Label>
              <Select value={status} onValueChange={(val) => val && setStatus(val as OrderStatus)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={(val) => val && setPaymentStatus(val)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery Method</Label>
              <Select value={deliveryMethod} onValueChange={(val) => val && setDeliveryMethod(val)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dad">Dad (Self)</SelectItem>
                  <SelectItem value="pickme">PickMe</SelectItem>
                  <SelectItem value="uber">Uber</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label>Admin Notes</Label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="mt-1.5"
              rows={3}
              placeholder="Internal notes about this order..."
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 rounded-full bg-amber-600 font-semibold hover:bg-amber-700"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
