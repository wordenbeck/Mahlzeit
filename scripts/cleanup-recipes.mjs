/**
 * Cleanup: Duplikate entfernen (vollständigstes behalten) + reinen Müll löschen.
 * Schreibt ./cleanup_recipes.sql (DELETEs) + Report.
 * Score = zubereitung.length*10 + zutaten.length → höchster gewinnt.
 */
import * as fs from 'fs';

const env = fs.readFileSync('./.env.local', 'utf-8');
const SUPA = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const ANON = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

const res = await fetch(SUPA + '/rest/v1/recipes?source=eq.instagram&select=id,titel,zutaten,zubereitung,created_at', {
  headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
});
const rows = await res.json();

const norm = t => t.toLowerCase().replace(/[^a-zäöüß0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const score = r => (r.zubereitung || []).length * 10 + (r.zutaten || []).length;
const isComplete = r => {
  const z = (r.zutaten || []).length, b = (r.zubereitung || []).length;
  const a = b ? r.zubereitung.join(' ').length / b : 0;
  return z >= 2 && b >= 2 && a >= 15;
};

// Dup-Relation: zwei Titel sind Duplikate, wenn der kürzere (normalisierte)
// ein PRÄFIX des längeren ist (min. 12 Zeichen) → echte Namensgleichheit,
// kein False-Positive wie "Pockets" vs "Ofentacos".
function isDup(a, b) {
  const na = norm(a.titel), nb = norm(b.titel);
  const [short, long] = na.length <= nb.length ? [na, nb] : [nb, na];
  if (short.length < 12) return na === nb;
  return long.startsWith(short);
}

// Union-Find Gruppierung über isDup
const parent = rows.map((_, i) => i);
const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
const union = (i, j) => { parent[find(i)] = find(j); };
for (let i = 0; i < rows.length; i++)
  for (let j = i + 1; j < rows.length; j++)
    if (isDup(rows[i], rows[j])) union(i, j);
const groupMap = {};
rows.forEach((r, i) => { const root = find(i); (groupMap[root] = groupMap[root] || []).push(r); });
const groups = groupMap;

const toDelete = [];        // Duplikat-Verlierer
const junkDelete = [];      // reiner Müll (kein Dup, zut<2 & zub<2)

for (const g of Object.values(groups)) {
  if (g.length > 1) {
    // sortiere nach Score absteigend, bei Gleichstand ältestes behalten
    g.sort((a, b) => score(b) - score(a) || new Date(a.created_at) - new Date(b.created_at));
    const keep = g[0];
    g.slice(1).forEach(r => toDelete.push({ ...r, keptTitel: keep.titel }));
  } else {
    const r = g[0];
    if ((r.zutaten || []).length < 2 && (r.zubereitung || []).length < 2) junkDelete.push(r);
  }
}

// SQL
let sql = '-- Cleanup: Duplikate + Müll entfernen\nBEGIN;\n\n';
sql += '-- Duplikate (vollständigstes je Gruppe behalten):\n';
toDelete.forEach(r => sql += `DELETE FROM recipes WHERE id = '${r.id}'; -- dup von "${r.keptTitel.slice(0, 40).replace(/'/g, "''")}"\n`);
sql += '\n-- Reiner Müll (kein verwertbares Rezept):\n';
junkDelete.forEach(r => sql += `DELETE FROM recipes WHERE id = '${r.id}'; -- "${r.titel.slice(0, 40).replace(/'/g, "''")}"\n`);
sql += '\nCOMMIT;\n';
fs.writeFileSync('./cleanup_recipes.sql', sql, 'utf-8');

// Report: was bleibt übrig?
const deleteIds = new Set([...toDelete, ...junkDelete].map(r => r.id));
const remaining = rows.filter(r => !deleteIds.has(r.id));
const remComplete = remaining.filter(isComplete).length;

console.log('=== CLEANUP-PLAN ===\n');
console.log('Duplikate löschen:', toDelete.length);
toDelete.forEach(r => console.log(`   🗑️  ${r.titel.slice(0, 42)} (zut:${(r.zutaten||[]).length} zub:${(r.zubereitung||[]).length}) → behalte "${r.keptTitel.slice(0,35)}"`));
console.log('\nReinen Müll löschen:', junkDelete.length);
junkDelete.forEach(r => console.log(`   ❌ ${r.titel.slice(0, 50)}`));
console.log('\n=== ERGEBNIS nach Cleanup ===');
console.log('IG-Rezepte:', rows.length, '→', remaining.length);
console.log('davon komplett:', remComplete);
console.log('+ 24 SanaMana (komplett, mit Bild)');
console.log('= GESAMT komplett:', remComplete + 24);
console.log('\n📝 SQL: ./cleanup_recipes.sql');
