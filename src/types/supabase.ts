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
      chat_feedback: {
        Row: {
          created_at: string
          id: string
          message_id: string
          rating: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          rating: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          rating?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender: string
          session_id: string
          structured_data: Json | null
          suggestions: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender: string
          session_id: string
          structured_data?: Json | null
          suggestions?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender?: string
          session_id?: string
          structured_data?: Json | null
          suggestions?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_base: {
        Row: {
          category: string | null
          content: string
          created_at: string
          embedding: string | null
          id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_basics: Json | null
          created_at: string
          id: string
          project_details: Json | null
          source_page: string | null
          timeline_budget: Json | null
          updated_at: string
          lead_score: number | null
        }
        Insert: {
          business_basics?: Json | null
          created_at?: string
          id?: string
          project_details?: Json | null
          source_page?: string | null
          timeline_budget?: Json | null
          updated_at?: string
          lead_score?: number | null
        }
        Update: {
          business_basics?: Json | null
          created_at?: string
          id?: string
          project_details?: Json | null
          source_page?: string | null
          timeline_budget?: Json | null
          updated_at?: string
          lead_score?: number | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          is_published: boolean
          page_name: string
          updated_at: string
          version: number
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          is_published?: boolean
          page_name: string
          updated_at?: string
          version?: number
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          is_published?: boolean
          page_name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          challenge: string
          client_review: Json | null
          created_at: string
          description: string
          id: string
          image: string
          industry: string
          is_published: boolean
          project_size: string
          results: Json
          service_type: string
          solution: string
          tech_stack: Json
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          challenge: string
          client_review?: Json | null
          created_at?: string
          description: string
          id?: string
          image: string
          industry: string
          is_published?: boolean
          project_size: string
          results: Json
          service_type: string
          solution: string
          tech_stack: Json
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          challenge?: string
          client_review?: Json | null
          created_at?: string
          description?: string
          id?: string
          image?: string
          industry?: string
          is_published?: boolean
          project_size?: string
          results?: Json
          service_type?: string
          solution?: string
          tech_stack?: Json
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: string
          created_at: string
          description: string
          features: Json
          icon: string
          id: string
          link: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits: string
          created_at?: string
          description: string
          features: Json
          icon: string
          id?: string
          link: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string
          created_at?: string
          description?: string
          features?: Json
          icon?: string
          id?: string
          link?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          created_at: string
          id: string
          image: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          id?: string
          image: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          image?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          company: string
          content: string
          created_at: string
          id: string
          image: string | null
          name: string
          page_id: string | null
          rating: number
          role: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          company: string
          content: string
          created_at?: string
          id?: string
          image?: string | null
          name: string
          page_id?: string | null
          rating: number
          role: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          company?: string
          content?: string
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          page_id?: string | null
          rating?: number
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
