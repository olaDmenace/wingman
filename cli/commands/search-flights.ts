/**
 * Flight Search Command
 * Automates flight searches via CLI
 */

import chalk from 'chalk';
import ora from 'ora';
import { searchFlights } from '../../src/lib/flight-api';
import type { FlightSearchParams } from '../../src/types';

interface SearchOptions {
  from?: string;
  to?: string;
  date?: string;
  return?: string;
  passengers?: string;
  cheapest?: boolean;
  nonStop?: boolean;
}

export async function searchFlightsCommand(options: SearchOptions) {
  console.log(chalk.blue.bold('\n✈️  Wingman Flight Search\n'));

  // Validate required options
  if (!options.from || !options.to) {
    console.log(chalk.red('❌ Error: Origin and destination are required'));
    console.log(chalk.yellow('Usage: wingman search --from Lagos --to Abuja'));
    process.exit(1);
  }

  const spinner = ora('Searching for flights...').start();

  try {
    // Build search parameters
    const searchParams: FlightSearchParams = {
      origin: options.from,
      destination: options.to,
      departureDate: options.date,
      returnDate: options.return,
      passengerCount: parseInt(options.passengers || '1'),
      tripType: options.return ? 'round-trip' : 'one-way',
      preferences: {
        cheapest: options.cheapest,
        maxStops: options.nonStop ? 0 : undefined,
      },
    };

    // Search flights
    const result = await searchFlights(searchParams);
    const flights = result.flights;

    spinner.succeed(`Found ${flights.length} flights`);

    if (flights.length === 0) {
      console.log(chalk.yellow('\n📭 No flights found for your search criteria'));
      return;
    }

    // Display results
    console.log(chalk.green.bold('\n✈️  Available Flights:\n'));

    flights.slice(0, 5).forEach((flight, index) => {
      console.log(chalk.cyan(`${index + 1}. ${flight.airline}`));
      console.log(`   Route: ${flight.origin} → ${flight.destination}`);
      console.log(`   Departure: ${new Date(flight.departureTime).toLocaleString()}`);
      console.log(`   Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`);
      console.log(`   Duration: ${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`);
      console.log(`   Stops: ${flight.stops}`);
      console.log(chalk.green.bold(`   Price: ₦${flight.price.toLocaleString()}`));
      console.log('');
    });

    if (flights.length > 5) {
      console.log(chalk.gray(`   ... and ${flights.length - 5} more flights`));
    }

    // Show cheapest option
    const cheapest = flights.sort((a, b) => a.price - b.price)[0];
    console.log(chalk.green.bold('\n💰 Cheapest Option:'));
    console.log(`   ${cheapest.airline} - ₦${cheapest.price.toLocaleString()}`);
    console.log(`   ${cheapest.origin} → ${cheapest.destination}`);

    // Show booking URL
    if (cheapest.bookingUrl) {
      console.log(chalk.blue(`\n🔗 Book now: ${cheapest.bookingUrl}`));
    }

  } catch (error) {
    spinner.fail('Search failed');
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}
