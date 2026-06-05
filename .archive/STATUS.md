# AKTUELLER STATUS — 2026-06-03, 20:00

## ✅ KOMPLETT (diese Session)

- ✅ Web Share Target API (ShareRecipePage + AddRecipeForm + ImageSelectionModal)
- ✅ 61 Integration Tests
- ✅ 7 Critical Bugs gefixt
- ✅ Analytics System
- ✅ Vercel Deploy (live)

---

## 🔴 SOFORT ZU ERLEDIGEN (BLOCKIERT SPRINT 14-16)

### 1. **PIN: 6-stellig → 4-stellig** (0.5h)
**Status:** MUSS NOCH GEMACHT WERDEN
- Migration: `workspaces.code` ändern (Länge + Generierungs-Format)
- Code-Generator anpassen (6-stellig KOCH42 → 4-stellig 1234)
- UI: PIN anzeigen bei Workspace-Join

**File:** `supabase/migrations/20260508120000_initial_schema.sql` Zeile 14

---

### 2. **SanaMana Bilder zu Supabase Storage** (1-2h)
**Status:** HEIC-Dateien existieren lokal, STATUS in Storage UNBEKANNT
- ✅ 25 HEIC-Dateien vorhanden (`MealPlanner-Spec/SanaMana Rezepte/Rezeptbilder/`)
- ❓ Sind sie schon in `recipe-images` Bucket? (DU WISSEN!)
- Wenn NEIN:
  - [ ] HEIC → JPG/WebP konvertieren
  - [ ] Zu Supabase Storage hochladen
  - [ ] `recipes.bild_url` updaten (nur SanaMana Rezepte)

---

### 3. **Externe Rezept-Quellen** (BACKLOG — NICHT PRIORITÄR)
**Status:** Für Sprint 21+ — Später wenn App stabil läuft
- ❌ Chefkoch: Kein API, nur Scraping (problematisch)
- ✅ Edamam: Free API (550 req/day) — dokumentiert in BACKLOG.md

---

## 🟡 BLOCKIERT SPRINT 14

### 4. **Haushalt PIN UI** (1-2h)
**Status:** DB existiert, UI FEHLT
- [ ] `/join` Seite: PIN-Eingabe (4-stellig)
- [ ] `/settings` oder `/workspace`: PIN + Member anzeigen
- [ ] "Familie einladen" → PIN kopieren/teilen

---

## 🟢 NÄCHSTES (SPRINT 15)

### 5. **Cooking Tracking** (3-4h)
- [ ] "Als gekocht markieren"
- [ ] Sterne-Rating (1-5)
- [ ] Notizen pro Rezept
- [ ] Recipe-Type (Hauptgericht/Beilage/etc.)

---

## 🔵 SPÄTER (NICHT BLOCKIERT)

- iPhone-Responsive
- Concept-System
- Lighthouse
- Shared Library
- PDF-Upload

---

## ❓ OFFENE FRAGEN (Antworte KURZ)

1. **SanaMana Bilder:** Sind sie bereits in Supabase `recipe-images` Bucket?
   - JA → Skip Upload, nur `recipes.bild_url` updaten
   - NEIN → Brauchen Upload-Script

2. **Externe Quellen: Format?**
   - Chefkoch: Nur Scraping oder hast du API-Key?
   - Edamam: Hast du API-Key oder sollen wir Free-Tier nutzen?

3. **Cron-Jobs: Wo?**
   - Vercel Functions? Separate Service? Manueller Button?

4. **Übersetzung für Edamam?**
   - Sollen englische Zutaten automatisch zu Deutsch übersetzt werden?

---

## 📊 Effort Summary (PRIORITÄT)

| Task | Effort | Blockiert? | Status |
|------|--------|-----------|--------|
| PIN 6→4 | 0.5h | Sprint 14 | 🔴 SOFORT |
| Haushalt PIN UI | 1-2h | Sprint 14 | 🔴 SOFORT |
| Cooking Tracking | 3-4h | Sprint 15 | 🟡 NÄCHSTES |
| Externe Rezept-API | 2-3h | NEIN | 🔵 BACKLOG (Sprint 21+) |

**Total bis Sprint 15 (Prioritär): ~5-7h**

---

## NÄCHSTES (nach deine Antworten):

1. Antworten auf die 4 Fragen
2. PIN 6→4 Migration + UI (0.5h + 1.5h)
3. SanaMana Bilder Status checken + ggf. Upload
4. Chefkoch + Edamam Integrationen starten
