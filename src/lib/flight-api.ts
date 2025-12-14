import { Flight, FlightSearchParams, FlightSearchResult } from '@/types';
import { convertToNGN } from './currency';

// Check if we should use mock data or real API
const FORCE_MOCK = process.env.FLIGHT_API_MODE === 'mock';
const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

// ========================================
// UTILITIES
// ========================================

/**
 * Simple seeded random number generator
 * Ensures consistent results for the same search parameters
 */
function getSeededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

// ========================================
// AVIATIONSTACK API INTEGRATION
// ========================================

/**
 * Search for flights using AviationStack API
 * NOTE: Free tier only provides real-time flight status (today's flights)
 * For future dates, will fall back to mock data
 */
async function searchAviationStackFlights(params: FlightSearchParams): Promise<Flight[]> {
  try {
    if (FORCE_MOCK || !AVIATIONSTACK_API_KEY) {
      throw new Error('Forced Mock Mode or Missing API Key');
    }

    const originIata = normalizeLocationFallback(params.origin);
    const destinationIata = normalizeLocationFallback(params.destination);

    console.log(`Searching AviationStack: ${originIata} → ${destinationIata}`);

    const url = `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&dep_iata=${originIata}&arr_iata=${destinationIata}&limit=10`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      console.log('No flights found via AviationStack API, using mock data');
      return generateMockFlights(params);
    }

    console.log(`Found ${data.data.length} flights from AviationStack`);

    // Transform AviationStack response to our Flight format
    const flights: Flight[] = data.data.map((flight: any, index: number) => {
      const departure = new Date(flight.departure.scheduled);
      const arrival = new Date(flight.arrival.scheduled);
      const durationMinutes = Math.round((arrival.getTime() - departure.getTime()) / 60000);

      // AviationStack doesn't provide pricing, so we simulate realistic prices
      const seed = `${flight.flight.iata}-${flight.departure.scheduled}`;
      const random = getSeededRandom(seed);
      const isDomestic = isNigerianRoute(params.origin, params.destination);

      let basePrice = isDomestic ? 85000 : 450000;
      const price = Math.ceil((basePrice * (0.8 + random() * 0.6)) / 1000) * 1000;

      return {
        id: `aviationstack-${index}-${Date.now()}`,
        airline: flight.airline.name,
        price: price,
        currency: 'NGN',
        duration: durationMinutes,
        stops: 0, // AviationStack doesn't provide layover info in free tier
        departureTime: flight.departure.scheduled,
        arrivalTime: flight.arrival.scheduled,
        origin: params.origin,
        destination: params.destination,
        bookingUrl: `https://www.google.com/flights?q=${params.origin}+to+${params.destination}`,
        flightNumber: flight.flight.iata,
      };
    });

    return sortFlights(flights, params.preferences);

  } catch (error: any) {
    console.warn('AviationStack API error:', error.message);
    console.log('Falling back to mock data');
    return generateMockFlights(params);
  }
}

function sortFlights(flights: Flight[], preferences?: any): Flight[] {
    if (preferences?.cheapest) {
      return flights.sort((a, b) => a.price - b.price);
    } else if (preferences?.fastest) {
      return flights.sort((a, b) => a.duration - b.duration);
    }
    return flights;
}

// ========================================
// MOCK DATA (Fallback)
// ========================================

const AIRLINES_DOMESTIC = [
  'Air Peace', 'Arik Air', 'Dana Air', 'Aero Contractors', 
  'Ibom Air', 'United Nigeria', 'Overland Airways', 'Green Africa'
];

const AIRLINES_INTERNATIONAL = [
  'British Airways', 'Air France', 'Lufthansa', 'Emirates', 
  'Qatar Airways', 'Turkish Airlines', 'KLM', 'Ethiopian Airlines',
  'Virgin Atlantic', 'Delta Air Lines', 'Royal Air Maroc', 'EgyptAir'
];

// Comprehensive airport mapping with focus on Nigerian cities
const AIRPORTS: Record<string, string> = {
  // Nigerian Cities and Airports
  'lagos': 'LOS', 'abuja': 'ABV', 'port harcourt': 'PHC', 'portharcourt': 'PHC',
  'kano': 'KAN', 'enugu': 'ENU', 'calabar': 'CBQ', 'jos': 'JOS',
  'maiduguri': 'MIU', 'kaduna': 'KAD', 'sokoto': 'SKO', 'ibadan': 'IBA',
  'ilorin': 'ILR', 'benin city': 'BNI', 'benin': 'BNI', 'warri': 'QRW',
  'akure': 'AKR', 'asaba': 'ABB', 'owerri': 'QOW', 'yola': 'YOL',
  'makurdi': 'MDI', 'minna': 'MXJ', 'uyo': 'QUO', 'bauchi': 'BCU',
  'gombe': 'GMO', 'jalingo': 'JLO', 'ekiti': 'AKR', 'ado ekiti': 'AKR',

  // International Cities
  'london': 'LHR', 'new york': 'JFK', 'paris': 'CDG', 'dubai': 'DXB',
  'istanbul': 'IST', 'amsterdam': 'AMS', 'frankfurt': 'FRA', 'toronto': 'YYZ',
  'sydney': 'SYD', 'tokyo': 'NRT', 'singapore': 'SIN', 'accra': 'ACC',
  'johannesburg': 'JNB', 'nairobi': 'NBO', 'cairo': 'CAI', 'addis ababa': 'ADD',
  'doha': 'DOH', 'atlanta': 'ATL', 'los angeles': 'LAX', 'chicago': 'ORD',
  'houston': 'IAH', 'washington': 'IAD', 'barcelona': 'BCN', 'madrid': 'MAD',
  'rome': 'FCO', 'milan': 'MXP', 'beijing': 'PEK', 'shanghai': 'PVG'
};

function normalizeLocationFallback(location: string): string {
  const normalized = location.toLowerCase().trim();
  return AIRPORTS[normalized] || normalized.toUpperCase().slice(0, 3);
}

function isNigerianRoute(origin: string, destination: string): boolean {
  const nigerianCities = [
    'lagos', 'abuja', 'port harcourt', 'portharcourt', 'kano', 'enugu',
    'calabar', 'jos', 'maiduguri', 'kaduna', 'sokoto', 'ibadan', 'ilorin',
    'benin city', 'benin', 'warri', 'akure', 'asaba', 'owerri', 'yola',
    'makurdi', 'minna', 'uyo', 'bauchi', 'gombe', 'jalingo', 'ekiti', 'ado ekiti',
    'LOS', 'ABV', 'PHC', 'KAN', 'ENU', 'CBQ', 'JOS', 'MIU', 'KAD', 'SKO',
    'IBA', 'ILR', 'BNI', 'QRW', 'AKR', 'ABB', 'QOW', 'YOL', 'MDI', 'MXJ',
    'QUO', 'BCU', 'GMO', 'JLO'
  ];

  const originNormalized = origin.toLowerCase().trim();
  const destNormalized = destination.toLowerCase().trim();

  return nigerianCities.includes(originNormalized) && nigerianCities.includes(destNormalized);
}

function generateMockFlights(params: FlightSearchParams): Flight[] {
  const flights: Flight[] = [];
  
  // Create a seed based on parameters so results are consistent (deterministic)
  const seedString = `${params.origin}-${params.destination}-${params.departureDate || 'any'}`;
  const random = getSeededRandom(seedString);

  const isDomestic = isNigerianRoute(params.origin, params.destination);
  const airlines = isDomestic ? AIRLINES_DOMESTIC : AIRLINES_INTERNATIONAL;
  
  // Realistic Pricing Logic
  // Domestic: ₦80k - ₦250k
  // International: ₦600k - ₦3.5M depending on "distance" (simulated)
  
  let basePrice = 0;
  let baseDuration = 0;

  if (isDomestic) {
    basePrice = 85000 + (random() * 100000); // 85k - 185k
    baseDuration = 45 + (random() * 45); // 45m - 90m
  } else {
    // Simulate "long haul" vs "short haul" international
    const isRegional = ['ACC', 'JNB', 'NBO', 'CAI', 'ADD'].includes(normalizeLocationFallback(params.destination));
    if (isRegional) {
        basePrice = 450000 + (random() * 300000); // 450k - 750k
        baseDuration = 120 + (random() * 240); // 2h - 6h
    } else {
        basePrice = 950000 + (random() * 1500000); // 950k - 2.5M
        baseDuration = 360 + (random() * 600); // 6h - 16h
    }
  }

  const numFlights = 5 + Math.floor(random() * 5); // 5-10 flights

  for (let i = 0; i < numFlights; i++) {
    // Vary each flight slightly
    const stops = isDomestic ? 0 : (random() > 0.6 ? 1 : 0); // Domestic mostly direct
    const duration = baseDuration + (stops * 120) + (random() * 60);
    
    // Price variation based on "airline quality" and stops
    const priceVariation = 0.8 + (random() * 0.4); // +/- 20%
    let price = Math.round(basePrice * priceVariation);
    
    // Round to nearest 1000 for cleaner look
    price = Math.ceil(price / 1000) * 1000;

    const departureDate = params.departureDate || params.departureDateRangeStart || new Date().toISOString().split('T')[0];
    
    // Random time of day
    const hour = 6 + Math.floor(random() * 16); // 06:00 to 22:00
    const minute = Math.floor(random() * 12) * 5; // 5 min intervals
    const departureTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    
    const departureTime = new Date(departureDate + 'T' + departureTimeStr);
    const arrivalTime = new Date(departureTime.getTime() + duration * 60000);

    flights.push({
      id: `flight-${i + 1}-${Date.now()}`, // ID can be dynamic
      airline: airlines[Math.floor(random() * airlines.length)],
      price,
      currency: 'NGN',
      duration: Math.round(duration),
      stops,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      origin: params.origin,
      destination: params.destination,
      bookingUrl: `https://www.google.com/flights?q=${params.origin}+to+${params.destination}`,
    });
  }

  return sortFlights(flights, params.preferences);
}

// ========================================
// EXPORTED FUNCTIONS
// ========================================

export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
  console.log(`Searching flights for ${params.origin} -> ${params.destination}`);

  // Always try the real API first unless forced mock
  let flights: Flight[];

  if (FORCE_MOCK) {
     flights = generateMockFlights(params);
  } else {
     flights = await searchAviationStackFlights(params);
  }

  return {
    flights,
    searchParams: params,
    searchedAt: new Date().toISOString(),
  };
}

export async function getFlightPrice(flightId: string): Promise<number> {
  // Return realistic NGN price
  await new Promise((resolve) => setTimeout(resolve, 500));
  const basePrice = 85000 + Math.random() * 100000; 
  return Math.round(basePrice);
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
  // For price changes, we can't easily use the API without historical data.
  // We'll use the seeded random generator to simulate a "current" price
  // and a "previous" price based on the date.
  
  const seed = `${origin}-${destination}-${dateRangeStart}`;
  const random = getSeededRandom(seed);
  
  const isDomestic = isNigerianRoute(origin, destination);
  const basePrice = isDomestic ? 100000 : 800000;
  
  const currentPrice = Math.round(basePrice * (0.8 + random() * 0.4));
  const previousPrice = Math.round(basePrice * (0.8 + random() * 0.4));
  
  return { 
      currentPrice, 
      priceChange: currentPrice - previousPrice 
  };
}
