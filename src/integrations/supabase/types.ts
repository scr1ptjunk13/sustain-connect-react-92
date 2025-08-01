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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string | null
          room_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          room_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          room_type: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          room_type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          room_type?: string | null
        }
        Relationships: []
      }
      data_deletion_requests: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          scheduled_deletion_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          scheduled_deletion_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          scheduled_deletion_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          created_at: string
          data: Json | null
          download_url: string | null
          expires_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      delivery_assignments: {
        Row: {
          created_at: string | null
          current_location_lat: number | null
          current_location_lng: number | null
          delivery_address: string
          delivery_completed_at: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          delivery_person_id: string
          delivery_scheduled_at: string | null
          donation_id: string
          eta_minutes: number | null
          id: string
          ngo_id: string
          notes: string | null
          pickup_completed_at: string | null
          pickup_scheduled_at: string | null
          status: Database["public"]["Enums"]["delivery_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          delivery_address: string
          delivery_completed_at?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_person_id: string
          delivery_scheduled_at?: string | null
          donation_id: string
          eta_minutes?: number | null
          id?: string
          ngo_id: string
          notes?: string | null
          pickup_completed_at?: string | null
          pickup_scheduled_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          delivery_address?: string
          delivery_completed_at?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_person_id?: string
          delivery_scheduled_at?: string | null
          donation_id?: string
          eta_minutes?: number | null
          id?: string
          ngo_id?: string
          notes?: string | null
          pickup_completed_at?: string | null
          pickup_scheduled_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_delivery_person_id_fkey"
            columns: ["delivery_person_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_details: {
        Row: {
          created_at: string | null
          current_location_lat: number | null
          current_location_lng: number | null
          id: string
          is_available: boolean | null
          license_number: string
          user_id: string
          vehicle_type: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          id?: string
          is_available?: boolean | null
          license_number: string
          user_id: string
          vehicle_type: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          id?: string
          is_available?: boolean | null
          license_number?: string
          user_id?: string
          vehicle_type?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          category: string
          claimed_at: string | null
          claimed_by: string | null
          created_at: string | null
          description: string | null
          donor_id: string
          expiry_date: string | null
          id: string
          images: string[] | null
          pickup_address: string
          pickup_city: string
          pickup_lat: number | null
          pickup_lng: number | null
          pickup_state: string
          pickup_zip_code: string
          quantity: number
          special_instructions: string | null
          status: Database["public"]["Enums"]["donation_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          description?: string | null
          donor_id: string
          expiry_date?: string | null
          id?: string
          images?: string[] | null
          pickup_address: string
          pickup_city: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_state: string
          pickup_zip_code: string
          quantity?: number
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          description?: string | null
          donor_id?: string
          expiry_date?: string | null
          id?: string
          images?: string[] | null
          pickup_address?: string
          pickup_city?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_state?: string
          pickup_zip_code?: string
          quantity?: number
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_claimed_by_fkey"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          payment_count: number | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          total_fees: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          payment_count?: number | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          total_fees?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          payment_count?: number | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          total_fees?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      impact_records: {
        Row: {
          created_at: string | null
          donation_id: string
          id: string
          impact_description: string | null
          impact_photos: string[] | null
          ngo_id: string
          people_helped: number | null
        }
        Insert: {
          created_at?: string | null
          donation_id: string
          id?: string
          impact_description?: string | null
          impact_photos?: string[] | null
          ngo_id: string
          people_helped?: number | null
        }
        Update: {
          created_at?: string | null
          donation_id?: string
          id?: string
          impact_description?: string | null
          impact_photos?: string[] | null
          ngo_id?: string
          people_helped?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_records_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impact_records_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ngo_details: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string
          organization_name: string
          registration_number: string
          state: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_name: string
          registration_number: string
          state?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_name?: string
          registration_number?: string
          state?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ngo_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_history: {
        Row: {
          content: string
          created_at: string
          external_id: string | null
          id: string
          notification_type: string
          status: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          external_id?: string | null
          id?: string
          notification_type: string
          status?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          external_id?: string | null
          id?: string
          notification_type?: string
          status?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          delivery_updates: boolean | null
          donation_updates: boolean | null
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          marketing: boolean | null
          push_enabled: boolean | null
          sms_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_updates?: boolean | null
          donation_updates?: boolean | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          marketing?: boolean | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_updates?: boolean | null
          donation_updates?: boolean | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          marketing?: boolean | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string
          description: string
          donation_id: string | null
          id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          description: string
          donation_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          description?: string
          donation_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_consents: {
        Row: {
          analytics_consent: boolean | null
          created_at: string
          data_sharing_consent: boolean | null
          id: string
          marketing_consent: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_consent?: boolean | null
          created_at?: string
          data_sharing_consent?: boolean | null
          id?: string
          marketing_consent?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_consent?: boolean | null
          created_at?: string
          data_sharing_consent?: boolean | null
          id?: string
          marketing_consent?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: string
          subscription: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subscription: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subscription?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_receipts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          description: string | null
          id: string
          issued_date: string
          payment_id: string
          receipt_number: string
          recipient_email: string
          recipient_name: string
          tax_year: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          issued_date: string
          payment_id: string
          receipt_number: string
          recipient_email: string
          recipient_name: string
          tax_year: number
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          issued_date?: string
          payment_id?: string
          receipt_number?: string
          recipient_email?: string
          recipient_name?: string
          tax_year?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_status: "available" | "assigned" | "in_progress" | "completed"
      donation_status:
        | "pending"
        | "claimed"
        | "picked_up"
        | "in_transit"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "cancelled"
      payment_type: "donation_fee" | "premium_subscription" | "processing_fee"
      user_role: "donor" | "ngo" | "delivery"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      delivery_status: ["available", "assigned", "in_progress", "completed"],
      donation_status: [
        "pending",
        "claimed",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "completed", "failed", "cancelled"],
      payment_type: ["donation_fee", "premium_subscription", "processing_fee"],
      user_role: ["donor", "ngo", "delivery"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
