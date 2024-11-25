export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number
          title: string
          is_complete: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          title: string
          is_complete?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          is_complete?: boolean
          created_at?: string
          updated_at?: string | null
        }
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
  }
}
