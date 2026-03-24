"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { DIETARY_TAGS } from "@/lib/constants";
import { toast } from "sonner";
import type { MenuItem, MenuCategory } from "@/types/database";
import Image from "next/image";

interface MenuItemForm {
  name: string;
  description: string;
  price: number;
  category_id: string;
  tags: string[];
  is_available: boolean;
  sort_order: number;
  image_url: string;
}

const emptyForm: MenuItemForm = {
  name: "",
  description: "",
  price: 0,
  category_id: "",
  tags: [],
  is_available: true,
  sort_order: 0,
  image_url: "",
};

export default function AdminMenuPage() {
  const supabase = createClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuItemForm>(emptyForm);

  const fetchData = useCallback(async () => {
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from("menu_items").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setItems(itemsRes.data || []);
    setCategories(catsRes.data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id || "",
      tags: item.tags || [],
      is_available: item.is_available,
      sort_order: item.sort_order,
      image_url: item.image_url || "",
    });
    setDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (form.price <= 0) { toast.error("Price must be greater than 0"); return; }
    setSaving(true);

    const payload = {
      ...form,
      category_id: form.category_id || null,
    };

    if (editingId) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", editingId);
      if (error) toast.error("Failed to update"); else toast.success("Item updated");
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) toast.error("Failed to create"); else toast.success("Item created");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file);
    if (error) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("menu-images").getPublicUrl(path);
    setForm({ ...form, image_url: urlData.publicUrl });
    toast.success("Image uploaded");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Menu Items</h1>
        <Button onClick={openNew} className="rounded-full bg-amber-600 font-semibold hover:bg-amber-700">
          <Plus className="mr-1.5 h-4 w-4" /> Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <span className="text-5xl">🍽️</span>
          <p className="mt-4 text-stone-500">No menu items yet. Add your first dish!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-amber-100/60 shadow-sm">
              <div className="relative aspect-[16/10] bg-amber-50">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl opacity-50">🍛</div>
                )}
                {!item.is_available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-stone-700">Unavailable</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-900">{item.name}</h3>
                    <p className="text-sm font-bold text-amber-700">{formatPrice(item.price)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Menu Item" : "New Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (LKR) *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="mt-1.5" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={(val) => val && setForm({ ...form, category_id: val })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {DIETARY_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={form.tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${form.tags.includes(tag) ? "bg-amber-600" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Image</Label>
              {form.image_url && (
                <div className="relative mt-1.5 aspect-video w-full overflow-hidden rounded-lg bg-stone-100">
                  <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1.5" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_available} onCheckedChange={(v) => setForm({ ...form, is_available: v })} />
              <Label>Available</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full rounded-full bg-amber-600 font-semibold hover:bg-amber-700">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
