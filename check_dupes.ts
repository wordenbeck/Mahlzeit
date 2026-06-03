import * as fs from 'fs';
import * as path from 'path';

interface ParsedRecipe {
  titel: string;
}

function parseMarkdownRecipes(content: string): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];
  let recipeBlocks = content.split(/\n(?=^# )/m);
  if (recipeBlocks.length === 1) {
    recipeBlocks = content.split(/\n(?=^## )/m);
  }

  for (const block of recipeBlocks) {
    const lines = block.split('\n');
    const titel = lines[0].replace(/^#+\s+/, '').trim();
    if (titel) {
      recipes.push({ titel });
    }
  }

  return recipes;
}

const batchDir = path.join(process.cwd(), '../MealPlanner-Spec/Sanamana Rezepte');
const files = ['rezepte_batch_1.md', 'Rezepte_Batch_2.md', 'rezepte_batch_3.md'];
const allTitels: string[] = [];

for (const file of files) {
  const filePath = path.join(batchDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const recipes = parseMarkdownRecipes(content);
    recipes.forEach(r => allTitels.push(r.titel));
    console.log(`${file}:`);
    recipes.forEach((r, i) => console.log(`  ${i + 1}. ${r.titel}`));
  }
}

console.log(`\n=== GESAMT: ${allTitels.length} Rezepte ===\n`);

// Check for dupes
const seen = new Set<string>();
const dupes: string[] = [];

allTitels.forEach(titel => {
  const lower = titel.toLowerCase();
  if (seen.has(lower)) {
    dupes.push(titel);
  }
  seen.add(lower);
});

if (dupes.length > 0) {
  console.log(`⚠️  DUBLETTEN GEFUNDEN (${dupes.length}):`);
  dupes.forEach(d => console.log(`  • ${d}`));
} else {
  console.log(`✅ Keine Dubletten gefunden`);
}
