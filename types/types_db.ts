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
      AI_summary: {
        Row: {
          application_id: string | null
          batch_processor_transcript_id: string | null
          created_at: string
          culture_fit: Json | null
          emotion_eval: Json | null
          id: string
          overall_summary: Json | null
          recording_id: string | null
          resume_analysis: Json | null
          room_name: string | null
          text_eval: Json | null
          transcript_summary: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          batch_processor_transcript_id?: string | null
          created_at?: string
          culture_fit?: Json | null
          emotion_eval?: Json | null
          id?: string
          overall_summary?: Json | null
          recording_id?: string | null
          resume_analysis?: Json | null
          room_name?: string | null
          text_eval?: Json | null
          transcript_summary?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          batch_processor_transcript_id?: string | null
          created_at?: string
          culture_fit?: Json | null
          emotion_eval?: Json | null
          id?: string
          overall_summary?: Json | null
          recording_id?: string | null
          resume_analysis?: Json | null
          room_name?: string | null
          text_eval?: Json | null
          transcript_summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "AI_summary_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          merge_candidate_id: string[] | null
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id?: string
          merge_candidate_id?: string[] | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          merge_candidate_id?: string[] | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          applicant_id: string | null
          created_at: string
          id: string
          job_id: string
          merge_application_id: string | null
          status: Database["public"]["Enums"]["application_status"] | null
        }
        Insert: {
          applicant_id?: string | null
          created_at?: string
          id?: string
          job_id: string
          merge_application_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Update: {
          applicant_id?: string | null
          created_at?: string
          id?: string
          job_id?: string
          merge_application_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["merge_id"]
          },
        ]
      }
      bots: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          emotion: Json | null
          icon: string | null
          id: number
          name: string | null
          prompt: string | null
          role: string | null
          voice: Json | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          emotion?: Json | null
          icon?: string | null
          id?: number
          name?: string | null
          prompt?: string | null
          role?: string | null
          voice?: Json | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          emotion?: Json | null
          icon?: string | null
          id?: number
          name?: string | null
          prompt?: string | null
          role?: string | null
          voice?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          billing_address: string | null
          company_context: string | null
          Configured: boolean
          description: string | null
          id: string
          industry: string | null
          location: string | null
          merge_account_token: string | null
          merge_linked_account_id: string | null
          name: string
          payment_method: string | null
          provider_id: string | null
          subscription_id: string | null
        }
        Insert: {
          billing_address?: string | null
          company_context?: string | null
          Configured?: boolean
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          merge_account_token?: string | null
          merge_linked_account_id?: string | null
          name: string
          payment_method?: string | null
          provider_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          billing_address?: string | null
          company_context?: string | null
          Configured?: boolean
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          merge_account_token?: string | null
          merge_linked_account_id?: string | null
          name?: string
          payment_method?: string | null
          provider_id?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_company_context_fkey"
            columns: ["company_context"]
            isOneToOne: false
            referencedRelation: "company_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      company_context: {
        Row: {
          created_at: string
          culture: string | null
          customers: string | null
          description: string | null
          goals: string | null
          history: string | null
          id: string
          products: string | null
        }
        Insert: {
          created_at?: string
          culture?: string | null
          customers?: string | null
          description?: string | null
          goals?: string | null
          history?: string | null
          id?: string
          products?: string | null
        }
        Update: {
          created_at?: string
          culture?: string | null
          customers?: string | null
          description?: string | null
          goals?: string | null
          history?: string | null
          id?: string
          products?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_context_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      form_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: number
          message: string | null
          name: string | null
          role: string | null
          subject: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          role?: string | null
          subject?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          role?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      job_interview_config: {
        Row: {
          bot_id: number | null
          company_context: string | null
          created_at: string
          duration: number | null
          hiring_manager_notes: string | null
          interview_name: string | null
          interview_questions: Json | null
          job_id: string
          prompt_graph: Json | null
          type: string | null
        }
        Insert: {
          bot_id?: number | null
          company_context?: string | null
          created_at?: string
          duration?: number | null
          hiring_manager_notes?: string | null
          interview_name?: string | null
          interview_questions?: Json | null
          job_id?: string
          prompt_graph?: Json | null
          type?: string | null
        }
        Update: {
          bot_id?: number | null
          company_context?: string | null
          created_at?: string
          duration?: number | null
          hiring_manager_notes?: string | null
          interview_name?: string | null
          interview_questions?: Json | null
          job_id?: string
          prompt_graph?: Json | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_interview_config_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_interview_config_company_context_fkey"
            columns: ["company_context"]
            isOneToOne: false
            referencedRelation: "company_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_interview_config_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["merge_id"]
          },
          {
            foreignKeyName: "job_interview_config_job_id_fkey1"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["merge_id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          job_resume_config: Json | null
          merge_id: string
          name: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          job_resume_config?: Json | null
          merge_id: string
          name?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          job_resume_config?: Json | null
          merge_id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      recruiters: {
        Row: {
          company_id: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["recruiter_role"] | null
          status: Database["public"]["Enums"]["recruiter_status"] | null
        }
        Insert: {
          company_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["recruiter_role"] | null
          status?: Database["public"]["Enums"]["recruiter_status"] | null
        }
        Update: {
          company_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["recruiter_role"] | null
          status?: Database["public"]["Enums"]["recruiter_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
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
      application_status:
        | "not_invited"
        | "pending_interview"
        | "interview_completed"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      recruiter_role: "admin" | "recruiter" | "viewer"
      recruiter_status: "active" | "pending_invite" | "invite_expired"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "not_invited",
        "pending_interview",
        "interview_completed",
      ],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      recruiter_role: ["admin", "recruiter", "viewer"],
      recruiter_status: ["active", "pending_invite", "invite_expired"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
        "paused",
      ],
    },
  },
} as const

