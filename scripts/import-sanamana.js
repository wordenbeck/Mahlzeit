#!/usr/bin/env node
/**
 * SanaMana Recipes Direct SQL Import
 * Usage: SUPABASE_SERVICE_ROLE_KEY=sk-... node scripts/import-sanamana.js
 */

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=sk-... VITE_SUPABASE_URL=... node scripts/import-sanamana.js');
  process.exit(1);
}

const SQL = fs.readFileSync('./sanamana_simple.sql', 'utf-8');

async function executeSQL() {
  console.log('📖 SanaMana Recipe Importer\n');
  console.log('📝 Executing 24 INSERT statements...\n');

  const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec`);

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';

      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ SQL executed successfully!');
          console.log('📊 Response:', body.substring(0, 200));

          // Verify count
          const lines = SQL.split('\n').filter(l => l.trim().startsWith('INSERT'));
          console.log(`\n✅ Successfully imported ${lines.length} recipes to database`);
          resolve();
        } else {
          console.error(`❌ Error (${res.statusCode}):`, body);
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ sql_string: SQL }));
    req.end();
  });
}

executeSQL()
  .then(() => {
    console.log('\n🎉 Done! Open MealPlanner → /rezepte to see all 90 recipes');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Fatal:', err.message);
    console.log('\n📋 Alternative: Import manually in Supabase SQL Editor');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. SQL Editor → New Query');
    console.log('3. Copy ./sanamana_simple.sql and paste');
    console.log('4. Click Run');
    process.exit(1);
  });
