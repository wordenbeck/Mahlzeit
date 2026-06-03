import * as fs from 'fs';

const content = fs.readFileSync('../MealPlanner-Spec/Sanamana Rezepte/Rezepte_Batch_2.md', 'utf-8');

// Count h1 headers
const h1Match = content.match(/^# [^\n]+/gm);
console.log(`H1 headers: ${h1Match?.length || 0}`);
h1Match?.forEach((m, i) => console.log(`  ${i+1}. ${m.substring(0, 60)}`));

// Check for "Zutaten" sections
const zutatensMatch = content.match(/^## Zutaten/gm);
console.log(`\nZutaten sections: ${zutatensMatch?.length || 0}`);

// Check content structure
const lines = content.split('\n');
console.log(`\nFirst 20 lines:`);
lines.slice(0, 20).forEach((l, i) => console.log(`${i+1}: ${l.substring(0, 80)}`));
