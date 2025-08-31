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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_event: {
        Row: {
          action: string
          actor_id: string | null
          entity: string
          entity_id: string | null
          hash: string | null
          id: string
          ip: unknown | null
          org_id: string
          ts: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          entity: string
          entity_id?: string | null
          hash?: string | null
          id?: string
          ip?: unknown | null
          org_id: string
          ts?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          entity?: string
          entity_id?: string | null
          hash?: string | null
          id?: string
          ip?: unknown | null
          org_id?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_event_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_item: {
        Row: {
          clause_section: string | null
          confidence: number | null
          constraint_id: string | null
          created_at: string
          id: string
          quote: string | null
          rationale: string | null
          result: string
          submission_id: string
        }
        Insert: {
          clause_section?: string | null
          confidence?: number | null
          constraint_id?: string | null
          created_at?: string
          id?: string
          quote?: string | null
          rationale?: string | null
          result: string
          submission_id: string
        }
        Update: {
          clause_section?: string | null
          confidence?: number | null
          constraint_id?: string | null
          created_at?: string
          id?: string
          quote?: string | null
          rationale?: string | null
          result?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_constraint_id_fkey"
            columns: ["constraint_id"]
            isOneToOne: false
            referencedRelation: "constraint_rule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_item_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submission"
            referencedColumns: ["id"]
          },
        ]
      }
      community: {
        Row: {
          created_at: string
          id: string
          meeting_mode: string | null
          name: string
          org_id: string
          sla_days: number | null
          state: string
          timezone: string
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_mode?: string | null
          name: string
          org_id: string
          sla_days?: number | null
          state: string
          timezone: string
        }
        Update: {
          created_at?: string
          id?: string
          meeting_mode?: string | null
          name?: string
          org_id?: string
          sla_days?: number | null
          state?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      constraint_rule: {
        Row: {
          confidence: number | null
          document_id: string
          id: string
          page: number | null
          project_type: string
          section_label: string | null
          span_end: number | null
          span_start: number | null
          text: string
        }
        Insert: {
          confidence?: number | null
          document_id: string
          id?: string
          page?: number | null
          project_type: string
          section_label?: string | null
          span_end?: number | null
          span_start?: number | null
          text: string
        }
        Update: {
          confidence?: number | null
          document_id?: string
          id?: string
          page?: number | null
          project_type?: string
          section_label?: string | null
          span_end?: number | null
          span_start?: number | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "constraint_rule_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "governing_document"
            referencedColumns: ["id"]
          },
        ]
      }
      governing_document: {
        Row: {
          community_id: string
          created_at: string
          file_hash: string
          file_url: string
          id: string
          is_scanned: boolean | null
          ocr_status: string | null
          org_id: string
          text_bytes: number | null
        }
        Insert: {
          community_id: string
          created_at?: string
          file_hash: string
          file_url: string
          id?: string
          is_scanned?: boolean | null
          ocr_status?: string | null
          org_id: string
          text_bytes?: number | null
        }
        Update: {
          community_id?: string
          created_at?: string
          file_hash?: string
          file_url?: string
          id?: string
          is_scanned?: boolean | null
          ocr_status?: string | null
          org_id?: string
          text_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "governing_document_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governing_document_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      letter: {
        Row: {
          content: string | null
          created_at: string
          file_url: string | null
          id: string
          status: string
          submission_id: string
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          status?: string
          submission_id: string
          type: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          status?: string
          submission_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "letter_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submission"
            referencedColumns: ["id"]
          },
        ]
      }
      org: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      org_member: {
        Row: {
          created_at: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_member_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_subscription: {
        Row: {
          created_at: string
          monthly_reset_day: number
          org_id: string
          overage_rate: number
          plan: string
          submissions_included: number
        }
        Insert: {
          created_at?: string
          monthly_reset_day?: number
          org_id: string
          overage_rate: number
          plan: string
          submissions_included: number
        }
        Update: {
          created_at?: string
          monthly_reset_day?: number
          org_id?: string
          overage_rate?: number
          plan?: string
          submissions_included?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_subscription_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      render_cache: {
        Row: {
          content_hash: string
          created_at: string
          file_url: string
          id: string
          submission_id: string
          type: string
        }
        Insert: {
          content_hash: string
          created_at?: string
          file_url: string
          id?: string
          submission_id: string
          type: string
        }
        Update: {
          content_hash?: string
          created_at?: string
          file_url?: string
          id?: string
          submission_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "render_cache_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submission"
            referencedColumns: ["id"]
          },
        ]
      }
      submission: {
        Row: {
          community_id: string
          created_at: string
          fields_json: Json
          id: string
          org_id: string
          project_type: string
          property_json: Json
          status: string
          submitted_by: string | null
        }
        Insert: {
          community_id: string
          created_at?: string
          fields_json?: Json
          id?: string
          org_id: string
          project_type: string
          property_json?: Json
          status?: string
          submitted_by?: string | null
        }
        Update: {
          community_id?: string
          created_at?: string
          fields_json?: Json
          id?: string
          org_id?: string
          project_type?: string
          property_json?: Json
          status?: string
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_counter: {
        Row: {
          month_key: string
          org_id: string
          submissions_count: number
        }
        Insert: {
          month_key: string
          org_id: string
          submissions_count?: number
        }
        Update: {
          month_key?: string
          org_id?: string
          submissions_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_counter_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      vote: {
        Row: {
          choice: string
          created_at: string
          id: string
          rationale: string | null
          submission_id: string
          voter_id: string
        }
        Insert: {
          choice: string
          created_at?: string
          id?: string
          rationale?: string | null
          submission_id: string
          voter_id: string
        }
        Update: {
          choice?: string
          created_at?: string
          id?: string
          rationale?: string | null
          submission_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vote_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submission"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_org_with_member: {
        Args: { org_name: string }
        Returns: string
      }
      create_organization_with_member: {
        Args: { org_name: string }
        Returns: string
      }
      increment_usage: {
        Args: { p_month: string; p_org: string }
        Returns: undefined
      }
      is_org_member: {
        Args: { target_org: string }
        Returns: boolean
      }
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
    Enums: {},
  },
} as const
