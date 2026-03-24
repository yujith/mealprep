"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import type { MenuItem } from "@/types/database";

const tagColors: Record<string, string> = {
  keto: "bg-[#cda99d] text-[#573e34]",
  spicy: "bg-[#cda99d] text-[#573e34]",
  hot: "bg-[#cda99d] text-[#573e34]",
  vegetarian: "bg-[#fed3c7] text-[#795950]",
  vegan: "bg-[#fed3c7] text-[#795950]",
  popular: "bg-[#fed3c7] text-[#795950]",
  mild: "bg-[#fed3c7] text-[#795950]",
  fresh: "bg-[#ffddb8] text-[#653e00]",
};

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem(item, qty);
    toast.success(`${item.name} added to cart`);
    setQty(1);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f5f3ef]">
            <span className="text-6xl opacity-50">🍛</span>
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${tagColors[tag.toLowerCase()] || "bg-[#e4e2de] text-[#534434]"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-xl font-bold text-[#534434]">{item.name}</h3>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#1b1c1a]/70">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {formatPrice(item.price)}
            </span>
            {/* Inline qty selector */}
            <div className="flex items-center gap-1 rounded-full bg-[#f5f3ef] px-1 py-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-[#eae8e4]"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-[#1b1c1a]">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-[#eae8e4]"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 w-full rounded-full bg-primary py-3 font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
