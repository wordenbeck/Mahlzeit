import * as fs from 'fs';
import * as path from 'path';

const batchDir = path.join(process.cwd(), '../MealPlanner-Spec/Sanamana Rezepte');
const files = [
  'rezepte_batch_1.md',
  'Rezepte_Batch_2.md',
  'rezepte_batch_3.md',
];

console.log(`Checking in: ${batchDir}\n`);

for (const file of files) {
  const filePath = path.join(batchDir, file);
  const exists = fs.existsSync(filePath);
  console.log(`${file}: ${exists ? '✓' : '✗'} (${filePath})`);
}
