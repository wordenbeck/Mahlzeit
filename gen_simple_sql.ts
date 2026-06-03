import * as fs from 'fs';
import * as path from 'path';

const seenTitels = new Set<string>();

function parseMarkdownRecipes(content: string) {
  const recipes: any[] = [];
  let recipeBlocks = content.split(/\n(?=^# )/m);
  if (recipeBlocks.length === 1) recipeBlocks = content.split(/\n(?=^## )/m);

  for (const block of recipeBlocks) {
    const lines = block.split('\n');
    const titel = lines[0].replace(/^#+\s+/, '').trim();
    if (!titel || titel.includes('Batch') || titel.includes('Extraktion') || seenTitels.has(titel.toLowerCase())) continue;
    seenTitels.add(titel.toLowerCase());

    let zutaten: string[] = [];
    let zubereitung = '';
    let inZutaten = false, inZubereitung = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^[#]*\s*Zutaten/i) || line.match(/^\*\*Zutaten/i)) { inZutaten = true; inZubereitung = false; continue; }
      if (line.match(/^[#]*\s*Zubereitung/i) || line.match(/^\*\*Zubereitung/i)) { inZubereitung = true; inZutaten = false; continue; }
      if (line.match(/^---/) || line.match(/^[#]{1,2}\s+/)) if (inZutaten || inZubereitung) break;
      if (inZutaten && line.trim() && !line.match(/^[#>]/)) { const item = line.replace(/^[-*]\s+/, '').trim(); if (item) zutaten.push(item); }
      if (inZubereitung && line.trim() && !line.match(/^[#>]/)) zubereitung += line + '\n';
    }

    zubereitung = zubereitung.trim();
    if (titel && zutaten.length > 0 && zubereitung) recipes.push({ titel, zutaten, zubereitung });
  }
  return recipes;
}

const batchDir = path.join(process.cwd(), '../MealPlanner-Spec/Sanamana Rezepte');
const allRecipes: any[] = [];

for (const file of ['rezepte_batch_1.md', 'Rezepte_Batch_2.md', 'rezepte_batch_3.md']) {
  const filePath = path.join(batchDir, file);
  if (fs.existsSync(filePath)) allRecipes.push(...parseMarkdownRecipes(fs.readFileSync(filePath, 'utf-8')));
}

console.log(`BEGIN;\n`);

for (const r of allRecipes) {
  const titel = r.titel.replace(/'/g, "''");
  const zubereitung = r.zubereitung.replace(/'/g, "''");
  const zutatenJson = JSON.stringify(r.zutaten).replace(/'/g, "''");

  console.log(`INSERT INTO recipes (titel, zutaten, zubereitung, schwierigkeit, is_shared, created_at, updated_at) VALUES ('${titel}', '${zutatenJson}'::jsonb, '${zubereitung}', 'medium', true, NOW(), NOW());`);
}

console.log(`\nCOMMIT;`);
