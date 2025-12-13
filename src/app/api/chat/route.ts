import { NextRequest, NextResponse } from 'next/server';
import { extractFlightIntent, generateResponse } from '@/lib/ai';
import { searchFlights } from '@/lib/flight-api';
import { ConversationContext, Message, FlightSearchParams } from '@/types';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { messages, userId, conversationId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Build conversation context
    const context: ConversationContext = {
      currentSearch: {},
      extractedEntities: {},
    };

    // Extract intent and entities from the conversation
    const intent = await extractFlightIntent(messages, context);

    // Handle different intents
    if (intent.intent === 'clarification_needed') {
      return NextResponse.json({
        message: intent.clarificationQuestion || "Could you please provide more details about your trip?",
        intent: intent.intent,
      });
    }

    if (intent.intent === 'search_flight') {
      // Check if we have enough information to search
      const missingFields = [];
      if (!intent.origin) missingFields.push('origin city');
      if (!intent.destination) missingFields.push('destination city');
      if (!intent.departureDate && !intent.departureDateRangeStart) {
        missingFields.push('departure date');
      }

      if (missingFields.length > 0) {
        return NextResponse.json({
          message: `I need a few more details. Could you tell me the ${missingFields.join(', ')}?`,
          intent: 'clarification_needed',
        });
      }

      // Build search parameters
      const searchParams: FlightSearchParams = {
        origin: intent.origin!,
        destination: intent.destination!,
        departureDate: intent.departureDate,
        departureDateRangeStart: intent.departureDateRangeStart,
        departureDateRangeEnd: intent.departureDateRangeEnd,
        returnDate: intent.returnDate,
        passengerCount: intent.passengerCount || 1,
        tripType: intent.tripType || 'round-trip',
        preferences: intent.preferences,
      };

      // Search for flights
      const flightResults = await searchFlights(searchParams);

      // Save flight search to database
      try {
        await supabaseAdmin
          .from('flight_searches')
          .insert({
            user_id: userId || null,
            origin: searchParams.origin,
            destination: searchParams.destination,
            departure_date: searchParams.departureDate || null,
            departure_date_range_start: searchParams.departureDateRangeStart || null,
            departure_date_range_end: searchParams.departureDateRangeEnd || null,
            return_date: searchParams.returnDate || null,
            trip_type: searchParams.tripType,
            passenger_count: searchParams.passengerCount,
            preferences: searchParams.preferences || null,
            search_results: flightResults as any,
          });
      } catch (dbError) {
        console.error('Error saving flight search:', dbError);
        // Continue even if database save fails
      }

      // Generate response
      const responseMessage = await generateResponse(intent, context, flightResults);

      return NextResponse.json({
        message: responseMessage,
        flightResults,
        intent: intent.intent,
      });
    }

    if (intent.intent === 'set_alert') {
      return NextResponse.json({
        message: "To set up a price alert, I'll need your email address. What email should I use for notifications?",
        intent: intent.intent,
      });
    }

    // Default response for general questions
    const defaultResponse = {
      message: "I'm here to help you find flights and set up price alerts. Where would you like to travel?",
      intent: 'general_question',
    };

    // Save conversation to database
    try {
      if (conversationId) {
        // Update existing conversation
        await supabaseAdmin
          .from('conversations')
          .update({
            messages: messages,
            context: context as any,
          })
          .eq('id', conversationId);
      } else {
        // Create new conversation
        await supabaseAdmin
          .from('conversations')
          .insert({
            user_id: userId || null,
            messages: messages,
            context: context as any,
          });
      }
    } catch (dbError) {
      console.error('Error saving conversation:', dbError);
      // Continue even if database save fails
    }

    return NextResponse.json(defaultResponse);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
