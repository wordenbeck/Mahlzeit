import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RECIPE_PARSER_SYSTEM_PROMPT, formatRecipeFewShotExamples } from '../src/lib/prompts/recipeParserPrompt.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const cfg: Record<string,string> = {};
  env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k&&v.length) cfg[k.trim()]=v.join('=').trim(); });

  const q = `${cfg.VITE_SUPABASE_URL}/rest/v1/recipes?select=titel,source_url,source_author,source_caption_raw&source=eq.instagram&source_url=not.is.null&limit=1`;
  const r = await (await fetch(q, { headers: { apikey: cfg.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${cfg.VITE_SUPABASE_ANON_KEY}` }})).json();
  const rec = r[0];
  console.log('Test-Rezept:', rec.titel, '| Caption:', rec.source_caption_raw.length, 'Zeichen');

  const t0 = Date.now();
  const res = await fetch(`${cfg.VITE_SUPABASE_URL}/functions/v1/import-recipe-from-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: cfg.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${cfg.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      url: rec.source_url,
      manual_caption: rec.source_caption_raw,
      systemPrompt: RECIPE_PARSER_SYSTEM_PROMPT,
      fewShotExamples: formatRecipeFewShotExamples(),
    }),
  });
  const dur = Date.now() - t0;
  const data = await res.json();
  console.log('HTTP', res.status, '|', dur, 'ms | status:', data.status);
  if (data.result?.rezept) {
    const z = data.result.rezept;
    console.log('✅ GROQ PARSED:', z.titel, '| Zutaten:', z.zutaten?.length, '| Schritte:', z.zubereitung?.length);
  } else {
    console.log('Response:', JSON.stringify(data).substring(0, 400));
  }
}
main().catch(e => { console.error(e); process.exit(1); });
