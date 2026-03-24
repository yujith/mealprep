"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
        },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Welcome to SauPreps.");
      router.push("/menu");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      {/* Left panel — decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-[#534434] p-16">
        <div>
          <p className="text-3xl font-extrabold tracking-tighter text-white">SauPreps</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tighter text-white">
            Join the family.<br />Eat better.
          </h2>
          <p className="text-lg text-white/70">
            Create your account and get access to our weekly rotating menu of fresh, homemade Sri Lankan dishes.
          </p>
          <div className="rounded-[2rem] bg-white/10 p-8">
            <p className="text-lg italic text-white/80">
              &ldquo;I started SauPreps because busy people deserve home-cooked food without the effort. Every meal I make for you is the same one I&apos;d make for my own family.&rdquo;
            </p>
            <p className="mt-4 font-bold text-[#f59e0b]">— Saumya, Founder</p>
          </div>
        </div>
        <p className="text-sm text-white/30">&copy; 2025 SauPreps</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#f5f3ef] text-3xl">
              🥘
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1b1c1a]">Create your account</h1>
            <p className="mt-2 text-[#534434]/70">Join SauPreps — it only takes a minute</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="px-1 text-sm font-bold text-[#534434]">Full Name</label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Your name"
                  className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-1 text-sm font-bold text-[#534434]">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+94 77 XXX XXXX"
                  className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
                />
              </div>
            </div>
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
                placeholder="At least 6 characters"
                className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f59e0b] py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#534434]/60">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
