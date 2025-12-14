#!/usr/bin/env node

/**
 * Wingman CLI - Automation tool for Wingman Travel development
 *
 * This CLI tool provides complete automation for:
 * - Flight search and price checking
 * - Database setup and migrations
 * - Email service testing
 * - Development environment setup
 * - Code generation and scaffolding
 *
 * Built with Cline CLI for the Infinity Build Award
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { searchFlightsCommand } from './commands/search-flights';
import { setupDatabaseCommand } from './commands/setup-database';
import { testEmailCommand } from './commands/test-email';
import { setupEnvCommand } from './commands/setup-env';
import { generateCodeCommand } from './commands/generate-code';

const program = new Command();

program
  .name('wingman')
  .description('🛠️  Wingman CLI - Automate your flight search development workflow')
  .version('1.0.0');

// Flight search automation
program
  .command('search')
  .description('Search for flights via CLI')
  .option('-f, --from <origin>', 'Origin airport (e.g., Lagos, LOS)')
  .option('-t, --to <destination>', 'Destination airport (e.g., Abuja, ABV)')
  .option('-d, --date <date>', 'Departure date (YYYY-MM-DD)')
  .option('-r, --return <date>', 'Return date (YYYY-MM-DD)')
  .option('-p, --passengers <number>', 'Number of passengers', '1')
  .option('-c, --cheapest', 'Show only cheapest flights')
  .option('-n, --non-stop', 'Show only non-stop flights')
  .action(searchFlightsCommand);

// Database setup automation
program
  .command('db:setup')
  .description('Automatically set up Supabase database')
  .option('--reset', 'Reset database before setup')
  .option('--seed', 'Seed database with sample data')
  .action(setupDatabaseCommand);

// Email testing automation
program
  .command('email:test')
  .description('Test email functionality')
  .option('-t, --to <email>', 'Test email recipient')
  .option('-s, --subject <subject>', 'Email subject', 'Wingman Test Email')
  .option('--price-alert', 'Test price alert email')
  .option('--welcome', 'Test welcome email')
  .action(testEmailCommand);

// Environment setup automation
program
  .command('env:setup')
  .description('Interactive environment setup wizard')
  .option('--skip-supabase', 'Skip Supabase configuration')
  .option('--skip-amadeus', 'Skip Amadeus API configuration')
  .option('--skip-openai', 'Skip OpenAI configuration')
  .action(setupEnvCommand);

// Code generation automation
program
  .command('generate <type>')
  .description('Generate boilerplate code')
  .argument('<type>', 'Type to generate (api-route, component, email-template)')
  .option('-n, --name <name>', 'Name for the generated code')
  .action(generateCodeCommand);

// Dev automation
program
  .command('dev')
  .description('Start development server with auto-reload')
  .option('--clean', 'Clean build cache before starting')
  .action(async (options) => {
    const ora = (await import('ora')).default;
    const { exec } = await import('child_process');

    if (options.clean) {
      const spinner = ora('Cleaning build cache...').start();
      exec('rm -rf .next', (error) => {
        if (error) {
          spinner.fail('Failed to clean cache');
          return;
        }
        spinner.succeed('Build cache cleaned');
        startDev();
      });
    } else {
      startDev();
    }

    function startDev() {
      console.log(chalk.blue('🚀 Starting Wingman development server...\n'));
      exec('npm run dev', { stdio: 'inherit' });
    }
  });

// Build automation
program
  .command('build')
  .description('Build project for production')
  .option('--analyze', 'Analyze bundle size')
  .action(async (options) => {
    const ora = (await import('ora')).default;
    const { exec } = await import('child_process');

    const spinner = ora('Building for production...').start();

    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        spinner.fail('Build failed');
        console.error(stderr);
        process.exit(1);
      }
      spinner.succeed('Build completed successfully');
      console.log(stdout);

      if (options.analyze) {
        console.log(chalk.blue('\n📊 Analyzing bundle size...'));
        // Bundle analysis logic would go here
      }
    });
  });

// Help command
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ wingman search --from Lagos --to Abuja --date 2024-12-25');
  console.log('  $ wingman db:setup --seed');
  console.log('  $ wingman email:test --to user@example.com --price-alert');
  console.log('  $ wingman env:setup');
  console.log('  $ wingman generate api-route --name flight-status');
  console.log('');
  console.log('For more information, visit:');
  console.log('  https://github.com/olaDmenace/wingman');
});

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
