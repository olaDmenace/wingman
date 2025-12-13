# Database Setup Guide

This guide will help you set up your Supabase database for the Wingman travel planner application.

## Prerequisites

- A Supabase account (free tier works)
- Your Supabase project created at https://supabase.com

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/lfrgelpbciqehoosxxcx
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (should be: `https://lfrgelpbciqehoosxxcx.supabase.co`)
   - **anon/public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 2: Update Environment Variables

Update your `.env.local` file with the actual keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lfrgelpbciqehoosxxcx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste your anon key here>
SUPABASE_SERVICE_ROLE_KEY=<paste your service_role key here>
```

⚠️ **IMPORTANT**: Never commit the `.env.local` file to git! It should already be in `.gitignore`.

## Step 3: Run the Database Schema

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/lfrgelpbciqehoosxxcx/sql/new
2. Copy the entire contents of `supabase_schema.sql`
3. Paste it into the SQL editor
4. Click **RUN** to execute the schema

This will create:
- ✅ All database tables (users, flight_searches, price_alerts, conversations, outbound_clicks)
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamp updates
- ✅ Row Level Security (RLS) policies

## Step 4: Verify the Schema

After running the schema, verify it was created successfully:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `users`
   - `flight_searches`
   - `price_alerts`
   - `conversations`
   - `outbound_clicks`

## Step 5: Test the Connection

Run the test script to verify everything is working:

```bash
npm run test:db
```

This will:
- ✅ Test database connection
- ✅ Create a test user
- ✅ Verify all tables are accessible
- ✅ Clean up test data

## Database Schema Overview

### Tables

1. **users** - Stores user information
   - `id` (UUID, primary key)
   - `email` (unique)
   - `created_at`, `updated_at`

2. **flight_searches** - Tracks all flight searches for analytics
   - Stores search parameters and results
   - Links to users (optional)

3. **price_alerts** - Manages price alert subscriptions
   - Tracks alert status and last known prices
   - Sends notifications when prices change

4. **conversations** - Stores chat history
   - Maintains conversation context
   - Links to users

5. **outbound_clicks** - Analytics for booking link clicks
   - Tracks which flights users click to book

### Security

Row Level Security (RLS) is enabled on all tables. The service role (used by API routes) has full access to all tables.

## Next Steps

Once the database is set up:

1. ✅ Run `npm run dev` to start your development server
2. ✅ Test the chat interface
3. ✅ Try creating a price alert
4. ✅ Check the Supabase dashboard to see data being created

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the entire `supabase_schema.sql` file
- Check the SQL editor for any errors during execution

### Connection errors
- Verify your environment variables are correct
- Make sure `.env.local` is in the root directory
- Restart your dev server after updating `.env.local`

### Permission errors
- Check that RLS policies were created
- Verify you're using the `service_role` key in server-side code

## MCP Server Connection

Your MCP server is configured in `.mcp.json` to connect to Supabase. This allows Claude Code to interact with your database directly during development.

To verify MCP connection:
```bash
npx -y @supabase/mcp-server-supabase@latest --project-ref=lfrgelpbciqehoosxxcx
```

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
