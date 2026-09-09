export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          campaign_code: string
          catalog_url: string | null
          created_at: string
          ends_at: string | null
          id: string
          name: string
          notes: string
          starts_at: string | null
          status: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          campaign_code: string
          catalog_url?: string | null
          created_at?: string
          ends_at?: string | null
          id: string
          name: string
          notes?: string
          starts_at?: string | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          campaign_code?: string
          catalog_url?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          name?: string
          notes?: string
          starts_at?: string | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      catalog_uploads: {
        Row: {
          campaign_id: string | null
          file_name: string
          file_path: string
          id: string
          mime_type: string
          notes: string
          page_count: number | null
          public_url: string
          size_bytes: number
          status: string
          title: string
          uploaded_at: string
        }
        Insert: {
          campaign_id?: string | null
          file_name: string
          file_path: string
          id?: string
          mime_type: string
          notes?: string
          page_count?: number | null
          public_url: string
          size_bytes?: number
          status?: string
          title: string
          uploaded_at?: string
        }
        Update: {
          campaign_id?: string | null
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string
          notes?: string
          page_count?: number | null
          public_url?: string
          size_bytes?: number
          status?: string
          title?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_uploads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          category: string | null
          created_at: string
          id: number
          image: string | null
          order_id: string
          price: number
          product_id: string | null
          product_name: string
          quantity: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          order_id: string
          price: number
          product_id?: string | null
          product_name: string
          quantity: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          order_id?: string
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          channel: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          id: string
          mercado_pago_payment_id: string | null
          mercado_pago_preference_id: string | null
          metadata: Json
          status: string
          total: number
          updated_at: string
          whatsapp_url: string | null
        }
        Insert: {
          channel?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          id: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          metadata?: Json
          status?: string
          total?: number
          updated_at?: string
          whatsapp_url?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          metadata?: Json
          status?: string
          total?: number
          updated_at?: string
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          benefits: Json
          brand: string
          campaign_code: string | null
          category: string
          colors: Json
          created_at: string
          description: string
          featured: boolean
          id: string
          image: string | null
          inventory: number
          name: string
          price: number
          promo_price: number | null
          promotion: boolean
          published: boolean
          search_keywords: string
          sizes: Json
          sku: string
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          benefits?: Json
          brand?: string
          campaign_code?: string | null
          category: string
          colors?: Json
          created_at?: string
          description?: string
          featured?: boolean
          id: string
          image?: string | null
          inventory?: number
          name: string
          price: number
          promo_price?: number | null
          promotion?: boolean
          published?: boolean
          search_keywords?: string
          sizes?: Json
          sku: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          benefits?: Json
          brand?: string
          campaign_code?: string | null
          category?: string
          colors?: Json
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image?: string | null
          inventory?: number
          name?: string
          price?: number
          promo_price?: number | null
          promotion?: boolean
          published?: boolean
          search_keywords?: string
          sizes?: Json
          sku?: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      yanbal_orders: {
        Row: {
          access_hash: string
          attribution: Json
          checkout_key: string
          created_at: string
          customer: Json
          id: string
          items: Json
          payment_id: string | null
          payment_status: string
          preference_id: string | null
          purchase_claimed_at: string | null
          shipping: number
          status: string
          subtotal: number
          total: number
        }
        Insert: {
          access_hash: string
          attribution?: Json
          checkout_key: string
          created_at?: string
          customer: Json
          id: string
          items: Json
          payment_id?: string | null
          payment_status?: string
          preference_id?: string | null
          purchase_claimed_at?: string | null
          shipping: number
          status?: string
          subtotal: number
          total: number
        }
        Update: {
          access_hash?: string
          attribution?: Json
          checkout_key?: string
          created_at?: string
          customer?: Json
          id?: string
          items?: Json
          payment_id?: string | null
          payment_status?: string
          preference_id?: string | null
          purchase_claimed_at?: string | null
          shipping?: number
          status?: string
          subtotal?: number
          total?: number
        }
        Relationships: []
      }
      yanbal_payment_events: {
        Row: {
          order_id: string
          payment_id: string
          status: string
          updated_at: string
        }
        Insert: {
          order_id: string
          payment_id: string
          status: string
          updated_at: string
        }
        Update: {
          order_id?: string
          payment_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "yanbal_payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "yanbal_orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      yanbal_apply_payment: {
        Args: {
          p_order_id: string
          p_payment_id: string
          p_status: string
          p_updated: string
        }
        Returns: undefined
      }
      yanbal_claim_purchase: { Args: { p_order_id: string }; Returns: boolean }
      yanbal_create_order: { Args: { p_order: Json }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
