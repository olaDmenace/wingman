# Wingman Travel - Quick Start Guide

Get your conversational flight search app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works!)
- OpenAI API key

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to the SQL Editor in your Supabase dashboard
4. Copy the entire contents of `supabase_schema.sql` and run it
5. Get your credentials from Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (keep secret!)

## Step 3: Configure Environment Variables

Edit `.env.local` and update these required values:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-openai-api-key

# Email (OPTIONAL for MVP - can test without)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Cron Secret (can leave as default for local dev)
CRON_SECRET=local-dev-secret
```

**Note:** The email configuration is optional for initial testing. Price alerts will work but emails won't be sent until you configure SMTP.

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Try It Out!

Type natural language queries in the chat:

1. **Search for flights:**
   - "Find me the cheapest flight from Lagos to London in April"
   - "I need to fly from New York to Paris next month"
   - "Show me flights to Tokyo, I'm flexible with dates"

2. **Set price alerts:**
   - Click "Set Price Alert" on any flight result
   - Enter your email when prompted
   - You'll get notifications when prices change (once SMTP is configured)

## Testing Without Email

You can test the entire app without configuring email:

- Flight search works perfectly
- Price alerts are saved to the database
- You just won't receive email notifications

To verify alerts are being created:
1. Visit: `http://localhost:3000/api/alerts?email=test@example.com`
2. Check your Supabase dashboard > Table Editor > price_alerts

## Common Issues

### "OpenAI API Error"
- Make sure your OpenAI API key is valid
- Check you have credits in your OpenAI account
- Verify the key is correctly set in `.env.local`

### "Supabase Connection Failed"
- Double-check your Supabase URL and keys
- Ensure the database schema was created successfully
- Check for typos in your `.env.local` file

### "Email Not Sending"
- This is expected if you haven't configured SMTP yet
- For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833)
- Enable 2FA on your Google account first

## Next Steps

1. **Configure Email:** Set up SMTP to enable price alert notifications
2. **Set Up Cron Job:** Configure automatic price checking (see README_SETUP.md)
3. **Integrate Real Flight API:** Replace mock data with real flight data (see README_SETUP.md)
4. **Deploy:** Push to Vercel or your preferred hosting platform

## Project Structure

```
wingman/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── chat/      # Chat/conversation endpoint
│   │   │   ├── alerts/    # Price alerts management
│   │   │   ├── clicks/    # Analytics tracking
│   │   │   └── cron/      # Background jobs
│   │   ├── page.tsx       # Main chat interface
│   │   └── layout.tsx     # App layout
│   ├── components/        # React components
│   ├── lib/              # Utilities and services
│   │   ├── ai.ts         # LLM integration
│   │   ├── flight-api.ts # Flight search (mock)
│   │   ├── email.ts      # Email service
│   │   └── supabase.ts   # Database client
│   └── types/            # TypeScript types
├── .env.local            # Environment variables
├── supabase_schema.sql   # Database schema
└── package.json          # Dependencies
```

## Need Help?

Check the detailed setup guide in `README_SETUP.md` for:
- Detailed configuration instructions
- Email setup for Gmail/other providers
- Cron job configuration
- Deployment instructions
- Troubleshooting guide

Happy traveling! ✈️
