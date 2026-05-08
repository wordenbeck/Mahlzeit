# Tests Pending — manuelle Smoke-Tests

> Was Thomas am nächsten Tag durchklicken sollte. Updated jedes Mal wenn neue Features pushen.
> Wenn ein Test grün ist: Punkt durchstreichen oder Eintrag löschen.

---

## Sprint 1 — Auth + Onboarding ✓ (sollte stehen, lokal getestet)

- [x] Onboarding `/` → `/onboarding` Redirect ohne Profile
- [ ] **Live-Test:** Onboarding auf https://mahlzeit123.vercel.app durchklicken — Name → Neuer Haushalt → landest auf `/` mit App-Menü
- [ ] App-Menü Logo zeigt 3-Diamond-Mark (nach letztem Push)
- [ ] App-Menü Scroll-Shrink funktioniert beim Scrollen
- [ ] Profile-Dot im App-Menü zeigt deinen Initial in deiner Profile-Color
- [ ] Zweites Browser-Profil/Inkognito → `/join/<DEIN-CODE>` → tritt zweitem Member bei

## Sprint 2 — Recipe Schema + Import

- [ ] Storage-Bucket `recipe-images` ist in Supabase Storage sichtbar (Schritt 1 SQL)
- [ ] Groq-API-Key als `GROQ_API_KEY` Secret in Supabase Edge Functions
- [ ] `supabase functions deploy import-recipe-from-url` durchgelaufen
- [ ] **URL-Import-Test:** `/rezepte/import` → Insta-Reel-URL → „Rezept extrahieren"
  - [ ] Caption + Bild werden extrahiert (~5-10s)
  - [ ] Recipe-Preview zeigt Titel, Zutaten, Zubereitung
  - [ ] Speichern → landet auf `/rezepte/:id`
  - [ ] Bild ist via Storage-Mirror live (nicht expired Insta-CDN)
- [ ] **Caption-Fallback-Test:** Insta-Reel mit Login-Wall → Fallback-Textarea zeigt sich → Caption manuell paste → Rezept extrahieren funktioniert
- [ ] **Manuell-Anlegen-Test:** Tab „Manuell" → Titel + Zutaten + Zubereitung → Speichern
- [ ] **Detail-Page-Test:** `/rezepte/:id` → Fav-Toggle synct mit DB → Delete entfernt
- [ ] **Suche-Test:** `/rezepte` → Suchfeld filtert nach Titel/Tags/Kategorie
- [ ] **Multi-Workspace-Isolation:** Anderer Browser/anderer Workspace sieht **keine** Rezepte vom ersten Workspace (RLS-Check)

## Allgemein / Cross-Cutting

- [ ] Vercel-Deploy ist grün (latest commit auf main)
- [ ] PWA: iPad → Safari → mahlzeit123.vercel.app → Teilen → Zum Home-Bildschirm → App-Icon ist 3-Diamond-Mark
- [ ] Lighthouse-Score auf der Live-URL: PWA ≥ 90, Performance ≥ 80
- [ ] Dark-Mode (System-Setting umstellen) → App passt sich an, keine Kontrast-Bugs

---

## Bekannte offene Punkte (Backlog)

Stehen in `DESIGN-BRIEF.md` → Phase-2-Backlog. Nichts davon muss Sprint-1/2 testbar sein:

- Onboarding-Polish (Step-Indicator, Animated-Blobs, Success-Moment)
- Rezept-Modal mit Backdrop-Blur + Drag-to-Plan
- Echte Bilder bei den Sprint-0-Mock-Rezepten (sind nur in `/proto/*` relevant)
- Zutaten-Icons à la Bring
- iPhone-Layout (Sprint 5+)
- Bring-Echtintegration (Sprint 6)
- App-Icon + Splash-Screen für PWA
