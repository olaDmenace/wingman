// Core types for the application

export type TripType = 'one-way' | 'round-trip';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate?: string;
  departureDateRangeStart?: string;
  departureDateRangeEnd?: string;
  returnDate?: string;
  returnDateRangeStart?: string;
  returnDateRangeEnd?: string;
  passengerCount: number;
  tripType: TripType;
  preferences?: {
    cheapest?: boolean;
    fastest?: boolean;
    flexibleDates?: boolean;
    maxStops?: number;
  };
}

export interface Flight {
  id: string;
  airline: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  stops: number;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  bookingUrl?: string;
}

export interface FlightSearchResult {
  flights: Flight[];
  searchParams: FlightSearchParams;
  searchedAt: string;
}

export interface PriceAlert {
  id: string;
  origin: string;
  destination: string;
  departureDateRangeStart: string;
  departureDateRangeEnd: string;
  returnDateRangeStart?: string;
  returnDateRangeEnd?: string;
  tripType: TripType;
  thresholdPrice?: number;
  lastKnownPrice?: number;
  active: boolean;
  notificationEmail: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  flightResults?: FlightSearchResult;
  metadata?: Record<string, unknown>;
}

export interface ConversationContext {
  currentSearch?: Partial<FlightSearchParams>;
  extractedEntities?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    tripType?: TripType;
    passengerCount?: number;
  };
  lastIntent?: string;
  userId?: string;
  userEmail?: string;
}
