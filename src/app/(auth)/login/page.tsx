"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      router.push("/menu");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      {/* Left panel — decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-[#f59e0b] to-primary p-16">
        <div>
          <p className="text-3xl font-extrabold tracking-tighter text-white">SauPreps</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tighter text-white">
            Saumya&apos;s kitchen,<br />on your doorstep.
          </h2>
          <p className="text-lg text-white/80">
            Authentic Sri Lankan home cooking, delivered fresh every Saturday.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { emoji: "🍛", text: "Traditional recipes, modern nutrition" },
              { emoji: "🥦", text: "Keto &amp; health-friendly options" },
              { emoji: "🚚", text: "Saturday delivery across Colombo" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-white/90" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-white/50">&copy; 2025 SauPreps</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#f5f3ef] text-3xl">
              🍛
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1b1c1a]">Welcome back</h1>
            <p className="mt-2 text-[#534434]/70">Sign in to your SauPreps account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="px-1 text-sm font-bold text-[#534434]">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-1 text-sm font-bold text-[#534434]">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f59e0b] py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#534434]/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
