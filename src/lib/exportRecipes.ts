import * as XLSX from 'xlsx';
import type { Recipe } from './types/recipe';

/**
 * Exportiert alle Rezepte als Excel-Datei (.xlsx).
 * Jedes Rezept = eine Zeile. Zutaten und Zubereitung als lesbarer Text.
 */
export function exportRecipesToExcel(recipes: Recipe[]): void {
  const rows = recipes.map(r => ({
    'Titel': r.titel,
    'Beschreibung': r.beschreibung ?? '',
    'Portionen': r.portionen,
    'Zeit (Min)': r.zubereitungszeit_min ?? '',
    'Schwierigkeit': r.schwierigkeit ?? '',
    'Kategorie': (r.kategorie ?? []).join(', '),
    'Tags': (r.tags ?? []).join(', '),
    'Typ': r.recipe_type ?? '',
    'Quelle': r.source ?? '',
    'Zutaten': (r.zutaten ?? [])
      .map(z => {
        const menge = z.menge != null ? `${z.menge}${z.einheit ? ' ' + z.einheit : ''}` : (z.einheit ?? 'n.G.');
        return `${menge} ${z.name}${z.hinweis ? ` (${z.hinweis})` : ''}`;
      })
      .join('\n'),
    'Zubereitung': (r.zubereitung ?? [])
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n'),
    'Bild-URL': r.bild_url ?? '',
    'Erstellt am': r.created_at ? new Date(r.created_at).toLocaleDateString('de') : '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Spaltenbreiten
  ws['!cols'] = [
    { wch: 35 },  // Titel
    { wch: 50 },  // Beschreibung
    { wch: 10 },  // Portionen
    { wch: 10 },  // Zeit
    { wch: 14 },  // Schwierigkeit
    { wch: 20 },  // Kategorie
    { wch: 25 },  // Tags
    { wch: 14 },  // Typ
    { wch: 14 },  // Quelle
    { wch: 50 },  // Zutaten
    { wch: 80 },  // Zubereitung
    { wch: 50 },  // Bild-URL
    { wch: 14 },  // Erstellt am
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rezepte');

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `mahlzeit-rezepte-${date}.xlsx`);
}
