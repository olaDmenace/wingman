import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Workaround for TypeScript strict mode with Supabase types
const db = supabaseAdmin as any;

export async function POST(request: NextRequest) {
  try {
    const { flightId, bookingUrl, userId } = await request.json();

    if (!bookingUrl) {
      return NextResponse.json(
        { error: 'Booking URL is required' },
        { status: 400 }
      );
    }

    // Track the outbound click
    const { error } = await db
      .from('outbound_clicks')
      .insert({
        user_id: userId || null,
        booking_url: bookingUrl,
      });

    if (error) {
      console.error('Error tracking click:', error);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in clicks API:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
