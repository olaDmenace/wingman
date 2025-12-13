# Wingman Travel - Setup Guide

A conversational AI-powered flight search and price tracking application built with Next.js, Supabase, and OpenAI.

## Features

- 🤖 Conversational flight search using natural language
- 💰 Price tracking and email alerts
- 📊 Flight comparison and recommendations
- 🔗 Direct booking links to third-party providers
- 📧 Email notifications for price changes

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key
- SMTP credentials (Gmail or other email service)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the SQL schema from `supabase_schema.sql`
4. Get your project credentials:
   - Project URL: `https://[project-ref].supabase.co`
   - Anon/Public key: Found in Settings > API
   - Service role key: Found in Settings > API (keep this secret!)

### 3. Configure Environment Variables

Copy the values to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lfrgelpbciqehoosxxcx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Email Service (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password  # Use App Password for Gmail

# Cron Job Secret
CRON_SECRET=some_random_secret_string
```

**Note for Gmail users:**
- You'll need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- Enable 2-factor authentication first
- Generate an App Password in your Google Account settings

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Searching for Flights

Just type naturally in the chat interface:

- "Find me the cheapest flight from Lagos to London in April"
- "I need a round-trip ticket from New York to Paris next month"
- "Show me flights to Dubai, I'm flexible with dates"

### Setting Price Alerts

1. Search for flights
2. Click "Set Price Alert" on any flight result
3. Provide your email address
4. You'll receive notifications when prices change

### Managing Alerts

Visit `/api/alerts?email=your@email.com` to see your active alerts.

To cancel an alert: `DELETE /api/alerts?id=alert_id`

## Price Alert Monitoring

The application includes a cron endpoint to check price alerts:

`GET /api/cron/check-alerts`

You can set up automatic checks using:

1. **Vercel Cron Jobs** (if deployed on Vercel):
   Create a `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/cron/check-alerts",
       "schedule": "0 */6 * * *"
     }]
   }
   ```

2. **External Cron Service**:
   - Use [cron-job.org](https://cron-job.org) or similar
   - Set up a GET request to your deployed URL
   - Add header: `Authorization: Bearer your_cron_secret`
   - Run every 6 hours

## Architecture

### Frontend
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- React components for chat interface

### Backend
- Next.js API Routes
- Supabase for database
- OpenAI for conversational AI
- Nodemailer for email notifications

### Database Schema
- `users` - User accounts
- `flight_searches` - Search history
- `price_alerts` - Active price alerts
- `conversations` - Chat history
- `outbound_clicks` - Analytics tracking

## MVP Limitations

- **Mock Flight Data**: Currently uses generated mock data. To integrate real flight APIs:
  1. Sign up for a flight API provider (Amadeus, Skyscanner, Kiwi.com)
  2. Update `src/lib/flight-api.ts` with real API calls
  3. Add API credentials to `.env.local`

- **Email Only**: Price alerts only support email notifications. Future versions could add SMS, WhatsApp, or push notifications.

- **No In-App Booking**: Users are redirected to third-party sites to complete bookings.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables Checklist

Make sure all these are set in your production environment:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `SMTP_HOST`
- ✅ `SMTP_PORT`
- ✅ `SMTP_USER`
- ✅ `SMTP_PASSWORD`
- ✅ `CRON_SECRET`

## Troubleshooting

### "Failed to get response" error
- Check that your OpenAI API key is valid and has credits
- Verify your `.env.local` file is in the project root

### Email notifications not working
- Verify SMTP credentials
- For Gmail, ensure you're using an App Password
- Check spam folder

### Supabase connection issues
- Verify your Supabase URL and keys
- Ensure the database schema has been created
- Check Supabase dashboard for any errors

## Future Enhancements

- Integration with real flight APIs
- In-app booking and payments
- Hotel recommendations
- Full itinerary management
- Multi-channel alerts (SMS, WhatsApp, Push)
- User authentication and saved searches
- Price prediction using ML
- Multi-city and complex itineraries

## Support

For issues or questions, please check:
- The PRD document for feature requirements
- Supabase logs for database errors
- Browser console for frontend errors
- Server logs for API errors

## License

MIT
