export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      card_grading_history: {
        Row: {
          card_grading_id: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          card_grading_id?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          card_grading_id?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "card_grading_history_card_grading_id_fkey"
            columns: ["card_grading_id"]
            isOneToOne: false
            referencedRelation: "card_gradings"
            referencedColumns: ["id"]
          },
        ]
      }
      card_gradings: {
        Row: {
          back_image_url: string | null
          card_name: string
          card_number: string | null
          created_at: string
          customer_address: string | null
          customer_city: string | null
          customer_country: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          customer_state: string | null
          customer_zip: string | null
          ean8: string
          front_image_url: string | null
          graded_at: string | null
          graded_by: string | null
          grading_details: Json | null
          id: string
          notes: string | null
          order_id: string
          priority: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          set_name: string | null
          shipping_method: Database["public"]["Enums"]["shipping_method"]
          status: Database["public"]["Enums"]["order_status"]
          user_id: string | null
          variant: string | null
          year: string | null
        }
        Insert: {
          back_image_url?: string | null
          card_name: string
          card_number?: string | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          customer_state?: string | null
          customer_zip?: string | null
          ean8: string
          front_image_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          grading_details?: Json | null
          id?: string
          notes?: string | null
          order_id: string
          priority?: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          set_name?: string | null
          shipping_method: Database["public"]["Enums"]["shipping_method"]
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string | null
          variant?: string | null
          year?: string | null
        }
        Update: {
          back_image_url?: string | null
          card_name?: string
          card_number?: string | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          customer_state?: string | null
          customer_zip?: string | null
          ean8?: string
          front_image_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          grading_details?: Json | null
          id?: string
          notes?: string | null
          order_id?: string
          priority?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          set_name?: string | null
          shipping_method?: Database["public"]["Enums"]["shipping_method"]
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string | null
          variant?: string | null
          year?: string | null
        }
        Relationships: []
      }
      card_submission_orders: {
        Row: {
          created_at: string | null
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          service_type: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          service_type: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          service_type?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_grading_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_orders: number
          pending_orders: number
          completed_orders: number
          rejected_orders: number
          avg_completion_time: unknown
          total_revenue: number
          orders_this_month: number
        }[]
      }
      get_next_in_queue: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          order_id: string
          card_name: string
          priority: number
        }[]
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "queued"
        | "in_progress"
        | "completed"
        | "rejected"
      payment_status: "pending" | "completed" | "failed"
      service_type: "standard" | "express" | "premium"
      shipping_method: "standard" | "express" | "international"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
