import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { RECIPE_PARSER_SYSTEM_PROMPT, formatRecipeFewShotExamples } from '../src/lib/prompts/recipeParserPrompt.ts';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname,'../.env.local'),'utf8'); const c:Record<string,string>={};
env.split('\n').forEach(l=>{const i=l.indexOf('=');if(i>0)c[l.slice(0,i).trim()]=l.slice(i+1).trim();});
async function test(provider:string){
  const q=`${c.VITE_SUPABASE_URL}/rest/v1/recipes?select=titel,source_url,source_caption_raw&source=eq.instagram&source_url=not.is.null&limit=1`;
  const rec=(await(await fetch(q,{headers:{apikey:c.VITE_SUPABASE_ANON_KEY,Authorization:`Bearer ${c.VITE_SUPABASE_ANON_KEY}`}})).json())[0];
  const t0=Date.now();
  const res=await fetch(`${c.VITE_SUPABASE_URL}/functions/v1/import-recipe-from-url`,{
    method:'POST',headers:{'Content-Type':'application/json',apikey:c.VITE_SUPABASE_ANON_KEY,Authorization:`Bearer ${c.VITE_SUPABASE_ANON_KEY}`},
    body:JSON.stringify({url:rec.source_url,manual_caption:rec.source_caption_raw,systemPrompt:RECIPE_PARSER_SYSTEM_PROMPT,fewShotExamples:formatRecipeFewShotExamples(),provider}),
  });
  const d=await res.json(); const z=d.result?.rezept;
  console.log(`[${provider}] HTTP ${res.status} ${Date.now()-t0}ms | ${z?'✅ '+z.titel+' | Zut:'+z.zutaten?.length+' Schritte:'+z.zubereitung?.length+' Dauer:'+(z.zubereitungszeit_min||'✗')+' Schwier:'+(z.schwierigkeit||'✗')+' Tags:'+(z.tags?.length||0):'❌ '+JSON.stringify(d).slice(0,150)}`);
}
async function main(){ await test('groq'); await test('claude'); }
main().catch(e=>{console.error(e);process.exit(1);});
