"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, Truck, CreditCard, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const steps = [
  { label: "Delivery Details" },
  { label: "Payment" },
  { label: "Confirm" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">("cash");
  const [form, setForm] = useState({
    delivery_address: "",
    delivery_city: "",
    delivery_notes: "",
  });

  const subtotal = getSubtotal();
  const deliveryFee = 350;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    if (!form.delivery_address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Please login to place an order");
        router.push("/login");
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userData.user.id,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          payment_method: paymentMethod,
          payment_status: "pending",
          status: "pending",
          delivery_address: form.delivery_address,
          delivery_city: form.delivery_city,
          delivery_notes: form.delivery_notes,
        })
        .select("id, order_number")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((ci) => ({
        order_id: order.id,
        menu_item_id: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
        subtotal: ci.menuItem.price * ci.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${order.id}/confirmation`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex flex-col items-center px-6 py-24 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#f5f3ef] text-5xl">
          🛒
        </div>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-[#1b1c1a]">Nothing to checkout</h1>
        <p className="mt-3 text-lg text-[#534434]/70">Add some items to your cart first</p>
        <Link
          href="/menu"
          className="mt-8 rounded-full bg-primary px-10 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 pb-32 md:py-20">
      {/* Editorial header + step indicator */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tighter text-[#534434] md:text-6xl">
          Finalizing Your Order
        </h1>
        <div className="mt-6 flex items-center gap-4 text-sm font-medium">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                i === 0
                  ? "bg-primary text-white"
                  : "bg-[#e4e2de] text-[#534434]"
              }`}>
                {i + 1}
              </div>
              <span className={i === 0 ? "font-bold text-primary" : "text-[#534434]/40"}>
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div className="h-px w-8 bg-[#d8c3ad]" />
              )}
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Forms */}
        <div className="space-y-8 lg:col-span-7">
          {/* Delivery Details */}
          <section className="rounded-[2rem] bg-[#f5f3ef] p-8 md:p-10">
            <div className="mb-8 flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-[#534434]">Where should we deliver?</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="px-1 text-sm font-bold text-[#534434]">City</label>
                  <select
                    value={form.delivery_city}
                    onChange={(e) => setForm({ ...form, delivery_city: e.target.value })}
                    className="rounded-[1rem] border-none bg-white px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select city...</option>
                    <option>Colombo</option>
                    <option>Kandy</option>
                    <option>Galle</option>
                    <option>Negombo</option>
                    <option>Dehiwala</option>
                    <option>Moratuwa</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="px-1 text-sm font-bold text-[#534434]">Delivery Date</label>
                  <input
                    type="date"
                    className="rounded-[1rem] border-none bg-white px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-1 text-sm font-bold text-[#534434]">Delivery Address *</label>
                <textarea
                  value={form.delivery_address}
                  onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                  placeholder="House No, Street Name, Area"
                  rows={3}
                  className="rounded-[1rem] border-none bg-white px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50 resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-1 text-sm font-bold text-[#534434]">Delivery Notes (Optional)</label>
                <textarea
                  value={form.delivery_notes}
                  onChange={(e) => setForm({ ...form, delivery_notes: e.target.value })}
                  placeholder="Apartment code, specific directions, or spice level requests..."
                  rows={2}
                  className="rounded-[1rem] border-none bg-white px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-[2rem] bg-[#f5f3ef] p-8 md:p-10">
            <div className="mb-8 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-[#534434]">Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`rounded-[1.5rem] p-6 text-left transition-all ring-1 ${
                  paymentMethod === "cash"
                    ? "bg-white ring-2 ring-primary bg-primary/5"
                    : "bg-white ring-[#d8c3ad]/40 hover:ring-[#d8c3ad]"
                }`}
              >
                <div className="mb-4 text-3xl">🤝</div>
                <h3 className="text-lg font-bold text-[#1b1c1a]">Cash on Delivery</h3>
                <p className="mt-1 text-sm text-[#534434]/70">Pay when your warm meal arrives.</p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`rounded-[1.5rem] p-6 text-left transition-all ring-1 ${
                  paymentMethod === "bank_transfer"
                    ? "bg-white ring-2 ring-primary bg-primary/5"
                    : "bg-white ring-[#d8c3ad]/40 hover:ring-[#d8c3ad]"
                }`}
              >
                <div className="mb-4 text-3xl">🏦</div>
                <h3 className="text-lg font-bold text-[#1b1c1a]">Bank Transfer</h3>
                <p className="mt-1 text-sm text-[#534434]/70">Secure direct deposit.</p>
              </button>
            </div>

            {paymentMethod === "bank_transfer" && (
              <div className="mt-6 flex flex-col items-start gap-4 rounded-[1.5rem] border-l-4 border-primary bg-[#fed3c7]/30 p-6 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl">
                  ℹ️
                </div>
                <div>
                  <p className="font-bold text-[#534434]">Bank Transfer Details</p>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#534434]/50">Bank</p>
                      <p className="font-semibold text-[#1b1c1a]">Bank of Ceylon</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#534434]/50">Account</p>
                      <p className="font-semibold text-[#1b1c1a]">To be confirmed</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#534434]/50">Holder</p>
                      <p className="font-semibold text-[#1b1c1a]">Saumya P.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Summary Sidebar */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_40px_rgba(83,68,52,0.08)]">
            <div className="border-b border-[#e4e2de] p-8">
              <h2 className="text-2xl font-bold text-[#534434]">Order Summary</h2>
            </div>
            <div className="space-y-4 p-8">
              {items.map((ci) => (
                <div key={ci.menuItem.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.75rem]">
                    {ci.menuItem.image_url ? (
                      <Image
                        src={ci.menuItem.image_url}
                        alt={ci.menuItem.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f5f3ef] text-2xl">
                        🍛
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-[#1b1c1a]">{ci.menuItem.name}</h4>
                    <p className="text-sm text-[#534434]/60">Qty: {ci.quantity}</p>
                  </div>
                  <p className="font-bold text-primary">{formatPrice(ci.menuItem.price * ci.quantity)}</p>
                </div>
              ))}

              <div className="space-y-3 border-t border-[#e4e2de] pt-6">
                <div className="flex justify-between text-[#534434]/70">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1b1c1a]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#534434]/70">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-primary">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex items-end justify-between pt-4">
                  <span className="text-xl font-bold text-[#534434]">Total</span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#534434]/40">
                      Inc. all fees
                    </p>
                    <p className="text-4xl font-extrabold tracking-tighter text-primary">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-[#f59e0b] py-5 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-sm text-[#534434]/40">
                <Lock className="h-4 w-4" />
                <span>Secure encrypted checkout</span>
              </div>
            </div>
          </div>

          {/* Saumya quote */}
          <div className="mt-6 rounded-[2rem] bg-[#f5f3ef] p-6 text-center">
            <p className="text-sm italic text-[#534434]/70">
              &ldquo;Every meal is prepared with fresh local ingredients and the same care I put into my own family&apos;s dinner.&rdquo;
            </p>
            <p className="mt-3 font-bold text-primary">— Saumya</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
