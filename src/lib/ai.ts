import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { ConversationContext, FlightSearchParams, Message } from '@/types';

const FlightSearchSchema = z.object({
  intent: z.enum(['search_flight', 'set_alert', 'show_cheaper', 'general_question', 'clarification_needed']),
  origin: z.string().optional().nullable().describe('Origin city or airport code'),
  destination: z.string().optional().nullable().describe('Destination city or airport code'),
  departureDate: z.string().optional().nullable().describe('Specific departure date in YYYY-MM-DD format'),
  departureDateRangeStart: z.string().optional().nullable().describe('Start of departure date range in YYYY-MM-DD format'),
  departureDateRangeEnd: z.string().optional().nullable().describe('End of departure date range in YYYY-MM-DD format'),
  returnDate: z.string().optional().nullable().describe('Return date in YYYY-MM-DD format for round-trip'),
  tripType: z.enum(['one-way', 'round-trip']).optional().nullable(),
  passengerCount: z.number().optional().default(1).describe('Number of passengers'),
  preferences: z.object({
    cheapest: z.boolean().optional().default(false),
    fastest: z.boolean().optional().default(false),
    flexibleDates: z.boolean().optional().default(false),
    maxStops: z.number().optional().nullable(),
  }).optional().default({}),
  missingInfo: z.array(z.string()).optional().default([]).describe('List of missing required information'),
  clarificationQuestion: z.string().optional().nullable().describe('Question to ask user if clarification is needed'),
});

export async function extractFlightIntent(
  messages: Message[],
  context: ConversationContext
): Promise<z.infer<typeof FlightSearchSchema>> {
  const conversationHistory = messages
    .slice(-5)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const systemPrompt = `You are a flight search assistant. Extract flight search parameters from the user's message and return them as a JSON object.

Current context: ${JSON.stringify(context)}

Return a JSON object with these fields:
{
  "intent": "search_flight" | "set_alert" | "show_cheaper" | "general_question" | "clarification_needed",
  "origin": string or null,
  "destination": string or null,
  "departureDate": "YYYY-MM-DD" or null,
  "departureDateRangeStart": "YYYY-MM-DD" or null,
  "departureDateRangeEnd": "YYYY-MM-DD" or null,
  "returnDate": "YYYY-MM-DD" or null,
  "tripType": "one-way" or "round-trip" or null,
  "passengerCount": number (default 1),
  "preferences": {
    "cheapest": boolean (default false),
    "fastest": boolean (default false),
    "flexibleDates": boolean (default false),
    "maxStops": number or null
  },
  "missingInfo": array of strings (what info is missing),
  "clarificationQuestion": string or null (question to ask if intent is clarification_needed)
}

Rules:
- If the user mentions "cheapest", set preferences.cheapest to true
- If the user mentions "fastest" or "quickest", set preferences.fastest to true
- If the user mentions "flexible dates" or a month without specific dates, set flexibleDates to true and use date ranges
- Default tripType is 'round-trip' unless user explicitly says "one-way"
- If critical information is missing (origin, destination, or dates), set intent to 'clarification_needed'
- Extract city names and normalize them (e.g., "NYC" -> "New York", "LA" -> "Los Angeles")

Return ONLY valid JSON, no markdown formatting, no explanation.`;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nJSON:`,
      maxTokens: 500,
    });

    // Clean up the response - remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    // Parse and validate
    const parsed = JSON.parse(jsonText);
    const validated = FlightSearchSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error('Error extracting intent:', error);
    // Return a safe default
    return {
      intent: 'clarification_needed',
      origin: null,
      destination: null,
      departureDate: null,
      departureDateRangeStart: null,
      departureDateRangeEnd: null,
      returnDate: null,
      tripType: null,
      passengerCount: 1,
      preferences: {
        cheapest: false,
        fastest: false,
        flexibleDates: false,
        maxStops: null,
      },
      missingInfo: ['origin', 'destination', 'departure date'],
      clarificationQuestion: "I'd love to help you find flights! Could you tell me where you're flying from and where you'd like to go?",
    };
  }
}

export async function generateResponse(
  intent: z.infer<typeof FlightSearchSchema>,
  context: ConversationContext,
  flightResults?: any
): Promise<string> {
  if (intent.intent === 'clarification_needed' && intent.clarificationQuestion) {
    return intent.clarificationQuestion;
  }

  if (intent.intent === 'search_flight' && flightResults) {
    const flightCount = flightResults.flights.length;
    const cheapest = flightResults.flights[0];

    let response = `I found ${flightCount} flight options from ${intent.origin} to ${intent.destination}. `;

    if (intent.preferences?.cheapest) {
      response += `The cheapest option is ${cheapest.airline} at ${cheapest.currency}${cheapest.price}. `;
    }

    response += `Here are the top options for you. Would you like to set a price alert for any of these flights?`;

    return response;
  }

  if (intent.intent === 'set_alert') {
    return "I'll set up a price alert for this flight. What email address would you like me to send notifications to?";
  }

  return "I'm here to help you find flights! Where would you like to go?";
}

export async function generateConversationalResponse(
  messages: Message[],
  context: ConversationContext
): Promise<string> {
  const conversationHistory = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const systemPrompt = `You are a friendly and helpful flight search assistant.
Be conversational, concise, and helpful. Keep responses short and to the point.
Current context: ${JSON.stringify(context)}`;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nassistant:`,
      maxTokens: 150,
    });

    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm here to help you find flights! Where would you like to go?";
  }
}
