# Tests Pending — Smoke-Test-Liste

> Stand nach Sprint 4 (Sa/So-Test). Punkte abhaken oder löschen wenn grün.

---

## 🔴 Blocker zuerst (ohne diese geht nix)

- [ ] **Vercel-Deploy live** — https://mahlzeit123.vercel.app öffnet sich, kein 500-Fehler
- [ ] Storage-Bucket `recipe-images` ist in Supabase Storage sichtbar
- [ ] `GROQ_API_KEY` als Secret in Supabase Edge Functions
- [ ] `supabase functions deploy import-recipe-from-url` durchgelaufen
- [ ] Onboarding klappt: `/` → `/onboarding` Redirect → Name → Neuer Haushalt → landest auf `/` (Heute-Page)

## 🧪 Happy-Path-Test (in dieser Reihenfolge durchklicken)

1. **Onboarding**
   - [ ] Workspace anlegen mit Namen „Test"
   - [ ] App-Menü oben zeigt Logo + „Mahlzeit", Profile-Dot rechts in deiner Farbe
   - [ ] Scroll-Shrink: nach unten scrollen → Menu kompakter

2. **Erstes Rezept anlegen — manuell**
   - [ ] `/rezepte/import` → Tab „Manuell" → Titel + 3 Zutaten + 2 Schritte → Speichern
   - [ ] Landest auf `/rezepte/:id` mit Detail-Page
   - [ ] Klick Star-Icon → wird Favorit (Star-Fill)

3. **Insta-Reel-Import**
   - [ ] Tab „Aus URL / Insta" → Insta-Reel-URL paste → „Rezept extrahieren"
   - [ ] Nach 5-10s: Recipe-Preview mit Bild, Titel, Zutaten, Zubereitung
   - [ ] Speichern → landest auf Detail
   - [ ] Bild ist sichtbar (sollte aus Storage kommen, nicht Insta-CDN — Browser-Network-Tab → URL prüfen)
   - **Falls Caption-Extraction fehlschlägt:** Fallback-Textarea zeigt sich → Caption manuell paste → erneut extrahieren

4. **Wochenplanung mit D&D**
   - [ ] `/plan` → Recipes rechts, leere Tage links
   - [ ] **D&D-Test:** Recipe lange drücken (250ms) + ziehen → über Tag-Spalte schweben → loslassen → Slot erscheint
   - [ ] Drop-Hint: Tag bekommt mint-Tint beim Drag-Over
   - [ ] Drag-Overlay: Card schwebt mit leichter Rotation
   - [ ] **Click-Path-Test:** Klick auf Recipe (kein Drag) → Modal „Zu welchem Tag?" → Tag+Mahlzeit-Pick → Slot wird angelegt mit gewählter Mahlzeit
   - [ ] Hover über Slot → Trash-Icon → klick → Slot weg
   - [ ] ◀ ▶ Wochen-Navigation funktioniert
   - [ ] „+ Wochenende anzeigen" → Sa+So erscheinen

5. **Wochenübersicht**
   - [ ] `/einkauf` zeigt geplante Rezepte als Spalten mit Zutaten-Listen
   - [ ] Portionen-Stepper (`👥 [-] N [+]`) an Recipe → Mengen scalen live + persistieren (refresh → bleibt)

6. **Einkaufsliste**
   - [ ] `/liste` zeigt konsolidierte Liste aller Zutaten der Woche
   - [ ] Day-Pills zeigen aus welchen Tagen die Zutat kommt
   - [ ] Multi-Tag-Konsolidierung: gleiche Zutat aus 2 Rezepten → Mengen summiert
   - [ ] Mengen-Input editierbar
   - [ ] „Eigene Zutat hinzufügen" → erscheint im Extras-Block
   - [ ] Abhaken-Toggle funktioniert
   - [ ] Trash entfernt Item lokal (Refresh setzt zurück — Persist ist Backlog)

7. **Heute-View (`/`)**
   - [ ] Tageszeit-Begrüßung passt zur Uhrzeit („Guten Morgen", „Mahlzeit", „Guten Abend")
   - [ ] Aktuelles Datum: „Donnerstag, 8. Mai" o.ä.
   - [ ] Heutige Slots werden als große Cards gezeigt (wenn welche geplant)
   - [ ] Click auf Slot → `/rezepte/:id`
   - [ ] Empty-State: zwei CTAs („Spontan zum Plan", „Rezepte stöbern")
   - [ ] 3 Quick-Tiles funktionieren (Plan / Einkauf / Neu)

## 🔁 Multi-User / Sharing

- [ ] **Workspace-Code teilen:** zweiter Browser/Inkognito → `https://mahlzeit123.vercel.app/join/<DEIN-CODE>` → tritt als Lisa o.ä. bei
- [ ] **RLS-Isolation:** dritter Browser → komplett neuer Workspace anlegen → sieht **keine** Rezepte/Plans des ersten
- [ ] **Family-Plan-Test:** Lisa fügt Slot via Plan-Page hinzu → Thomas refreshed → sieht den Slot

## 📱 PWA / Mobile

- [ ] iPad Safari: https://mahlzeit123.vercel.app öffnen
- [ ] Teilen → „Zum Home-Bildschirm" → App-Icon ist 3-Diamond-Mark
- [ ] App vom Home-Screen öffnen → läuft fullscreen, Status-Bar in Emerald
- [ ] D&D auf echtem iPad funktioniert flüssig (nicht laggy)
- [ ] iPhone: Layout läuft (responsive — bisher nicht optimiert, aber crash-frei)

## 🌗 Cross-Cutting

- [ ] Vercel-Deploy ist grün (latest commit auf main)
- [ ] Browser-Console: keine roten Fehler nach dem ersten Page-Load
- [ ] Dark-Mode (System-Setting umstellen) → App passt sich an, alle Texte lesbar
- [ ] Lighthouse-Score auf https://mahlzeit123.vercel.app:
  - PWA ≥ 90
  - Performance ≥ 80
  - Accessibility ≥ 90

## 🐛 Known Issues / wahrscheinliche Stolpersteine

- **Bundle-Size 527kb** — über Vites 500kb-Warning. Funktional nicht kritisch, optimieren wenn Performance leidet
- **Modal vs D&D auf Touch** — Click und Drag über selber Button: bei zu schnellem Tap könnte Modal nicht öffnen wenn Drag-Sensor 8px Distance erkennt
- **`/proto/*`-Pages** sind ungeschützt erreichbar (kein Auth-Guard) — by design für Visual-Reference, aber falls peinlich: zu Auth-Guard hinzufügen
- **Workspace-Code-Lookup ohne Auth** — `joinWorkspaceByCode` macht erst Anonymous-SignIn, dann Lookup. Wenn jemand /join/CODE öffnet ohne Profile, könnte's hängen. Bisher nicht gesehen.

## 📋 Nach den Tests

Was klappt: Häkchen oder Punkt löschen.  
Was nicht klappt: Fehlertext + Browser/Device hier rein, dann ich fixe.  

Format z.B.:
> ❌ D&D auf iPad: Drag startet nicht, Recipe-Card scrollt mit
> Browser: Safari iPad Pro 11", iOS 17.4
