"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/format";
import { Trash2, ArrowRight, Lock } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 350 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex flex-col items-center px-6 py-24 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#f5f3ef] text-5xl">
          🛒
        </div>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-[#1b1c1a]">
          Your cart is empty
        </h1>
        <p className="mt-3 text-lg text-[#534434]/70">
          Add some delicious dishes to get started
        </p>
        <Link
          href="/menu"
          className="mt-8 rounded-full bg-primary px-10 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 pb-32 md:py-20">
      {/* Editorial header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-[#534434] md:text-6xl">
          Your Selection of <br />
          <span className="italic text-primary">Mom&apos;s Cooking</span>
        </h1>
        <p className="mt-3 max-w-xl text-lg text-[#534434]/70">
          Every meal is prepared with fresh Sri Lankan spices and the warmth of home.
        </p>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Items list */}
        <div className="flex-grow space-y-5">
          {items.map((cartItem) => (
            <div
              key={cartItem.menuItem.id}
              className="flex flex-col items-center gap-5 rounded-[2rem] bg-white p-6 transition-transform duration-300 hover:scale-[1.01] sm:flex-row"
            >
              {/* Image */}
              <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-[#f5f3ef] sm:w-32">
                {cartItem.menuItem.image_url ? (
                  <Image
                    src={cartItem.menuItem.image_url}
                    alt={cartItem.menuItem.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">🍛</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-[#534434]">{cartItem.menuItem.name}</h3>
                <p className="mt-1 text-base font-bold text-primary">
                  {formatPrice(cartItem.menuItem.price)}
                </p>
              </div>

              {/* Qty */}
              <div className="flex items-center gap-3 rounded-full bg-[#f5f3ef] px-4 py-2">
                <button
                  onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                  className="text-primary transition-transform hover:scale-110"
                >
                  <span className="text-lg font-bold">−</span>
                </button>
                <span className="w-6 text-center font-bold text-[#534434]">
                  {String(cartItem.quantity).padStart(2, "0")}
                </span>
                <button
                  onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                  className="text-primary transition-transform hover:scale-110"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>

              {/* Subtotal + remove */}
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold uppercase tracking-widest text-[#534434]/40">Subtotal</p>
                <p className="text-2xl font-extrabold tracking-tighter text-[#1b1c1a]">
                  {formatPrice(cartItem.menuItem.price * cartItem.quantity)}
                </p>
              </div>
              <button
                onClick={() => removeItem(cartItem.menuItem.id)}
                className="text-[#534434]/30 transition-colors hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary card */}
        <aside className="w-full lg:w-96">
          <div className="sticky top-24 rounded-[2rem] bg-[#f5f3ef] p-8 shadow-[0_20px_40px_rgba(83,68,52,0.08)]">
            <h2 className="text-2xl font-bold text-[#534434]">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-[#534434]/60">Subtotal</span>
                <span className="font-semibold text-[#1b1c1a]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#534434]/60">Delivery Fee</span>
                <span className="font-semibold text-[#1b1c1a]">{formatPrice(deliveryFee)}</span>
              </div>
            </div>
            <div className="mt-6 border-t border-[#d8c3ad]/30 pt-6">
              <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-[#534434]">Total Amount</span>
                <span className="text-4xl font-extrabold tracking-tighter text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f59e0b] py-5 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-[1.03]"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#534434]/40">
              <Lock className="h-4 w-4" />
              <span>Secure transaction</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
