import { Flight, FlightSearchParams, FlightSearchResult } from '@/types';
// @ts-ignore - Amadeus doesn't have type definitions
import Amadeus from 'amadeus';

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY!,
  clientSecret: process.env.AMADEUS_API_SECRET!,
});

// Check if we should use mock data or real API
const USE_MOCK = process.env.FLIGHT_API_MODE === 'mock';

// ========================================
// AMADEUS API INTEGRATION
// ========================================

/**
 * Convert city name to IATA code using Amadeus
 */
async function getIataCode(cityName: string): Promise<string> {
  try {
    // First check if it's already an IATA code (3 letters)
    if (/^[A-Z]{3}$/i.test(cityName.trim())) {
      return cityName.toUpperCase();
    }

    // Search for the city/airport
    const response = await amadeus.referenceData.locations.get({
      keyword: cityName,
      subType: Amadeus.location.city,
    });

    if (response.data && response.data.length > 0) {
      return response.data[0].iataCode;
    }

    throw new Error(`Could not find IATA code for ${cityName}`);
  } catch (error: any) {
    console.error('Error getting IATA code:', error);
    // Fallback to manual mapping
    return normalizeLocationFallback(cityName);
  }
}

/**
 * Search for flights using Amadeus API
 */
async function searchAmadeusFlights(params: FlightSearchParams): Promise<Flight[]> {
  try {
    // Get IATA codes for origin and destination
    const originCode = await getIataCode(params.origin);
    const destinationCode = await getIataCode(params.destination);

    // Determine the departure date
    const departureDate =
      params.departureDate ||
      params.departureDateRangeStart ||
      new Date().toISOString().split('T')[0];

    // Build Amadeus search parameters
    const searchParams: any = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: departureDate,
      adults: params.passengerCount || 1,
      max: 10, // Get up to 10 results
    };

    // Add return date for round-trip
    if (params.tripType === 'round-trip' && params.returnDate) {
      searchParams.returnDate = params.returnDate;
    }

    // Search for flight offers
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

    if (!response.data || response.data.length === 0) {
      console.log('No flights found, using mock data as fallback');
      return generateMockFlights(params);
    }

    // Transform Amadeus response to our Flight format
    const flights: Flight[] = response.data.map((offer: any, index: number) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];

      // Calculate total duration in minutes
      const durationMatch = offer.itineraries[0].duration.match(/PT(\d+H)?(\d+M)?/);
      const hours = durationMatch?.[1] ? parseInt(durationMatch[1]) : 0;
      const minutes = durationMatch?.[2] ? parseInt(durationMatch[2]) : 0;
      const totalDuration = hours * 60 + minutes;

      return {
        id: offer.id || `amadeus-${index}-${Date.now()}`,
        airline: firstSegment.carrierCode,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        duration: totalDuration,
        stops: offer.itineraries[0].segments.length - 1,
        departureTime: firstSegment.departure.at,
        arrivalTime: lastSegment.arrival.at,
        origin: params.origin,
        destination: params.destination,
        bookingUrl: `https://www.google.com/flights?q=${params.origin}+to+${params.destination}`,
      };
    });

    // Sort by preference
    if (params.preferences?.cheapest) {
      flights.sort((a, b) => a.price - b.price);
    } else if (params.preferences?.fastest) {
      flights.sort((a, b) => a.duration - b.duration);
    }

    return flights;
  } catch (error: any) {
    console.error('Amadeus API error:', error.description || error.message);
    console.log('Falling back to mock data');
    return generateMockFlights(params);
  }
}

// ========================================
// MOCK DATA (Fallback)
// ========================================

const AIRLINES = [
  'British Airways',
  'Air France',
  'Lufthansa',
  'Emirates',
  'Qatar Airways',
  'Turkish Airlines',
  'KLM',
  'Ethiopian Airlines',
  'Air Peace',
  'Arik Air',
  'Dana Air',
  'Aero Contractors',
  'Ibom Air',
  'United Nigeria Airlines',
  'Overland Airways',
  'Green Africa Airways',
];

// Comprehensive airport mapping with focus on Nigerian cities
const AIRPORTS: Record<string, string> = {
  // Nigerian Cities and Airports
  'lagos': 'LOS',
  'abuja': 'ABV',
  'port harcourt': 'PHC',
  'portharcourt': 'PHC',
  'kano': 'KAN',
  'enugu': 'ENU',
  'calabar': 'CBQ',
  'jos': 'JOS',
  'maiduguri': 'MIU',
  'kaduna': 'KAD',
  'sokoto': 'SKO',
  'ibadan': 'IBA',
  'ilorin': 'ILR',
  'benin city': 'BNI',
  'benin': 'BNI',
  'warri': 'QRW',
  'akure': 'AKR',
  'asaba': 'ABB',
  'owerri': 'QOW',
  'yola': 'YOL',
  'makurdi': 'MDI',
  'minna': 'MXJ',
  'uyo': 'QUO',
  'bauchi': 'BCU',
  'gombe': 'GMO',
  'jalingo': 'JLO',

  // International Cities
  'london': 'LHR',
  'new york': 'JFK',
  'paris': 'CDG',
  'dubai': 'DXB',
  'istanbul': 'IST',
  'amsterdam': 'AMS',
  'frankfurt': 'FRA',
  'toronto': 'YYZ',
  'sydney': 'SYD',
  'tokyo': 'NRT',
  'singapore': 'SIN',
  'accra': 'ACC',
  'johannesburg': 'JNB',
  'nairobi': 'NBO',
  'cairo': 'CAI',
  'addis ababa': 'ADD',
  'addisababa': 'ADD',
  'doha': 'DOH',
  'atlanta': 'ATL',
  'los angeles': 'LAX',
  'chicago': 'ORD',
  'houston': 'IAH',
  'washington': 'IAD',
  'barcelona': 'BCN',
  'madrid': 'MAD',
  'rome': 'FCO',
  'milan': 'MXP',
  'beijing': 'PEK',
  'shanghai': 'PVG',
  'hong kong': 'HKG',
  'bangkok': 'BKK',
  'kuala lumpur': 'KUL',
  'mumbai': 'BOM',
  'delhi': 'DEL',
};

function normalizeLocationFallback(location: string): string {
  const normalized = location.toLowerCase().trim();
  return AIRPORTS[normalized] || normalized.toUpperCase().slice(0, 3);
}

function generateMockFlights(params: FlightSearchParams): Flight[] {
  const flights: Flight[] = [];
  const basePrice = 300 + Math.random() * 700;
  const numFlights = 8;

  for (let i = 0; i < numFlights; i++) {
    const stops = Math.floor(Math.random() * 3);
    const durationBase = 420 + stops * 120; // 7 hours base + 2 hours per stop
    const duration = durationBase + Math.floor(Math.random() * 120);
    const priceVariation = 1 + (stops * 0.2) + (Math.random() * 0.3);
    const price = Math.round(basePrice * priceVariation);

    const departureDate = params.departureDate || params.departureDateRangeStart || new Date().toISOString().split('T')[0];
    const departureTime = new Date(departureDate + 'T' + generateRandomTime());
    const arrivalTime = new Date(departureTime.getTime() + duration * 60000);

    flights.push({
      id: `flight-${i + 1}-${Date.now()}`,
      airline: AIRLINES[Math.floor(Math.random() * AIRLINES.length)],
      price,
      currency: 'USD',
      duration,
      stops,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      origin: params.origin,
      destination: params.destination,
      bookingUrl: `https://www.google.com/flights?q=${params.origin}+to+${params.destination}`,
    });
  }

  // Sort by price if cheapest preference
  if (params.preferences?.cheapest) {
    flights.sort((a, b) => a.price - b.price);
  }

  // Sort by duration if fastest preference
  if (params.preferences?.fastest) {
    flights.sort((a, b) => a.duration - b.duration);
  }

  return flights;
}

function generateRandomTime(): string {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
}

// ========================================
// EXPORTED FUNCTIONS
// ========================================

export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
  console.log(`Searching flights with mode: ${USE_MOCK ? 'MOCK' : 'AMADEUS'}`);

  let flights: Flight[];

  if (USE_MOCK) {
    // Use mock data
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));
    flights = generateMockFlights(params);
  } else {
    // Use Amadeus API
    flights = await searchAmadeusFlights(params);
  }

  return {
    flights,
    searchParams: params,
    searchedAt: new Date().toISOString(),
  };
}

export async function getFlightPrice(flightId: string): Promise<number> {
  // For now, return a mock price
  // In production, you might want to re-query Amadeus for updated prices
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Math.round(300 + Math.random() * 700);
}

export function normalizeLocation(location: string): string {
  return normalizeLocationFallback(location);
}

export async function checkPriceChanges(
  origin: string,
  destination: string,
  dateRangeStart: string,
  dateRangeEnd: string
): Promise<{ currentPrice: number; priceChange: number }> {
  try {
    if (USE_MOCK) {
      // Mock price checking
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const currentPrice = Math.round(300 + Math.random() * 700);
      const previousPrice = currentPrice + Math.round((Math.random() - 0.5) * 100);
      const priceChange = currentPrice - previousPrice;
      return { currentPrice, priceChange };
    }

    // Use Amadeus to check current prices
    const originCode = await getIataCode(origin);
    const destinationCode = await getIataCode(destination);

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateRangeStart,
      adults: 1,
      max: 1,
    });

    if (response.data && response.data.length > 0) {
      const currentPrice = parseFloat(response.data[0].price.total);
      // For price change, we'd need to compare with stored historical price
      // For now, return 0 change
      return { currentPrice, priceChange: 0 };
    }

    throw new Error('No flights found for price check');
  } catch (error) {
    console.error('Error checking price:', error);
    // Fallback to mock data
    const currentPrice = Math.round(300 + Math.random() * 700);
    return { currentPrice, priceChange: 0 };
  }
}
