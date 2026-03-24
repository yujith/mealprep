"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import type { Profile } from "@/types/database";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();
      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, [supabase, router]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", profile.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials = form.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-12">
        <div className="h-10 w-48 animate-pulse rounded-full bg-[#f5f3ef]" />
        <div className="h-80 animate-pulse rounded-[2rem] bg-[#f5f3ef]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 pb-32 md:py-16">
      {/* Header */}
      <header className="mb-10 flex flex-col items-center gap-5 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-[#f59e0b] text-3xl font-extrabold text-white shadow-lg">
          {initials}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1b1c1a]">
            {form.full_name || "Your Profile"}
          </h1>
          <p className="mt-1 text-[#534434]/60">{profile?.role === "admin" ? "Administrator" : "SauPreps Member"}</p>
        </div>
        <Link
          href="/orders"
          className="rounded-full bg-[#f5f3ef] px-6 py-2.5 text-sm font-bold text-[#534434] transition-colors hover:bg-[#eae8e4]"
        >
          View My Orders →
        </Link>
      </header>

      {/* Form card */}
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-[#534434]">Personal Information</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="px-1 text-sm font-bold text-[#534434]">Full Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary"
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
            <label className="px-1 text-sm font-bold text-[#534434]">Delivery Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Your default delivery address"
              className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-1 text-sm font-bold text-[#534434]">City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Colombo"
              className="rounded-[1rem] bg-[#f5f3ef] px-5 py-4 text-[#1b1c1a] outline-none ring-1 ring-[#d8c3ad]/40 transition-all focus:ring-2 focus:ring-primary placeholder:text-[#867461]/50"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f59e0b] py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Sign out */}
      <div className="mt-6 rounded-[2rem] bg-white p-6">
        <h3 className="mb-4 font-bold text-[#534434]">Account</h3>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-full bg-red-50 px-6 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
