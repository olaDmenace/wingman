/**
 * Database Connection Test Script
 *
 * This script tests the Supabase connection and verifies all tables are accessible.
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/database.types';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  console.error('Please ensure .env.local contains:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  const results = {
    passed: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Test 1: Basic connection
  console.log('Test 1: Basic connection');
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error) {
      throw error;
    }
    console.log('✅ Connected to Supabase successfully\n');
    results.passed++;
  } catch (error: any) {
    console.error('❌ Failed to connect:', error.message, '\n');
    results.failed++;
    results.errors.push(`Connection failed: ${error.message}`);
  }

  // Test 2: Users table
  console.log('Test 2: Users table access');
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ email: testEmail })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`✅ Created test user: ${testEmail}`);

    // Clean up
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', newUser.id);

    if (deleteError) throw deleteError;
    console.log('✅ Deleted test user\n');
    results.passed++;
  } catch (error: any) {
    console.error('❌ Users table test failed:', error.message, '\n');
    results.failed++;
    results.errors.push(`Users table: ${error.message}`);
  }

  // Test 3: Flight searches table
  console.log('Test 3: Flight searches table access');
  try {
    const { data, error } = await supabase
      .from('flight_searches')
      .select('count');
    if (error) throw error;
    console.log('✅ Flight searches table accessible\n');
    results.passed++;
  } catch (error: any) {
    console.error('❌ Flight searches table test failed:', error.message, '\n');
    results.failed++;
    results.errors.push(`Flight searches table: ${error.message}`);
  }

  // Test 4: Price alerts table
  console.log('Test 4: Price alerts table access');
  try {
    const { data, error } = await supabase
      .from('price_alerts')
      .select('count');
    if (error) throw error;
    console.log('✅ Price alerts table accessible\n');
    results.passed++;
  } catch (error: any) {
    console.error('❌ Price alerts table test failed:', error.message, '\n');
    results.failed++;
    results.errors.push(`Price alerts table: ${error.message}`);
  }

  // Test 5: Conversations table
  console.log('Test 5: Conversations table access');
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('count');
    if (error) throw error;
    console.log('✅ Conversations table accessible\n');
    results.passed++;
  } catch (error: any) {
    console.error('❌ Conversations table test failed:', error.message, '\n');
    results.failed++;
    results.errors.push(`Conversations table: ${error.message}`);
  }

  // Test 6: Outbound clicks table
  console.log('Test 6: Outbound clicks table access');
  try {
    const { data, error } = await supabase
      .from('outbound_clicks')
      .select('count');
    if (error) throw error;
    console.log('✅ Outbound clicks table accessible\n');
    results.passed++;
  } catch (error: any) {
    console.error('❌ Outbound clicks table test failed:', error.message, '\n');
    results.failed++;
    results.errors.push(`Outbound clicks table: ${error.message}`);
  }

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('TEST SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('═══════════════════════════════════════\n');

  if (results.failed > 0) {
    console.log('❌ ERRORS:\n');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
    console.log('\n');
    console.log('💡 Next steps:');
    console.log('1. Make sure you ran supabase_schema.sql in your Supabase SQL editor');
    console.log('2. Check your environment variables in .env.local');
    console.log('3. Verify your Supabase project is active');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed! Your database is ready to use.');
    console.log('\n💡 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Start chatting with Wingman!');
  }
}

testConnection().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
