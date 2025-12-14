# Supabase Email Service Setup

This guide explains how to set up email notifications using Supabase Edge Functions and Resend.

## Why Supabase Edge Functions + Resend?

- **No SMTP configuration needed** - No need to manage Gmail app passwords or SMTP settings
- **Better deliverability** - Resend provides excellent email delivery rates
- **Scalable** - Serverless edge functions that scale automatically
- **Free tier** - Resend offers 3,000 emails/month for free
- **Easy deployment** - Deploy with a single command

## Prerequisites

1. **Supabase CLI** - Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. **Resend Account** - Sign up at https://resend.com
   - Free tier: 3,000 emails/month
   - Get your API key from the dashboard

## Setup Steps

### 1. Login to Supabase CLI

```bash
supabase login
```

### 2. Link Your Supabase Project

```bash
cd c:\Users\ADMIN\Desktop\projects\wingman
supabase link --project-ref lfrgelpbciqehoosxxcx
```

### 3. Set Resend API Key as Secret

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### 4. Deploy the Edge Function

```bash
supabase functions deploy send-email
```

### 5. Verify Domain (Optional but Recommended)

For production use, verify your domain in Resend:
1. Go to Resend Dashboard → Domains
2. Add your domain
3. Add the required DNS records
4. Update the edge function `from` field to use your verified domain:
   ```typescript
   from: 'Wingman Travel <noreply@yourdomain.com>'
   ```

## Testing the Email Function

You can test the email function using curl:

```bash
curl -i --location --request POST 'https://lfrgelpbciqehoosxxcx.supabase.co/functions/v1/send-email' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"to":"test@example.com","subject":"Test Email","html":"<h1>Hello from Wingman!</h1>"}'
```

## Environment Variables

The app now uses Supabase for emails instead of SMTP. You can remove these from `.env.local`:

```bash
# SMTP Configuration - NO LONGER NEEDED
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASSWORD=your_email_password
```

## Usage in Code

The app automatically uses the new Supabase email service. See `src/lib/email-supabase.ts` for implementation:

```typescript
import { sendPriceAlertEmail, sendWelcomeEmail } from '@/lib/email-supabase';

// Send price alert
await sendPriceAlertEmail(
  'user@example.com',
  'Lagos',
  'Abuja',
  50000,  // current price in Naira
  55000,  // previous price
  -5000   // price change
);

// Send welcome email
await sendWelcomeEmail('user@example.com');
```

## Nigerian Flight Support

The app has been optimized for Nigerian flights with:

### 26+ Nigerian Airports
- Lagos (LOS) - Murtala Muhammed International
- Abuja (ABV) - Nnamdi Azikiwe International
- Port Harcourt (PHC) - Port Harcourt International
- Kano (KAN) - Mallam Aminu Kano International
- Enugu (ENU) - Akanu Ibiam International
- And 21 more regional airports

### Nigerian Airlines
- Air Peace
- Arik Air
- Dana Air
- Aero Contractors
- Ibom Air
- United Nigeria Airlines
- Overland Airways
- Green Africa Airways

### Examples of Supported Routes
- Lagos → Abuja
- Port Harcourt → Lagos
- Kano → Abuja
- Enugu → Lagos
- Calabar → Abuja

## Monitoring

Monitor your email delivery in:
1. **Resend Dashboard** - View sent emails, delivery status, bounces
2. **Supabase Dashboard** - Edge Functions → Logs → send-email function

## Troubleshooting

### Edge Function Not Found
```bash
# Re-deploy the function
supabase functions deploy send-email
```

### Emails Not Sending
1. Check Resend API key is set correctly:
   ```bash
   supabase secrets list
   ```

2. Check Edge Function logs:
   ```bash
   supabase functions logs send-email
   ```

3. Verify Resend account has available quota

### Rate Limits
- Resend Free Tier: 3,000 emails/month
- Upgrade to Pro for more: https://resend.com/pricing

## Cost Optimization

**Free Tier (Current Setup)**
- Supabase: Free tier (Generous limits)
- Resend: 3,000 emails/month free
- Total: $0/month

**If You Exceed Free Tier**
- Resend Pro: $20/month for 50,000 emails
- Supabase Pro: $25/month (if needed for scale)

## Security Notes

1. **API Keys** - Never commit Resend API keys to git
2. **Edge Function Auth** - Functions use Supabase auth by default
3. **Email Validation** - Always validate email addresses before sending

## Next Steps

1. **Set up Resend account** - https://resend.com/signup
2. **Deploy edge function** - `supabase functions deploy send-email`
3. **Test email sending** - Use the curl command above
4. **Monitor deliverability** - Check Resend dashboard

## Support

- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Resend API Docs: https://resend.com/docs
- Wingman Issues: Create issue in project repository
