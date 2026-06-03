import * as fs from 'fs';
import * as path from 'path';

const seenTitels = new Set<string>();

function parseMarkdownRecipes(content: string) {
  const recipes: any[] = [];
  let recipeBlocks = content.split(/\n(?=^# )/m);

  if (recipeBlocks.length === 1) {
    recipeBlocks = content.split(/\n(?=^## )/m);
  }

  for (const block of recipeBlocks) {
    const lines = block.split('\n');
    const titel = lines[0].replace(/^#+\s+/, '').trim();

    if (
      !titel ||
      titel.includes('Batch') ||
      titel.includes('Extraktion') ||
      seenTitels.has(titel.toLowerCase())
    ) {
      continue;
    }
    seenTitels.add(titel.toLowerCase());

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
        zubereitungszeit_min: zubereitungszeit_min || null,
      });
    }
  }

  return recipes;
}

const batchDir = path.join(process.cwd(), '../MealPlanner-Spec/Sanamana Rezepte');
const files = ['rezepte_batch_1.md', 'Rezepte_Batch_2.md', 'rezepte_batch_3.md'];
const allRecipes: any[] = [];

for (const file of files) {
  const filePath = path.join(batchDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    allRecipes.push(...parseMarkdownRecipes(content));
  }
}

console.log(`// Generated: ${allRecipes.length} recipes\n`);
console.log('const recipes = [');

allRecipes.forEach((r, idx) => {
  const zutatenStr = JSON.stringify(r.zutaten);
  const zubereitungStr = JSON.stringify(r.zubereitung);

  console.log(`  {
    titel: ${JSON.stringify(r.titel)},
    zutaten: ${zutatenStr},
    zubereitung: ${zubereitungStr},
    zubereitungszeit_min: ${r.zubereitungszeit_min},
  }${idx < allRecipes.length - 1 ? ',' : ''}
`);
});

console.log('];');
