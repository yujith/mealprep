"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50/50">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-amber-700 hover:bg-amber-100"
        onClick={onDecrement}
        disabled={quantity <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="w-8 text-center text-sm font-semibold text-stone-900">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-amber-700 hover:bg-amber-100"
        onClick={onIncrement}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
