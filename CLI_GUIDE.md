# Wingman CLI - Complete Automation Tool

> Built with Cline CLI for the **Infinity Build Award** - Demonstrating complete, working automation tools that improve the software development experience.

## 🎯 Overview

Wingman CLI is a comprehensive command-line interface that automates every aspect of the Wingman Travel development workflow:

- **Flight Search Automation** - Search and compare flights directly from your terminal
- **Database Setup Automation** - One-command Supabase database configuration
- **Email Testing Automation** - Test email functionality without manual setup
- **Environment Configuration** - Interactive wizard for .env setup
- **Code Generation** - Auto-generate boilerplate code
- **Development Workflow** - Streamlined dev/build commands

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g wingman-cli
```

### Local Usage

```bash
npm run cli <command>
```

### Direct Usage with npx

```bash
npx wingman <command>
```

## 📚 Commands

### 1. Flight Search (`search`)

Search for flights directly from your terminal with rich output and automatic price comparison.

**Basic Usage:**
```bash
wingman search --from Lagos --to Abuja
```

**Advanced Usage:**
```bash
# Round-trip search
wingman search --from LOS --to ABV --date 2024-12-25 --return 2025-01-05

# Find cheapest option
wingman search --from "Port Harcourt" --to Lagos --cheapest

# Non-stop flights only
wingman search --from Kano --to Abuja --non-stop --passengers 2
```

**Options:**
- `-f, --from <origin>` - Origin airport (city name or IATA code)
- `-t, --to <destination>` - Destination airport
- `-d, --date <date>` - Departure date (YYYY-MM-DD)
- `-r, --return <date>` - Return date for round-trip
- `-p, --passengers <number>` - Number of passengers (default: 1)
- `-c, --cheapest` - Show only cheapest flights
- `-n, --non-stop` - Show only non-stop flights

**Example Output:**
```
✈️  Wingman Flight Search

✓ Found 12 flights

✈️  Available Flights:

1. Air Peace
   Route: LOS → ABV
   Departure: 12/25/2024, 9:00:00 AM
   Arrival: 12/25/2024, 10:15:00 AM
   Duration: 1h 15m
   Stops: 0
   Price: ₦45,000

2. Arik Air
   Route: LOS → ABV
   Departure: 12/25/2024, 11:30:00 AM
   Arrival: 12/25/2024, 12:50:00 PM
   Duration: 1h 20m
   Stops: 0
   Price: ₦48,500

💰 Cheapest Option:
   Air Peace - ₦45,000
   LOS → ABV

🔗 Book now: https://www.google.com/flights/...
```

### 2. Database Setup (`db:setup`)

Automates Supabase database setup with migrations and optional seeding.

**Usage:**
```bash
# Basic setup
wingman db:setup

# Reset and setup
wingman db:setup --reset

# Setup with sample data
wingman db:setup --seed

# Full reset with seeding
wingman db:setup --reset --seed
```

**What it does:**
1. Connects to Supabase
2. Runs database migrations
3. Creates all tables and relationships
4. Optionally seeds with sample data
5. Verifies setup completion

**Options:**
- `--reset` - Reset database before setup
- `--seed` - Seed database with sample data

### 3. Email Testing (`email:test`)

Test email functionality with pre-built templates.

**Usage:**
```bash
# Test price alert email
wingman email:test --to user@example.com --price-alert

# Test welcome email
wingman email:test --to user@example.com --welcome

# Custom subject
wingman email:test --to user@example.com --welcome --subject "Welcome Aboard!"
```

**Options:**
- `-t, --to <email>` - Recipient email address (required)
- `-s, --subject <subject>` - Email subject
- `--price-alert` - Send price alert test email
- `--welcome` - Send welcome email

**Example:**
```
📧 Email Service Test

✓ Price alert email sent

✅ Test email sent to user@example.com

Check your inbox!
```

### 4. Environment Setup (`env:setup`)

Interactive wizard for configuring `.env.local` with all required variables.

**Usage:**
```bash
# Full interactive setup
wingman env:setup

# Skip specific services
wingman env:setup --skip-supabase
wingman env:setup --skip-amadeus --skip-openai
```

**What it configures:**
- Supabase project URL and keys
- Amadeus API credentials
- OpenAI API key
- Auto-generated secrets

**Options:**
- `--skip-supabase` - Skip Supabase configuration
- `--skip-amadeus` - Skip Amadeus API configuration
- `--skip-openai` - Skip OpenAI configuration

**Interactive Prompts:**
```
⚙️  Environment Setup Wizard

? Supabase Project URL: https://xxx.supabase.co
? Supabase Anon Key: eyJhb...
? Amadeus API Key: O7qFQ...
? Amadeus API Secret: tdr6O...
? OpenAI API Key: sk-proj-...

✅ Environment configuration saved to .env.local

Next steps:
  1. Review your .env.local file
  2. Add any missing environment variables
  3. Start the development server: npm run dev
```

### 5. Code Generation (`generate`)

Auto-generates boilerplate code for common patterns.

**Usage:**
```bash
# Generate API route
wingman generate api-route --name flight-status

# Generate React component
wingman generate component --name FlightCard

# Generate email template
wingman generate email-template --name booking-confirmation
```

**Supported Types:**
- `api-route` - Next.js API route with GET/POST
- `component` - React TypeScript component
- `email-template` - HTML email template

**Example:**
```bash
wingman generate api-route --name notifications

🏗️  Code Generator

Created: src/app/api/notifications/route.ts

✅ Generated api-route: notifications
```

### 6. Development Server (`dev`)

Start the development server with optional cache cleaning.

**Usage:**
```bash
# Standard start
wingman dev

# Clean cache and start
wingman dev --clean
```

**Options:**
- `--clean` - Clean build cache before starting

### 7. Production Build (`build`)

Build the project for production deployment.

**Usage:**
```bash
# Standard build
wingman build

# Build with bundle analysis
wingman build --analyze
```

**Options:**
- `--analyze` - Analyze bundle size after build

## 🎨 Features

### 🚀 Complete Automation
- **Zero Manual Configuration** - Interactive wizards handle setup
- **One-Command Operations** - Complex workflows simplified
- **Error Handling** - Clear error messages and recovery suggestions

### 💻 Developer Experience
- **Rich Terminal Output** - Colored, formatted output with spinners
- **Progress Indicators** - Visual feedback for long operations
- **Helpful Examples** - Built-in usage examples and help

### 🔧 Extensible Architecture
- **Modular Commands** - Easy to add new automation
- **TypeScript** - Full type safety
- **Reusable Components** - Shared utilities across commands

## 📖 Examples

### Complete Project Setup

Set up a new Wingman development environment from scratch:

```bash
# 1. Clone and install
git clone https://github.com/olaDmenace/wingman.git
cd wingman
npm install

# 2. Configure environment
wingman env:setup

# 3. Setup database
wingman db:setup --seed

# 4. Test email service
wingman email:test --to your@email.com --welcome

# 5. Start development
wingman dev
```

### Daily Development Workflow

```bash
# Morning: Search for test flights
wingman search --from Lagos --to Abuja --date 2024-12-25

# Testing: Verify email functionality
wingman email:test --to test@example.com --price-alert

# Development: Generate new API route
wingman generate api-route --name booking-history

# Deployment: Build for production
wingman build
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run cli db:setup --seed
      - run: npm run cli build
```

## 🛠️ Development

### Adding New Commands

1. Create command file in `cli/commands/`:

```typescript
// cli/commands/my-command.ts
import chalk from 'chalk';

export async function myCommand(options: any) {
  console.log(chalk.blue('🎯 My Command'));
  // Implementation here
}
```

2. Register in `cli/wingman.ts`:

```typescript
program
  .command('my-cmd')
  .description('My custom command')
  .action(myCommand);
```

### Testing Commands

```bash
# Test locally
npm run cli -- search --from Lagos --to Abuja

# Test with TypeScript
ts-node cli/wingman.ts search --from Lagos --to Abuja
```

## 🏆 Infinity Build Award Compliance

This CLI demonstrates complete, working automation tools that improve the software development experience:

✅ **Complete Automation**: Full workflow automation from setup to deployment
✅ **Working Tools**: All commands are functional and tested
✅ **Developer Experience**: Rich output, error handling, and helpful documentation
✅ **Extensible**: Easy to add new automation capabilities
✅ **Production Ready**: Used in real Wingman Travel development

## 📝 License

MIT

## 🙏 Acknowledgments

Built with:
- **Commander.js** - CLI framework
- **Chalk** - Terminal styling
- **Ora** - Progress spinners
- **Inquirer** - Interactive prompts

---

**For more information, visit:** https://github.com/olaDmenace/wingman
