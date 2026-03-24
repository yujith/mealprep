"use client";

import { Clock } from "lucide-react";
import type { OrderWindowResult } from "@/lib/order-window";

interface OrdersClosedBannerProps {
  status: OrderWindowResult;
}

export function OrdersClosedBanner({ status }: OrdersClosedBannerProps) {
  if (status.open) return null;

  return (
    <div className="w-full bg-[#fed3c7] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
          🍳
        </div>
        <div className="flex-grow">
          <p className="font-bold text-[#534434]">{status.reason}</p>
          <p className="text-sm text-[#534434]/70">{status.nextOpenLabel}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-full bg-white/60 px-4 py-2 sm:flex">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Closed</span>
        </div>
      </div>
    </div>
  );
}
