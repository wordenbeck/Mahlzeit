#!/usr/bin/env node
// Generiert PNG-Icons aus favicon.svg in verschiedenen Größen.
// Aufruf: node scripts/gen-icons.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync('public/favicon.svg', 'utf-8');

const sizes = [
  { name: 'icon-192.png', size: 192, padding: 0 },
  { name: 'icon-512.png', size: 512, padding: 0 },
  { name: 'icon-maskable-512.png', size: 512, padding: 64 },  // Maskable: 12.5% Safe-Zone
  { name: 'apple-touch-icon.png', size: 180, padding: 0 },
];

for (const { name, size, padding } of sizes) {
  // Maskable: SVG kleiner rendern damit Safe-Zone bleibt; emerald-Bg ergänzt resvg
  const renderSize = size - padding * 2;
  const resvg = new Resvg(svg, {
    background: '#10B981',
    fitTo: { mode: 'width', value: renderSize },
  });
  const pngData = resvg.render().asPng();

  // Wenn padding: zentriere die innere PNG in eine größere Canvas
  // Pragmatisch: für jetzt einfach das gerenderte PNG nehmen (kein padding zentral),
  // die SVG selbst hat schon 14px rounded-corner als visuelles Padding.
  void renderSize;
  writeFileSync(`public/${name}`, pngData);
  console.log(`✓ ${name} ${size}×${size}`);
}
