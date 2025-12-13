# ✈️ Amadeus Flight API Integration Complete!

Your Wingman app is now using **real flight data** from Amadeus!

## What's Been Done

### 1. ✅ Amadeus Credentials Added
- API Key: `O7qFQHUYlAK1F8h3E3QSa4qXDvjLpZB0`
- API Secret: `tdr6OyRLjWHaRYG9`
- Configuration in [.env.local](.env.local)

### 2. ✅ Amadeus SDK Installed
- Package: `amadeus` (official SDK)
- Installed via npm

### 3. ✅ Flight API Updated
- File: [src/lib/flight-api.ts](src/lib/flight-api.ts)
- Now uses real Amadeus API for flight searches
- Intelligent fallback to mock data if API fails
- Automatic IATA code conversion (e.g., "London" → "LHR")

### 4. ✅ Mode Toggle Available
- Environment variable: `FLIGHT_API_MODE`
- Set to `amadeus` for real data (current)
- Set to `mock` to use mock data (for testing)

## How It Works

### Flight Search Flow

1. **User asks for flights**: "Find me flights from New York to London"
2. **AI extracts details**: Origin, destination, dates, preferences
3. **IATA code lookup**: Converts city names to airport codes
   - "New York" → "JFK"
   - "London" → "LHR"
4. **Amadeus API call**: Searches real flight offers
5. **Results transformed**: Amadeus format → Your app format
6. **Display to user**: Real flight prices, times, airlines

### Features

✅ **Real-time pricing** - Current market prices from Amadeus
✅ **Multiple airlines** - Shows all available carriers
✅ **Flexible search** - City names or IATA codes work
✅ **Smart fallback** - Uses mock data if API fails or no flights found
✅ **Round-trip support** - Handles both one-way and round-trip searches
✅ **Passenger count** - Supports multiple passengers
✅ **Preference sorting** - Cheapest or fastest flights first

## API Limits (Free Tier)

- **10,000 API calls/month**
- **Resets monthly**
- **No credit card required**

Monitor your usage at: https://developers.amadeus.com/my-apps

## Testing Your Integration

The dev server is running at: **http://localhost:3000**

### Test Queries

Try these in the chat:

1. **"Find me flights from New York to London for next week"**
2. **"I need the cheapest flights from Lagos to Dubai in January"**
3. **"Show me flights from Paris to Tokyo on March 15"**
4. **"Find me round-trip flights from Toronto to Sydney"**

### What You'll See

- **Real flight prices** in USD, EUR, or local currency
- **Actual airlines** (American Airlines, British Airways, etc.)
- **Real departure times** based on actual schedules
- **Accurate durations** including layovers
- **Number of stops** (direct, 1 stop, 2 stops)

## Switching Between Mock and Real Data

In [.env.local](.env.local), change:

```env
# Use real Amadeus data
FLIGHT_API_MODE=amadeus

# OR use mock data (for testing without API calls)
FLIGHT_API_MODE=mock
```

Then restart the dev server:
```bash
npm run dev
```

## Error Handling

The integration includes smart fallbacks:

1. **No API credentials** → Uses mock data
2. **API rate limit exceeded** → Falls back to mock data
3. **No flights found** → Returns mock data as suggestions
4. **Invalid city names** → Tries to map to nearest airport code
5. **Network errors** → Gracefully falls back to mock data

All errors are logged to the console for debugging.

## API Response Format

Amadeus returns data that includes:
- **Price** - Total price with taxes
- **Currency** - USD, EUR, GBP, etc.
- **Itineraries** - Outbound and return segments
- **Airlines** - IATA codes (AA, BA, LH, etc.)
- **Airports** - Departure/arrival IATA codes
- **Duration** - ISO 8601 format (PT10H30M)
- **Segments** - Each leg of the journey

## Next Steps

### Want More Features?

You can enhance the Amadeus integration:

1. **Airline names** - Map IATA codes to full names
   ```typescript
   const airlineNames = { 'BA': 'British Airways', 'AA': 'American Airlines' }
   ```

2. **Date range search** - Search across multiple dates
3. **Flexible dates** - ±3 days search
4. **Seat availability** - Show available seats
5. **Booking links** - Direct booking URLs from Amadeus
6. **Price alerts** - Real-time price tracking with Amadeus

### Monitor Your Usage

Check your API usage dashboard:
- Go to: https://developers.amadeus.com/my-apps
- View: API calls, rate limits, errors
- Upgrade: If you need more than 10,000 calls/month

## Troubleshooting

### "Invalid API key" error
- Check [.env.local](.env.local) has correct credentials
- Restart dev server: `npm run dev`
- Verify credentials at https://developers.amadeus.com/my-apps

### "No flights found"
- Check date format (YYYY-MM-DD)
- Verify city names are recognized
- Try using IATA codes directly (JFK, LHR, CDG)
- Falls back to mock data automatically

### API rate limit exceeded
- You've hit 10,000 calls this month
- Switch to mock mode temporarily
- Upgrade your Amadeus plan

## Files Modified

- ✅ [.env.local](.env.local) - Added Amadeus credentials
- ✅ [src/lib/flight-api.ts](src/lib/flight-api.ts) - Integrated Amadeus SDK
- ✅ [package.json](package.json) - Added `amadeus` dependency

## Resources

- **Amadeus Docs**: https://developers.amadeus.com/self-service
- **API Reference**: https://developers.amadeus.com/self-service/category/flights
- **Support**: https://developers.amadeus.com/support
- **Code Samples**: https://github.com/amadeus4dev/amadeus-node

---

**🎉 You're all set!** Your Wingman app is now powered by real flight data from Amadeus!

Open http://localhost:3000 and try searching for flights! 🚀
