export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Leaf, Banknote } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

const steps = [
  {
    icon: "🍽️",
    title: "Browse Menu",
    desc: "Select from our rotating weekly menu of traditional curries and modern healthy twists.",
  },
  {
    icon: "🛒",
    title: "Place Order",
    desc: "Customize your order and checkout by Thursday night before the weekly cutoff.",
  },
  {
    icon: "🎉",
    title: "Enjoy Your Meal",
    desc: "Freshly cooked meals delivered warm to your doorstep every Saturday.",
  },
];

const specials = [
  {
    name: "Mutton Black Curry",
    desc: "Slow-cooked in roasted spices for 6 hours.",
    price: "LKR 1,850",
    tag: "Spicy",
    tagBg: "bg-[#cda99d] text-[#573e34]",
    img: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&auto=format&fit=crop",
  },
  {
    name: "Heritage Rice & Curry",
    desc: "Red heirloom rice, five vegetable curries, choice of protein.",
    price: "LKR 1,450",
    tag: "Popular",
    tagBg: "bg-[#fed3c7] text-[#795950]",
    img: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=600&auto=format&fit=crop",
  },
  {
    name: "Spiced Chicken Bowl",
    desc: "Roasted pepper chicken with cauliflower rice and kale mallum.",
    price: "LKR 1,200",
    tag: "Keto",
    tagBg: "bg-[#cda99d] text-[#573e34]",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop",
  },
  {
    name: "Pol Sambol & Bread",
    desc: "Fresh coconut, chili, lime — the ultimate Sri Lankan comfort.",
    price: "LKR 650",
    tag: "Vegetarian",
    tagBg: "bg-[#fed3c7] text-[#795950]",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop",
  },
];

const differences = [
  {
    icon: Heart,
    title: "Homemade by Saumya",
    desc: "No commercial kitchen shortcuts. Every meal is cooked in small batches at home, just for you.",
  },
  {
    icon: Leaf,
    title: "Keto & Health Friendly",
    desc: "We offer cauliflower rice and low-carb versions of all your favourite Sri Lankan dishes.",
  },
  {
    icon: Banknote,
    title: "Affordable Luxury",
    desc: "Premium quality and ancestral taste at prices that make weekly meal prep accessible.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f5]">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative min-h-[600px] overflow-hidden px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Left: text */}
              <div className="space-y-8">
                <span className="inline-block rounded-full bg-[#fed3c7] px-4 py-1.5 text-sm font-semibold tracking-wide text-[#795950]">
                  Authentic Sri Lankan Kitchen
                </span>
                <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tighter text-[#1b1c1a] md:text-7xl">
                  Homemade <br />
                  <span className="text-primary">Sri Lankan</span> Meals.
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-[#534434]">
                  Authentic Sri Lankan flavours, delivered fresh every Saturday. Experience
                  Saumya&apos;s kitchen — where every dish is an heirloom recipe.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/menu"
                    className="rounded-full bg-gradient-to-r from-primary to-[#f59e0b] px-10 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
                  >
                    View Menu
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full border-2 border-[#d8c3ad] px-10 py-4 text-lg font-bold text-primary transition-colors hover:bg-[#f5f3ef]"
                  >
                    Our Story
                  </Link>
                </div>
              </div>

              {/* Right: hero image */}
              <div className="relative flex items-center justify-center lg:h-[580px]">
                <div className="absolute -right-10 -top-10 h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-3xl" />
                <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-700 hover:rotate-0 lg:h-full lg:rotate-3">
                  <Image
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop"
                    alt="Traditional Sri Lankan rice and curry spread"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] bg-white/80 p-5 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f59e0b] text-xl">
                        🍳
                      </div>
                      <div>
                        <p className="font-bold text-[#1b1c1a]">Fresh Weekly</p>
                        <p className="text-sm text-[#534434]">Orders close every Thursday night</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="bg-[#f5f3ef] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-[#1b1c1a] md:text-5xl">
                  Simple as 1, 2, 3
                </h2>
                <p className="mt-3 max-w-md text-lg text-[#534434]">
                  The easiest way to get authentic Sri Lankan food without compromising on taste.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="group rounded-[2rem] bg-white p-10 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#f59e0b]/20 text-3xl transition-transform group-hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[#1b1c1a]">{step.title}</h3>
                  <p className="leading-relaxed text-[#534434]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Today's Specials ── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-[#1b1c1a] md:text-5xl">
                This Week&apos;s Specials
              </h2>
              <Link
                href="/menu"
                className="rounded-full border border-[#d8c3ad] px-6 py-2.5 text-sm font-semibold text-[#534434] transition-colors hover:bg-[#f5f3ef]"
              >
                View Full Menu →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {specials.map((dish, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={dish.img}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${dish.tagBg}`}>
                        {dish.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-[#1b1c1a]">{dish.name}</h4>
                    <p className="mt-1 text-sm text-[#534434]/70">{dish.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{dish.price}</span>
                      <Link
                        href="/menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3ef] text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SauPreps Difference ── */}
        <section className="bg-[#f5f3ef]/50 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Staggered photo grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-10">
                  <div className="relative h-64 w-full overflow-hidden rounded-[2rem] shadow-lg">
                    <Image src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop" alt="Fresh Sri Lankan spices" fill className="object-cover" />
                  </div>
                  <div className="relative h-44 w-full overflow-hidden rounded-[2rem] shadow-lg">
                    <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop" alt="Home kitchen cooking" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative h-44 w-full overflow-hidden rounded-[2rem] shadow-lg">
                    <Image src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop" alt="Healthy meal prep containers" fill className="object-cover" />
                  </div>
                  <div className="relative h-64 w-full overflow-hidden rounded-[2rem] shadow-lg">
                    <Image src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop" alt="Vibrant healthy bowl" fill className="object-cover" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-8">
                <h2 className="text-4xl font-extrabold tracking-tight text-[#1b1c1a] md:text-5xl">
                  The SauPreps Difference
                </h2>
                <div className="space-y-6">
                  {differences.map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[#1b1c1a]">{item.title}</h4>
                        <p className="mt-1 leading-relaxed text-[#534434]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/menu"
                  className="inline-block rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Start Your Order
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
