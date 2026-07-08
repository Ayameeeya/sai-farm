/**
 * Supabase スキーマから自動生成された型定義。
 * 再生成: Supabase MCP の generate_typescript_types、
 * または `supabase gen types typescript --project-id xxlanegqftfcqvqrkrlw`
 */
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
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      article_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: Json | null
          created_at: string | null
          featured_photo_url: string | null
          id: string
          meta_description: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: Json | null
          created_at?: string | null
          featured_photo_url?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: Json | null
          created_at?: string | null
          featured_photo_url?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_profile: {
        Row: {
          address: string | null
          capital: string | null
          community: string | null
          email: string | null
          established_on: string | null
          fax: string | null
          holidays: string | null
          id: string
          license: string | null
          name: string | null
          representative_name: string | null
          tel: string | null
          transportation: string | null
          updated_at: string | null
          working_hour: string | null
        }
        Insert: {
          address?: string | null
          capital?: string | null
          community?: string | null
          email?: string | null
          established_on?: string | null
          fax?: string | null
          holidays?: string | null
          id?: string
          license?: string | null
          name?: string | null
          representative_name?: string | null
          tel?: string | null
          transportation?: string | null
          updated_at?: string | null
          working_hour?: string | null
        }
        Update: {
          address?: string | null
          capital?: string | null
          community?: string | null
          email?: string | null
          established_on?: string | null
          fax?: string | null
          holidays?: string | null
          id?: string
          license?: string | null
          name?: string | null
          representative_name?: string | null
          tel?: string | null
          transportation?: string | null
          updated_at?: string | null
          working_hour?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string | null
          description: string | null
          facility_type_id: string | null
          id: string
          image_url: string | null
          lat: number
          lng: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          facility_type_id?: string | null
          id?: string
          image_url?: string | null
          lat: number
          lng: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          facility_type_id?: string | null
          id?: string
          image_url?: string | null
          lat?: number
          lng?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilities_facility_type_id_fkey"
            columns: ["facility_type_id"]
            isOneToOne: false
            referencedRelation: "facility_types"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          created_at: string | null
          id: string
          tag_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "news_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      news_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          area_id: string | null
          bathroom: number | null
          bedroom: number | null
          building_space_sqm: number | null
          comment: string | null
          created_at: string | null
          details: Json
          id: string
          land_space_sqm: number | null
          lat: number | null
          layout: string | null
          lng: number | null
          one_point: string | null
          price: number | null
          property_category_id: string | null
          property_name: string
          slug: string
          status: number
          transportation: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          area_id?: string | null
          bathroom?: number | null
          bedroom?: number | null
          building_space_sqm?: number | null
          comment?: string | null
          created_at?: string | null
          details?: Json
          id?: string
          land_space_sqm?: number | null
          lat?: number | null
          layout?: string | null
          lng?: number | null
          one_point?: string | null
          price?: number | null
          property_category_id?: string | null
          property_name: string
          slug: string
          status?: number
          transportation?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          area_id?: string | null
          bathroom?: number | null
          bedroom?: number | null
          building_space_sqm?: number | null
          comment?: string | null
          created_at?: string | null
          details?: Json
          id?: string
          land_space_sqm?: number | null
          lat?: number | null
          layout?: string | null
          lng?: number | null
          one_point?: string | null
          price?: number | null
          property_category_id?: string | null
          property_name?: string
          slug?: string
          status?: number
          transportation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_category_id_fkey"
            columns: ["property_category_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      property_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      property_facilities: {
        Row: {
          facility_id: string
          property_id: string
        }
        Insert: {
          facility_id: string
          property_id: string
        }
        Update: {
          facility_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_facilities_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_facilities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          property_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          property_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          property_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_tags: {
        Row: {
          property_id: string
          tag_id: string
        }
        Insert: {
          property_id: string
          tag_id: string
        }
        Update: {
          property_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_tags_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          featured_photo_url: string | null
          id: string
          meta_description: string | null
          name: string
          published: boolean | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured_photo_url?: string | null
          id?: string
          meta_description?: string | null
          name: string
          published?: boolean | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          featured_photo_url?: string | null
          id?: string
          meta_description?: string | null
          name?: string
          published?: boolean | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
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
