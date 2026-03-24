export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          address: string;
          city: string;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string;
          address?: string;
          city?: string;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          address?: string;
          city?: string;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string;
          price: number;
          image_url: string;
          tags: string[];
          is_available: boolean;
          max_quantity_per_day: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          description?: string;
          price: number;
          image_url?: string;
          tags?: string[];
          is_available?: boolean;
          max_quantity_per_day?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          tags?: string[];
          is_available?: boolean;
          max_quantity_per_day?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          user_id: string;
          status:
            | "pending"
            | "confirmed"
            | "preparing"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          payment_method: "cash" | "bank_transfer";
          payment_status: "pending" | "confirmed" | "rejected";
          subtotal: number;
          delivery_fee: number;
          total: number;
          delivery_method: "dad" | "pickme" | "uber" | null;
          delivery_address: string;
          delivery_city: string;
          delivery_notes: string;
          scheduled_date: string | null;
          scheduled_time: string | null;
          admin_notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: number;
          user_id: string;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          payment_method: "cash" | "bank_transfer";
          payment_status?: "pending" | "confirmed" | "rejected";
          subtotal: number;
          delivery_fee: number;
          total: number;
          delivery_method?: "dad" | "pickme" | "uber" | null;
          delivery_address: string;
          delivery_city?: string;
          delivery_notes?: string;
          scheduled_date?: string | null;
          scheduled_time?: string | null;
          admin_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: number;
          user_id?: string;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          payment_method?: "cash" | "bank_transfer";
          payment_status?: "pending" | "confirmed" | "rejected";
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          delivery_method?: "dad" | "pickme" | "uber" | null;
          delivery_address?: string;
          delivery_city?: string;
          delivery_notes?: string;
          scheduled_date?: string | null;
          scheduled_time?: string | null;
          admin_notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          name: string;
          price: number;
          quantity: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          name: string;
          price: number;
          quantity: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          name?: string;
          price?: number;
          quantity?: number;
          subtotal?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_receipts: {
        Row: {
          id: string;
          order_id: string;
          receipt_url: string;
          uploaded_by: string | null;
          status: "pending" | "confirmed" | "rejected";
          admin_note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          receipt_url: string;
          uploaded_by?: string | null;
          status?: "pending" | "confirmed" | "rejected";
          admin_note?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          receipt_url?: string;
          uploaded_by?: string | null;
          status?: "pending" | "confirmed" | "rejected";
          admin_note?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_receipts_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_receipts_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      site_settings: {
        Row: {
          id: number;
          business_name: string;
          delivery_fee: number;
          min_order_amount: number;
          is_accepting_orders: boolean;
          operating_hours: Json;
          bank_details: Json;
          contact_phone: string;
          contact_whatsapp: string;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          business_name?: string;
          delivery_fee?: number;
          min_order_amount?: number;
          is_accepting_orders?: boolean;
          operating_hours?: Json;
          bank_details?: Json;
          contact_phone?: string;
          contact_whatsapp?: string;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          business_name?: string;
          delivery_fee?: number;
          min_order_amount?: number;
          is_accepting_orders?: boolean;
          operating_hours?: Json;
          bank_details?: Json;
          contact_phone?: string;
          contact_whatsapp?: string;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "customer" | "admin";
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "out_for_delivery"
        | "delivered"
        | "cancelled";
      payment_method: "cash" | "bank_transfer";
      payment_status: "pending" | "confirmed" | "rejected";
      delivery_method: "dad" | "pickme" | "uber";
    };
    CompositeTypes: Record<string, never>;
  };
};

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type MenuCategory = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type PaymentReceipt = Database["public"]["Tables"]["payment_receipts"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentMethod = Database["public"]["Enums"]["payment_method"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type DeliveryMethod = Database["public"]["Enums"]["delivery_method"];
export type UserRole = Database["public"]["Enums"]["user_role"];
