/**
 * Run Database Schema Script
 *
 * This script executes the supabase_schema.sql file against your Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSchema() {
  console.log('🚀 Running database schema...\n');

  // Read the schema file
  const schemaPath = resolve(process.cwd(), 'supabase_schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  // Execute the schema using Supabase RPC
  const { data, error } = await supabase.rpc('exec_sql', { sql: schema });

  if (error) {
    console.error('❌ Error executing schema:', error.message);
    console.log('\n💡 This is expected - Supabase client doesn\'t have a built-in exec_sql function.');
    console.log('Please run the schema manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/lfrgelpbciqehoosxxcx/sql/new');
    console.log('2. Copy the contents of supabase_schema.sql');
    console.log('3. Paste and click RUN');
    process.exit(1);
  }

  console.log('✅ Schema executed successfully!');
}

runSchema();
