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
          created_at: string
          emotion_eval: Json | null
          id: string
          interview_summary: Json | null
          text_eval: Json | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          emotion_eval?: Json | null
          id?: string
          interview_summary?: Json | null
          text_eval?: Json | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          emotion_eval?: Json | null
          id?: string
          interview_summary?: Json | null
          text_eval?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "AI_summary_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          id: string
          merge_applicant_id: string | null
        }
        Insert: {
          id?: string
          merge_applicant_id?: string | null
        }
        Update: {
          id?: string
          merge_applicant_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          AI_summary: string | null
          applicant_id: string
          created_at: string
          id: string
          job_id: string
        }
        Insert: {
          AI_summary?: string | null
          applicant_id: string
          created_at?: string
          id?: string
          job_id: string
        }
        Update: {
          AI_summary?: string | null
          applicant_id?: string
          created_at?: string
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_AI_summary_fkey"
            columns: ["AI_summary"]
            isOneToOne: false
            referencedRelation: "AI_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
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
          icon: string | null
          id: number
          name: string | null
          prompt: string | null
          role: string | null
          voice_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name?: string | null
          prompt?: string | null
          role?: string | null
          voice_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name?: string | null
          prompt?: string | null
          role?: string | null
          voice_id?: string | null
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
          description: string | null
          email_extension: string | null
          id: string
          industry: string | null
          location: string | null
          merge_account_token: string | null
          name: string
          payment_method: string | null
          subscription_id: string | null
          website_url: string | null
        }
        Insert: {
          billing_address?: string | null
          company_context?: string | null
          description?: string | null
          email_extension?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          merge_account_token?: string | null
          name: string
          payment_method?: string | null
          subscription_id?: string | null
          website_url?: string | null
        }
        Update: {
          billing_address?: string | null
          company_context?: string | null
          description?: string | null
          email_extension?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          merge_account_token?: string | null
          name?: string
          payment_method?: string | null
          subscription_id?: string | null
          website_url?: string | null
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
          min_qual: Json[] | null
          preferred_qual: Json[] | null
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
          min_qual?: Json[] | null
          preferred_qual?: Json[] | null
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
          min_qual?: Json[] | null
          preferred_qual?: Json[] | null
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
          id: string
          merge_id: string
        }
        Insert: {
          company_id?: string | null
          id?: string
          merge_id: string
        }
        Update: {
          company_id?: string | null
          id?: string
          merge_id?: string
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
          avatar_url: string | null
          billing_address: Json | null
          company_id: string | null
          harvest_recruiters: number | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          company_id?: string | null
          harvest_recruiters?: number | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          company_id?: string | null
          harvest_recruiters?: number | null
          id?: string
          payment_method?: Json | null
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
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
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

