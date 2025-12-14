/**
 * Email Testing Command
 * Automates email functionality testing
 */

import chalk from 'chalk';
import ora from 'ora';
import { sendPriceAlertEmail, sendWelcomeEmail } from '../../src/lib/email-supabase';

interface EmailOptions {
  to?: string;
  subject?: string;
  priceAlert?: boolean;
  welcome?: boolean;
}

export async function testEmailCommand(options: EmailOptions) {
  console.log(chalk.blue.bold('\n📧 Email Service Test\n'));

  if (!options.to) {
    console.log(chalk.red('❌ Error: Recipient email is required'));
    console.log(chalk.yellow('Usage: wingman email:test --to user@example.com'));
    process.exit(1);
  }

  const spinner = ora('Sending test email...').start();

  try {
    if (options.priceAlert) {
      spinner.text = 'Sending price alert email...';
      await sendPriceAlertEmail(
        options.to,
        'Lagos',
        'Abuja',
        45000,
        50000,
        -5000
      );
      spinner.succeed('Price alert email sent');
    } else if (options.welcome) {
      spinner.text = 'Sending welcome email...';
      await sendWelcomeEmail(options.to);
      spinner.succeed('Welcome email sent');
    } else {
      spinner.fail('Please specify --price-alert or --welcome');
      process.exit(1);
    }

    console.log(chalk.green(`\n✅ Test email sent to ${options.to}\n`));
    console.log(chalk.cyan('Check your inbox!'));

  } catch (error) {
    spinner.fail('Email sending failed');
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}
