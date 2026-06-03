/**
 * Execute SanaMana SQL import directly to Supabase
 * Usage: SUPABASE_SERVICE_ROLE_KEY=sk-... npx tsx scripts/execute-sanamana-import.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not set');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=sk-... npx tsx scripts/execute-sanamana-import.ts');
  process.exit(1);
}

async function executeImport() {
  console.log('📖 SanaMana Recipe Importer\n');

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read SQL file
  const sqlPath = './sanamana_simple.sql';
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log(`📄 Reading SQL from ${sqlPath}...`);
  console.log(`📝 Executing SQL transaction...\n`);

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: sql,
    }).single();

    if (error) {
      console.error('❌ SQL execution failed:', error);
      process.exit(1);
    }

    console.log('✅ SQL executed successfully!');
    console.log('📊 Result:', data);

    // Verify recipes were inserted
    const { count, countError } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n✅ Total recipes in database: ${count}`);
    }

  } catch (err: any) {
    console.error('❌ Error:', err.message);

    // If exec_sql doesn't exist, try alternative approach
    if (err.message.includes('exec_sql')) {
      console.log('\n⚠️  exec_sql function not available. Please execute the SQL manually:');
      console.log('1. Open https://supabase.com/dashboard');
      console.log('2. Go to SQL Editor');
      console.log(`3. Copy contents of ${sqlPath}`);
      console.log('4. Paste and click Run');
    }

    process.exit(1);
  }
}

executeImport().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
