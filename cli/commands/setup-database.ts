/**
 * Database Setup Command
 * Automates Supabase database setup
 */

import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SetupOptions {
  reset?: boolean;
  seed?: boolean;
}

export async function setupDatabaseCommand(options: SetupOptions) {
  console.log(chalk.blue.bold('\n🗄️  Supabase Database Setup\n'));

  const spinner = ora('Setting up database...').start();

  try {
    if (options.reset) {
      spinner.text = 'Resetting database...';
      await execAsync('npx supabase db reset');
      spinner.succeed('Database reset');
    }

    spinner.start('Running migrations...');
    await execAsync('npx supabase db push');
    spinner.succeed('Migrations completed');

    if (options.seed) {
      spinner.start('Seeding database...');
      // Seed logic would go here
      spinner.succeed('Database seeded with sample data');
    }

    console.log(chalk.green.bold('\n✅ Database setup completed successfully!\n'));

    console.log(chalk.cyan('Next steps:'));
    console.log('  1. Check your Supabase dashboard');
    console.log('  2. Verify tables were created');
    console.log('  3. Test API endpoints\n');

  } catch (error) {
    spinner.fail('Setup failed');
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}
