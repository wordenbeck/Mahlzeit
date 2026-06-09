// Vercel Edge Function — liefert HTML mit schema.org/Recipe JSON-LD
// damit die Bring-App die Einkaufsliste importieren kann.
//
// Aufruf von Bring:
//   GET https://mahlzeit123.vercel.app/api/bring?items=BASE64
//
// items = btoa(JSON.stringify([{ n: string, m: number, e: string }, ...]))
// n = name, m = menge, e = einheit

export const config = { runtime: 'edge' };

type Item = { n: string; m: number; e: string };

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const raw = url.searchParams.get('items');

  let items: Item[] = [];
  if (raw) {
    try {
      items = JSON.parse(atob(decodeURIComponent(raw)));
    } catch {
      return new Response('Invalid items parameter', { status: 400 });
    }
  }

  if (items.length === 0) {
    return new Response('No items', { status: 400 });
  }

  // "500 g Mehl" / "2 Stk Avocado" / "Salz" (ohne Menge)
  const ingredients = items.map(i =>
    i.m > 0 ? `${fmt(i.m)} ${i.e} ${i.n}`.trim() : i.n
  );

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: 'Mahlzeit Einkaufsliste',
    author: { '@type': 'Organization', name: 'Mahlzeit' },
    recipeIngredient: ingredients,
  };

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mahlzeit Einkaufsliste</title>
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <h1>Mahlzeit Einkaufsliste</h1>
  <p>${ingredients.length} Zutaten</p>
  <ul>${ingredients.map(i => `<li>${i}</li>`).join('\n  ')}</ul>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}
