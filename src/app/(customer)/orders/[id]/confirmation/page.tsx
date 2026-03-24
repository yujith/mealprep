"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatOrderNumber } from "@/lib/format";
import type { Order } from "@/types/database";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabase.from("orders").select("*").eq("id", id).single();
      setOrder(data);
      setLoading(false);
    }
    if (id) fetchOrder();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Skeleton className="mx-auto h-60 max-w-md rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-12 md:py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-stone-900">Order Placed!</h1>
      {order && (
        <p className="mt-2 text-lg text-stone-600">
          Order {formatOrderNumber(order.order_number)} — <span className="font-semibold text-amber-700">{formatPrice(order.total)}</span>
        </p>
      )}

      {order?.payment_method === "bank_transfer" && (
        <Card className="mt-6 max-w-md border-blue-200 bg-blue-50">
          <CardContent className="p-5 text-center text-sm text-blue-800">
            <p className="font-semibold">Bank Transfer Selected</p>
            <p className="mt-1 text-blue-600">
              Please complete your bank transfer and upload the receipt from your order detail page to confirm payment.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={`/orders/${id}`}>
          <Button className="rounded-full bg-amber-600 px-8 font-semibold hover:bg-amber-700">
            View Order Details
          </Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline" className="rounded-full border-amber-200 px-8 font-semibold text-amber-700 hover:bg-amber-50">
            Back to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
}
