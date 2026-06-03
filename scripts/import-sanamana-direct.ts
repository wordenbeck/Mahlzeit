/**
 * Import SanaMana Recipes directly to Supabase DB
 * No SQL, pure TypeScript with Supabase SDK
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const supabaseUrl = process.env.VITE_SUPABASE_URL;

let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not set');
  process.exit(1);
}

interface ParsedRecipe {
  titel: string;
  zubereitung: string;
  zutaten: string[];
  zubereitungszeit_min?: number;
}

const seenTitles = new Set<string>();

function parseMarkdownRecipes(content: string): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];
  let recipeBlocks = content.split(/\n(?=^# )/m);

  if (recipeBlocks.length === 1) {
    recipeBlocks = content.split(/\n(?=^## )/m);
  }

  for (const block of recipeBlocks) {
    const lines = block.split('\n');
    const titel = lines[0].replace(/^#+\s+/, '').trim();

    if (!titel || titel.includes('Batch') || titel.includes('Extraktion')) {
      continue;
    }

    if (seenTitles.has(titel.toLowerCase())) {
      continue;
    }
    seenTitles.add(titel.toLowerCase());

    let zubereitungszeit_min: number | undefined;
    let zutaten: string[] = [];
    let zubereitung = '';
    let inZutaten = false;
    let inZubereitung = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      const zeitMatch = line.match(/\*\*Zubereitungszeit:\*?\s*(\d+)\s*Minuten?/i);
      if (zeitMatch) {
        zubereitungszeit_min = parseInt(zeitMatch[1]);
      }

      if (line.match(/^[#]*\s*Zutaten/i) || line.match(/^\*\*Zutaten/i)) {
        inZutaten = true;
        inZubereitung = false;
        continue;
      }

      if (line.match(/^[#]*\s*Zubereitung/i) || line.match(/^\*\*Zubereitung/i)) {
        inZubereitung = true;
        inZutaten = false;
        continue;
      }

      if (line.match(/^---/) || line.match(/^[#]{1,2}\s+/)) {
        if (inZutaten || inZubereitung) {
          break;
        }
      }

      if (inZutaten && line.trim() && !line.match(/^[#>]/)) {
        const item = line.replace(/^[-*]\s+/, '').trim();
        if (item) zutaten.push(item);
      }

      if (inZubereitung && line.trim() && !line.match(/^[#>]/)) {
        zubereitung += line + '\n';
      }
    }

    zubereitung = zubereitung.trim();

    if (titel && zutaten.length > 0 && zubereitung) {
      recipes.push({
        titel,
        zutaten,
        zubereitung,
        zubereitungszeit_min,
      });
    }
  }

  return recipes;
}

async function askForServiceKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      '🔑 Enter SUPABASE_SERVICE_ROLE_KEY (or press Ctrl+C to cancel): ',
      (answer) => {
        rl.close();
        resolve(answer);
      }
    );
  });
}

async function importRecipes() {
  console.log('📖 SanaMana Recipe Importer (Direct DB)\n');

  if (!supabaseKey) {
    console.log('⚠️  SERVICE_ROLE_KEY not found in .env');
    supabaseKey = await askForServiceKey();
  }

  if (!supabaseKey) {
    console.error('❌ No service key provided');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const batchDir = path.join(
    process.cwd(),
    '../MealPlanner-Spec/Sanamana Rezepte'
  );

  const files = [
    'rezepte_batch_1.md',
    'Rezepte_Batch_2.md',
    'rezepte_batch_3.md',
  ];

  const allRecipes: ParsedRecipe[] = [];

  for (const file of files) {
    const filePath = path.join(batchDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const recipes = parseMarkdownRecipes(content);
    console.log(`📄 ${file}: ${recipes.length} recipes`);
    allRecipes.push(...recipes);
  }

  console.log(`\n✓ Total parsed: ${allRecipes.length} recipes\n`);

  // Get workspace
  const { data: workspaces, error: wsError } = await supabase
    .from('workspaces')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1);

  if (wsError || !workspaces || workspaces.length === 0) {
    console.error('❌ No workspace found:', wsError?.message);
    process.exit(1);
  }

  const workspaceId = workspaces[0].id;
  console.log(`📦 Using workspace: ${workspaceId}\n`);

  // Prepare data
  const toInsert = allRecipes.map((r) => ({
    titel: r.titel,
    zutaten: r.zutaten,
    zubereitung: r.zubereitung,
    zubereitungszeit_min: r.zubereitungszeit_min || null,
    schwierigkeit: 'medium',
    workspace_id: workspaceId,
    is_shared: true,
  }));

  console.log(`📝 Inserting ${toInsert.length} recipes...\n`);

  const { data, error } = await supabase
    .from('recipes')
    .insert(toInsert)
    .select('id, titel');

  if (error) {
    console.error('❌ Insert failed:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }

  console.log(`✅ Successfully imported ${data?.length || 0} recipes:\n`);
  data?.forEach((r: any) => {
    console.log(`   • ${r.titel}`);
  });

  console.log(`\n🎉 Done! SanaMana recipes are now in the database.`);
}

importRecipes().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
