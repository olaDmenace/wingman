# ✈️ Wingman Travel

> Your AI-powered conversational flight search assistant with intelligent price tracking

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://wingman-rho.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)](https://supabase.com/)

## 🌟 Features

- **🤖 Conversational AI**: Natural language flight search powered by OpenAI
- **📧 Price Alerts**: Get notified when flight prices drop via email
- **🇳🇬 Nigerian Focus**: Specialized support for 26+ Nigerian airports and 8 local airlines
- **🌍 Global Coverage**: Search flights to 60+ international destinations
- **⚡ Real-time Data**: Live flight prices via Amadeus API
- **📊 Smart Tracking**: Monitor price changes and trends
- **🔔 Email Notifications**: Beautiful HTML emails via Supabase + Resend

## 🚀 Live Demo

**Production URL**: [https://wingman-rho.vercel.app/](https://wingman-rho.vercel.app/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Nigerian Aviation Support](#-nigerian-aviation-support)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Email Service Setup](#-email-service-setup)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (App Router + Turbopack)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4

### Backend
- **Runtime**: Node.js 24+
- **Database**: Supabase (PostgreSQL)
- **AI/LLM**: OpenAI GPT-4
- **Flight API**: Amadeus Travel API
- **Email**: Supabase Edge Functions + Resend

### Infrastructure
- **Hosting**: Vercel
- **Edge Functions**: Supabase Deno Runtime
- **Storage**: Supabase PostgreSQL

## 🇳🇬 Nigerian Aviation Support

### 26+ Nigerian Airports
- **Lagos (LOS)** - Murtala Muhammed International
- **Abuja (ABV)** - Nnamdi Azikiwe International
- **Port Harcourt (PHC)** - Port Harcourt International
- **Kano (KAN)** - Mallam Aminu Kano International
- **Enugu (ENU)** - Akanu Ibiam International
- Plus 21 more regional airports across Nigeria

### 8 Nigerian Airlines
- Air Peace
- Arik Air
- Dana Air
- Aero Contractors
- Ibom Air
- United Nigeria Airlines
- Overland Airways
- Green Africa Airways

### Popular Routes
- Lagos → Abuja
- Port Harcourt → Lagos
- Kano → Abuja
- Enugu → Lagos
- Calabar → Abuja

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Supabase Account**: [Sign up free](https://supabase.com)
- **OpenAI API Key**: [Get key](https://platform.openai.com)
- **Amadeus API Key**: [Register here](https://developers.amadeus.com)
- **Resend API Key**: [Sign up](https://resend.com)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/olaDmenace/wingman.git
cd wingman
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your `.env.local`** (see [Environment Setup](#-environment-setup))

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Amadeus Flight API
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
FLIGHT_API_MODE=amadeus  # or 'mock' for testing

# Cron Job Secret
CRON_SECRET=your_random_secret_key
```

### Where to Get API Keys

1. **Supabase**: Create a project at [supabase.com](https://supabase.com)
2. **OpenAI**: Get your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. **Amadeus**: Register at [developers.amadeus.com](https://developers.amadeus.com)
4. **Resend**: Sign up at [resend.com](https://resend.com)

## 🗄️ Database Setup

### Option 1: Automatic Setup (Recommended)

Run the SQL schema directly in Supabase:

```bash
# 1. Go to your Supabase project dashboard
# 2. Navigate to SQL Editor
# 3. Copy and paste the contents of supabase_schema.sql
# 4. Click "Run"
```

### Option 2: Using Supabase CLI

```bash
# Link your project
npx supabase link --project-ref your_project_ref

# Push the schema
npx supabase db push
```

### Database Tables

- `conversations` - User chat history
- `flight_searches` - Search queries and results
- `price_alerts` - User price alert subscriptions
- `outbound_clicks` - Click tracking for analytics

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed schema documentation.

## 📧 Email Service Setup

Wingman uses Supabase Edge Functions + Resend for reliable email delivery.

### Quick Setup

```bash
# 1. Login to Supabase
npx supabase login

# 2. Link your project
npx supabase link --project-ref your_project_ref

# 3. Set Resend API key
npx supabase secrets set RESEND_API_KEY=your_resend_api_key

# 4. Deploy email function
npx supabase functions deploy send-email
```

### Testing Emails

```bash
curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/send-email' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"to":"test@example.com","subject":"Test","html":"<h1>It works!</h1>"}'
```

See [SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md) for complete email setup guide.

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/olaDmenace/wingman)

1. Click the "Deploy" button above
2. Connect your GitHub repository
3. Add environment variables from `.env.local`
4. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📚 API Reference

### POST `/api/chat`
Conversational flight search endpoint

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "content": "Find flights from Lagos to Abuja"}
  ],
  "userId": "optional_user_id",
  "conversationId": "optional_conversation_id"
}
```

**Response:**
```json
{
  "message": "I found 5 flights from Lagos to Abuja...",
  "intent": "flight_search",
  "flights": [...]
}
```

### POST `/api/alerts`
Create or manage price alerts

### POST `/api/clicks`
Track outbound flight booking clicks

### GET `/api/cron/check-alerts`
Check all active price alerts (scheduled job)

See full API documentation in [API.md](./docs/API.md)

## 📁 Project Structure

```
wingman/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   │   ├── chat/       # Chat endpoint
│   │   │   ├── alerts/     # Price alerts
│   │   │   └── cron/       # Scheduled jobs
│   │   ├── page.tsx        # Homepage
│   │   └── layout.tsx      # Root layout
│   ├── components/          # React components
│   ├── lib/                # Utility libraries
│   │   ├── ai.ts           # OpenAI integration
│   │   ├── flight-api.ts   # Amadeus API client
│   │   ├── email-supabase.ts # Email service
│   │   └── supabase.ts     # Supabase client
│   └── types/              # TypeScript types
├── supabase/
│   └── functions/          # Edge functions
│       └── send-email/     # Email sender
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── docs/                   # Documentation
```

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Run production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Quality

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (coming soon)
- **CodeRabbit** for AI-powered code reviews

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Amadeus** for flight data API
- **OpenAI** for conversational AI
- **Supabase** for database and edge functions
- **Resend** for email delivery
- **Vercel** for hosting

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/olaDmenace/wingman/issues)
- **Documentation**: [Full Docs](./docs/)
- **Email**: oladmenace@gmail.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Hotel and car rental integration
- [ ] Social sharing features
- [ ] Advanced filtering options
- [ ] Loyalty program integration

---

**Built with ❤️ for travelers** | [Live Demo](https://wingman-rho.vercel.app/) | [Report Bug](https://github.com/olaDmenace/wingman/issues)
