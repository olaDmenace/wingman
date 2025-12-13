import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { flightId, messages, email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Please provide your email address to receive price alerts.' },
        { status: 400 }
      );
    }

    // Extract flight details from messages
    // In a real implementation, we'd look up the flight by ID
    const lastMessage = messages[messages.length - 2]; // Get the assistant's last message
    const flightResults = lastMessage?.flightResults;

    if (!flightResults) {
      return NextResponse.json(
        { message: "I couldn't find the flight details. Please search for flights first." },
        { status: 400 }
      );
    }

    const flight = flightResults.flights.find((f: any) => f.id === flightId);

    if (!flight) {
      return NextResponse.json(
        { message: "I couldn't find that specific flight." },
        { status: 404 }
      );
    }

    // Create or get user
    let userId: string | null = null;
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({ email })
        .select('id')
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        return NextResponse.json(
          { message: 'Failed to create user account for alerts.' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Create price alert
    const alertData = {
      user_id: userId,
      origin: flightResults.searchParams.origin,
      destination: flightResults.searchParams.destination,
      departure_date_range_start: flightResults.searchParams.departureDateRangeStart || flightResults.searchParams.departureDate,
      departure_date_range_end: flightResults.searchParams.departureDateRangeEnd || flightResults.searchParams.departureDate,
      return_date_range_start: flightResults.searchParams.returnDateRangeStart || flightResults.searchParams.returnDate,
      return_date_range_end: flightResults.searchParams.returnDateRangeEnd || flightResults.searchParams.returnDate,
      trip_type: flightResults.searchParams.tripType,
      last_known_price: flight.price,
      notification_email: email,
      active: true,
    };

    const { error: alertError } = await supabaseAdmin
      .from('price_alerts')
      .insert(alertData);

    if (alertError) {
      console.error('Error creating alert:', alertError);
      return NextResponse.json(
        { message: 'Failed to create price alert.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Perfect! I've set up a price alert for flights from ${flightResults.searchParams.origin} to ${flightResults.searchParams.destination}. I'll email you at ${email} when there are price changes. The current price is ${flight.currency}${flight.price}.`,
    });
  } catch (error) {
    console.error('Error in alerts API:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the price alert' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get user's active alerts
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      return NextResponse.json({ alerts: [] });
    }

    const { data: alerts, error } = await supabaseAdmin
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error in alerts GET API:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching alerts' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('price_alerts')
      .update({ active: false })
      .eq('id', alertId);

    if (error) {
      console.error('Error deactivating alert:', error);
      return NextResponse.json(
        { error: 'Failed to cancel alert' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Price alert has been cancelled successfully.',
    });
  } catch (error) {
    console.error('Error in alerts DELETE API:', error);
    return NextResponse.json(
      { error: 'An error occurred while cancelling the alert' },
      { status: 500 }
    );
  }
}
