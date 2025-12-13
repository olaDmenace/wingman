/**
 * Database Helper Functions
 *
 * Common database operations for the Wingman application.
 */

import { supabaseAdmin } from './supabase';
import type { Database } from './database.types';

// Workaround for TypeScript strict mode with Supabase types
const db = supabaseAdmin as any;

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type FlightSearch = Tables['flight_searches']['Row'];
type PriceAlert = Tables['price_alerts']['Row'];
type Conversation = Tables['conversations']['Row'];

// ========================================
// User Operations
// ========================================

/**
 * Get or create a user by email
 */
export async function getOrCreateUser(email: string): Promise<User | null> {
  try {
    // Try to find existing user
    const { data: existingUser, error: findError } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user if not found
    const { data: newUser, error: createError } = await db
      .from('users')
      .insert({ email })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return null;
    }

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
}

// ========================================
// Flight Search Operations
// ========================================

/**
 * Save a flight search
 */
export async function saveFlightSearch(
  searchParams: {
    userId?: string | null;
    origin: string;
    destination: string;
    departureDate?: string | null;
    departureDateRangeStart?: string | null;
    departureDateRangeEnd?: string | null;
    returnDate?: string | null;
    tripType: 'one-way' | 'round-trip';
    passengerCount?: number;
    preferences?: any;
    searchResults?: any;
  }
): Promise<FlightSearch | null> {
  try {
    const { data, error } = await db
      .from('flight_searches')
      .insert({
        user_id: searchParams.userId || null,
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate || null,
        departure_date_range_start: searchParams.departureDateRangeStart || null,
        departure_date_range_end: searchParams.departureDateRangeEnd || null,
        return_date: searchParams.returnDate || null,
        trip_type: searchParams.tripType,
        passenger_count: searchParams.passengerCount || 1,
        preferences: searchParams.preferences || null,
        search_results: searchParams.searchResults || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving flight search:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveFlightSearch:', error);
    return null;
  }
}

/**
 * Get user's flight search history
 */
export async function getUserFlightSearches(
  userId: string,
  limit: number = 10
): Promise<FlightSearch[]> {
  try {
    const { data, error } = await db
      .from('flight_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting flight searches:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserFlightSearches:', error);
    return [];
  }
}

// ========================================
// Price Alert Operations
// ========================================

/**
 * Create a price alert
 */
export async function createPriceAlert(
  alertData: {
    userId?: string | null;
    origin: string;
    destination: string;
    departureDateRangeStart: string;
    departureDateRangeEnd: string;
    returnDateRangeStart?: string | null;
    returnDateRangeEnd?: string | null;
    tripType: 'one-way' | 'round-trip';
    lastKnownPrice?: number | null;
    thresholdPrice?: number | null;
    notificationEmail: string;
  }
): Promise<PriceAlert | null> {
  try {
    const { data, error } = await db
      .from('price_alerts')
      .insert({
        user_id: alertData.userId || null,
        origin: alertData.origin,
        destination: alertData.destination,
        departure_date_range_start: alertData.departureDateRangeStart,
        departure_date_range_end: alertData.departureDateRangeEnd,
        return_date_range_start: alertData.returnDateRangeStart || null,
        return_date_range_end: alertData.returnDateRangeEnd || null,
        trip_type: alertData.tripType,
        last_known_price: alertData.lastKnownPrice || null,
        threshold_price: alertData.thresholdPrice || null,
        notification_email: alertData.notificationEmail,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating price alert:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createPriceAlert:', error);
    return null;
  }
}

/**
 * Get active price alerts
 */
export async function getActivePriceAlerts(): Promise<PriceAlert[]> {
  try {
    const { data, error } = await db
      .from('price_alerts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActivePriceAlerts:', error);
    return [];
  }
}

/**
 * Get user's price alerts
 */
export async function getUserPriceAlerts(
  userId: string,
  activeOnly: boolean = true
): Promise<PriceAlert[]> {
  try {
    let query = db
      .from('price_alerts')
      .select('*')
      .eq('user_id', userId);

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserPriceAlerts:', error);
    return [];
  }
}

/**
 * Update price alert
 */
export async function updatePriceAlert(
  alertId: string,
  updates: {
    lastKnownPrice?: number;
    lastCheckedAt?: string;
    active?: boolean;
  }
): Promise<boolean> {
  try {
    const { error } = await db
      .from('price_alerts')
      .update({
        last_known_price: updates.lastKnownPrice,
        last_checked_at: updates.lastCheckedAt,
        active: updates.active,
      })
      .eq('id', alertId);

    if (error) {
      console.error('Error updating price alert:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePriceAlert:', error);
    return false;
  }
}

/**
 * Deactivate price alert
 */
export async function deactivatePriceAlert(alertId: string): Promise<boolean> {
  return updatePriceAlert(alertId, { active: false });
}

// ========================================
// Conversation Operations
// ========================================

/**
 * Save or update conversation
 */
export async function saveConversation(
  conversationData: {
    conversationId?: string;
    userId?: string | null;
    messages: any;
    context?: any;
  }
): Promise<Conversation | null> {
  try {
    if (conversationData.conversationId) {
      // Update existing conversation
      const { data, error } = await db
        .from('conversations')
        .update({
          messages: conversationData.messages,
          context: conversationData.context || null,
        })
        .eq('id', conversationData.conversationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating conversation:', error);
        return null;
      }

      return data;
    } else {
      // Create new conversation
      const { data, error } = await db
        .from('conversations')
        .insert({
          user_id: conversationData.userId || null,
          messages: conversationData.messages,
          context: conversationData.context || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error('Error in saveConversation:', error);
    return null;
  }
}

/**
 * Get conversation by ID
 */
export async function getConversation(
  conversationId: string
): Promise<Conversation | null> {
  try {
    const { data, error } = await db
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error getting conversation:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getConversation:', error);
    return null;
  }
}

/**
 * Get user's conversations
 */
export async function getUserConversations(
  userId: string,
  limit: number = 20
): Promise<Conversation[]> {
  try {
    const { data, error } = await db
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting conversations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return [];
  }
}

// ========================================
// Analytics Operations
// ========================================

/**
 * Track outbound click
 */
export async function trackOutboundClick(
  clickData: {
    userId?: string | null;
    flightSearchId?: string | null;
    bookingUrl: string;
  }
): Promise<boolean> {
  try {
    const { error } = await db
      .from('outbound_clicks')
      .insert({
        user_id: clickData.userId || null,
        flight_search_id: clickData.flightSearchId || null,
        booking_url: clickData.bookingUrl,
      });

    if (error) {
      console.error('Error tracking click:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in trackOutboundClick:', error);
    return false;
  }
}

/**
 * Get analytics for user clicks
 */
export async function getUserClickAnalytics(userId: string) {
  try {
    const { data, error } = await db
      .from('outbound_clicks')
      .select('*')
      .eq('user_id', userId)
      .order('clicked_at', { ascending: false });

    if (error) {
      console.error('Error getting click analytics:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserClickAnalytics:', error);
    return [];
  }
}
