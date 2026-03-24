"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/types/database";

const DAY_OPTIONS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface BankDetails {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState("SauPreps");
  const [deliveryFee, setDeliveryFee] = useState(350);
  const [minOrder, setMinOrder] = useState(1000);
  const [isAccepting, setIsAccepting] = useState(true);
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [bank, setBank] = useState<BankDetails>({ bank_name: "", account_number: "", account_holder: "" });
  const [social, setSocial] = useState<SocialLinks>({ facebook: "", instagram: "", whatsapp: "" });

  // Order window / cutoff
  const [autoCutoffEnabled, setAutoCutoffEnabled] = useState(true);
  const [cutoffDay, setCutoffDay] = useState(4);
  const [cutoffTime, setCutoffTime] = useState("23:59");
  const [reopenDay, setReopenDay] = useState(1);
  const [reopenTime, setReopenTime] = useState("06:00");

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) {
        setBusinessName(data.business_name);
        setDeliveryFee(data.delivery_fee);
        setMinOrder(data.min_order_amount);
        setIsAccepting(data.is_accepting_orders);
        setContactPhone(data.contact_phone || "");
        setContactWhatsapp(data.contact_whatsapp || "");
        const b = (data.bank_details as unknown as BankDetails) || {};
        const s = (data.social_links as unknown as SocialLinks) || {};
        setBank({ bank_name: b.bank_name || "", account_number: b.account_number || "", account_holder: b.account_holder || "" });
        setSocial({ facebook: s.facebook || "", instagram: s.instagram || "", whatsapp: s.whatsapp || "" });
        // Cutoff fields (added via migration — may be absent before migration runs)
        const row = data as unknown as Record<string, unknown>;
        if (row.auto_cutoff_enabled !== undefined) setAutoCutoffEnabled(row.auto_cutoff_enabled as boolean);
        if (row.cutoff_day !== undefined) setCutoffDay(row.cutoff_day as number);
        if (row.cutoff_time !== undefined) setCutoffTime((row.cutoff_time as string).slice(0, 5));
        if (row.reopen_day !== undefined) setReopenDay(row.reopen_day as number);
        if (row.reopen_time !== undefined) setReopenTime((row.reopen_time as string).slice(0, 5));
      }
      setLoading(false);
    }
    fetchSettings();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        business_name: businessName,
        delivery_fee: deliveryFee,
        min_order_amount: minOrder,
        is_accepting_orders: isAccepting,
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        bank_details: bank as unknown as Json,
        social_links: social as unknown as Json,
        // Cutoff fields cast through unknown for forward compatibility
        ...({ auto_cutoff_enabled: autoCutoffEnabled, cutoff_day: cutoffDay, cutoff_time: cutoffTime + ":00", reopen_day: reopenDay, reopen_time: reopenTime + ":00" } as unknown as Record<string, unknown>),
      } as unknown as Record<string, unknown>)
      .eq("id", 1);
    if (error) toast.error("Failed to save settings");
    else toast.success("Settings saved!");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-amber-600 font-semibold hover:bg-amber-700"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All
        </Button>
      </div>

      <Card className="border-amber-100/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Business Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Business Name</Label>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Delivery Fee (LKR)</Label>
              <Input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)} className="mt-1.5" />
            </div>
            <div>
              <Label>Min Order Amount (LKR)</Label>
              <Input type="number" value={minOrder} onChange={(e) => setMinOrder(parseFloat(e.target.value) || 0)} className="mt-1.5" />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3">
            <Switch checked={isAccepting} onCheckedChange={setIsAccepting} />
            <div>
              <Label className="font-medium">Emergency Override — Accept Orders Now</Label>
              <p className="text-xs text-stone-500">Manually open/close orders regardless of the auto schedule below</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Order Window / Cutoff ── */}
      <Card className="border-amber-100/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4 text-amber-600" />
            Order Window (Weekly Cutoff)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3">
            <Switch checked={autoCutoffEnabled} onCheckedChange={setAutoCutoffEnabled} />
            <div>
              <Label className="font-medium">Auto Weekly Cutoff</Label>
              <p className="text-xs text-stone-500">Automatically close orders on the cutoff day/time and reopen on the reopen day/time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cutoff Day</Label>
              <select
                value={cutoffDay}
                onChange={(e) => setCutoffDay(parseInt(e.target.value))}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Cutoff Time (Sri Lanka)</Label>
              <Input
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Reopen Day</Label>
              <select
                value={reopenDay}
                onChange={(e) => setReopenDay(parseInt(e.target.value))}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Reopen Time (Sri Lanka)</Label>
              <Input
                type="time"
                value={reopenTime}
                onChange={(e) => setReopenTime(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
            Default: Orders close <strong>Thursday 11:59 PM</strong> and reopen <strong>Monday 6:00 AM</strong> (Sri Lanka time UTC+5:30).
            The Emergency Override above can open/close orders outside this schedule at any time.
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-100/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Phone</Label>
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+94 7X XXX XXXX" className="mt-1.5" />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="+94 7X XXX XXXX" className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Bank Name</Label>
            <Input value={bank.bank_name} onChange={(e) => setBank({ ...bank, bank_name: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input value={bank.account_number} onChange={(e) => setBank({ ...bank, account_number: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Account Holder</Label>
            <Input value={bank.account_holder} onChange={(e) => setBank({ ...bank, account_holder: e.target.value })} className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facebook</Label>
            <Input value={social.facebook} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} placeholder="https://facebook.com/..." className="mt-1.5" />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input value={social.instagram} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} placeholder="https://instagram.com/..." className="mt-1.5" />
          </div>
          <div>
            <Label>WhatsApp Link</Label>
            <Input value={social.whatsapp} onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })} placeholder="https://wa.me/..." className="mt-1.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
