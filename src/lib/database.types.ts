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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      flight_searches: {
        Row: {
          id: string
          user_id: string | null
          origin: string
          destination: string
          departure_date: string | null
          departure_date_range_start: string | null
          departure_date_range_end: string | null
          return_date: string | null
          return_date_range_start: string | null
          return_date_range_end: string | null
          passenger_count: number
          trip_type: 'one-way' | 'round-trip'
          preferences: Json | null
          search_results: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          origin: string
          destination: string
          departure_date?: string | null
          departure_date_range_start?: string | null
          departure_date_range_end?: string | null
          return_date?: string | null
          return_date_range_start?: string | null
          return_date_range_end?: string | null
          passenger_count?: number
          trip_type: 'one-way' | 'round-trip'
          preferences?: Json | null
          search_results?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          origin?: string
          destination?: string
          departure_date?: string | null
          departure_date_range_start?: string | null
          departure_date_range_end?: string | null
          return_date?: string | null
          return_date_range_start?: string | null
          return_date_range_end?: string | null
          passenger_count?: number
          trip_type?: 'one-way' | 'round-trip'
          preferences?: Json | null
          search_results?: Json | null
          created_at?: string
        }
      }
      price_alerts: {
        Row: {
          id: string
          user_id: string | null
          origin: string
          destination: string
          departure_date_range_start: string
          departure_date_range_end: string
          return_date_range_start: string | null
          return_date_range_end: string | null
          trip_type: 'one-way' | 'round-trip'
          threshold_price: number | null
          last_known_price: number | null
          last_checked_at: string | null
          active: boolean
          notification_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          origin: string
          destination: string
          departure_date_range_start: string
          departure_date_range_end: string
          return_date_range_start?: string | null
          return_date_range_end?: string | null
          trip_type: 'one-way' | 'round-trip'
          threshold_price?: number | null
          last_known_price?: number | null
          last_checked_at?: string | null
          active?: boolean
          notification_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          origin?: string
          destination?: string
          departure_date_range_start?: string
          departure_date_range_end?: string
          return_date_range_start?: string | null
          return_date_range_end?: string | null
          trip_type?: 'one-way' | 'round-trip'
          threshold_price?: number | null
          last_known_price?: number | null
          last_checked_at?: string | null
          active?: boolean
          notification_email?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string | null
          messages: Json
          context: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          messages: Json
          context?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          messages?: Json
          context?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      outbound_clicks: {
        Row: {
          id: string
          user_id: string | null
          flight_search_id: string | null
          booking_url: string
          clicked_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          flight_search_id?: string | null
          booking_url: string
          clicked_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          flight_search_id?: string | null
          booking_url?: string
          clicked_at?: string
        }
      }
    }
  }
}
