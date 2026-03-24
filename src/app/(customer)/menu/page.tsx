"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Search } from "lucide-react";
import type { MenuItem, MenuCategory } from "@/types/database";
import { cn } from "@/lib/utils";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [itemsRes, catsRes] = await Promise.all([
        supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order"),
        supabase.from("menu_categories").select("*").eq("is_active", true).order("sort_order"),
      ]);
      setItems(itemsRes.data || []);
      setCategories(catsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = !activeCategory || item.category_id === activeCategory;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 pb-32">
      {/* Editorial header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter text-[#534434] md:text-6xl">
          Browsing Our{" "}
          <span className="italic text-primary">Sri Lankan</span> Kitchen
        </h1>
        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#867461]" />
          <input
            type="text"
            placeholder="Search for hoppers, curries, or snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[1.5rem] bg-[#f5f3ef] py-4 pl-12 pr-6 text-base text-[#1b1c1a] placeholder:text-[#867461]/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      {/* Category pills */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "whitespace-nowrap rounded-full px-8 py-3 font-bold transition-all hover:scale-105",
            activeCategory === null
              ? "bg-primary text-white shadow-md"
              : "bg-white text-[#534434] hover:bg-[#eae8e4]"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-8 py-3 font-bold transition-all hover:scale-105",
              activeCategory === cat.id
                ? "bg-primary text-white shadow-md"
                : "bg-white text-[#534434] hover:bg-[#eae8e4]"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[2rem] bg-white p-4 shadow-sm">
              <div className="h-64 animate-pulse rounded-[1.5rem] bg-[#f5f3ef]" />
              <div className="mt-4 space-y-2 p-2">
                <div className="h-5 w-3/4 animate-pulse rounded-full bg-[#f5f3ef]" />
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#f5f3ef]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-6 text-xl font-bold text-[#534434]">No dishes found</p>
          <p className="mt-2 text-[#534434]/60">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
