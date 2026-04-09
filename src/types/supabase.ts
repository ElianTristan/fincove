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
      expenses: {
        Row: {
          id: string
          family_id: string
          created_by: string
          title: string
          amount: number
          category: string
          type: string
          payment_method: string
          installments: number
          current_installment: number
          due_date: string | null
          receipt_url: string | null
          notes: string | null
          is_recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          created_by: string
          title: string
          amount: number
          category: string
          type?: string
          payment_method?: string
          installments?: number
          current_installment?: number
          due_date?: string | null
          receipt_url?: string | null
          notes?: string | null
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          created_by?: string
          title?: string
          amount?: number
          category?: string
          type?: string
          payment_method?: string
          installments?: number
          current_installment?: number
          due_date?: string | null
          receipt_url?: string | null
          notes?: string | null
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      families: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      tandas: {
        Row: {
          id: string
          family_id: string
          name: string
          amount: number
          participants: number
          frequency: string
          status: string
          start_date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          amount: number
          participants: number
          frequency?: string
          status?: string
          start_date: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          amount?: number
          participants?: number
          frequency?: string
          status?: string
          start_date?: string
          created_by?: string
          created_at?: string
        }
      }
      tanda_participants: {
        Row: {
          id: string
          tanda_id: string
          user_id: string
          turn_number: number
          status: string
        }
        Insert: {
          id?: string
          tanda_id: string
          user_id: string
          turn_number: number
          status?: string
        }
        Update: {
          id?: string
          tanda_id?: string
          user_id?: string
          turn_number?: number
          status?: string
        }
      }
      vault_items: {
        Row: {
          id: string
          family_id: string
          expense_id: string | null
          uploaded_by: string
          file_name: string
          file_url: string
          file_type: string | null
          extracted_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          expense_id?: string | null
          uploaded_by: string
          file_name: string
          file_url: string
          file_type?: string | null
          extracted_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          expense_id?: string | null
          uploaded_by?: string
          file_name?: string
          file_url?: string
          file_type?: string | null
          extracted_text?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          created_at?: string
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

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Expense = Tables<'expenses'>
export type Family = Tables<'families'>
export type FamilyMember = Tables<'family_members'>
export type Tanda = Tables<'tandas'>
export type TandaParticipant = Tables<'tanda_participants'>
export type VaultItem = Tables<'vault_items'>
export type Notification = Tables<'notifications'>
