# MealPlanner — Anforderungen (aus Thomas-Feedback)

**Aktualisiert:** 2026-06-03 (nach Web Share Target + Bug Fixes)

---

## Sprint 14: Familie einladen + echte Woche planen

### Haushalt-System (NICHT QR-Code!)
- ✅ 4-stelliger PIN (statt 6-stelliger Code)
- ✅ Haushalt-Name eingeben
- 📝 UI: Family Members Section mit PIN anzeigen
- 🔍 **FRAGE:** Existiert das schon? Oder brauchen wir Migration?

### "Echte Woche planen"
- Familie lädt App
- Hat ≥10 echte Rezepte verfügbar
- Plant eine echte Woche gemeinsam (nicht nur Test)
- Ziel: Validieren dass Magic-Fill + Drag&Drop funktioniert

**Definition of Done:** Familie hat gemeinsam geplant, 0 Crashes, Feedback gesammelt

---

## Sprint 15: Recipe-Type + Cooking Tracking

### Recipe-Type Dropdown ✅
- Hauptgericht, Beilage, Dessert, Snack, Frühstück, Getränk
- Parser setzt Type automatisch
- Magic-Fill nutzt Type für Vielfalt

### Neue Features (von Miso/Recime inspiriert)
- [ ] **"Als gekocht markieren"** — User kann Rezepte als gekocht abhaken
  - Tracking: Wann wurde gekocht?
  - Impact: History für Recommendations
  
- [ ] **Sterne abgeben (Rating)** — 1-5 Sterne + optional Notiz
  - Ziel: App lernt Geschmack des Users
  - Magic-Fill bevorzugt höher-bewertete Rezepte
  
- [ ] **Notizen hinzufügen** — Pro Rezept Free-Text Notizen
  - Z.B. "Hat zu lange gedauert" oder "Familie liebt es"
  
- [ ] **"Kochbücher"** (Nice-to-Have) — Mehrere Sammlungen (z.B. "Schnelle Rezepte", "Vegan")
  - User kann filtern/auswählen

**Effort:** ~4-5h

---

## Sprint 16: SanaMana Rezepte + Bilder

- ✅ SanaMana-Rezepte in DB (sollte schon sein)
- ✅ **Bilder zu SanaMana-Rezepten** (hast du Originalbilder?)
- [ ] Seeding UI: `/rezepte/sanamana-seed` (ähnlich Image-Seeding)
- [ ] Tags für SanaMana (vegan, proteinreich, abnehmen)

**Frage:** Wo sind die SanaMana-Bilder?

---

## Sprint 17: Concept-System + externe Quellen

### Concept-System ✅
- Tags/Kategorien: Vegan, High-Protein, Schnell, Abnehmen, etc.
- Filter in `/rezepte`
- Magic-Fill: User wählt Konzept → nur die empfehlen

### Externe Quellen (NEW!)
- [ ] Regelmäßig Trend-Rezepte laden (z.B. von Miso/Recime/anderen)
- [ ] Struktur: Cron-Job oder manueller "Refresh"-Button?
- [ ] Quelle: API, Web-Scraping, oder User-Upload?

**Diskussionspunkt:** Wie oft? Woher?

---

## Sprint 18: iPhone-Responsive

✅ Responsive Design  
✅ Mobile-Tap-Targets (≥44px)

**Inspiration von Miso:**
- Optisch aufgeräumt (klare Struktur)
- Kochzeit optisch separiert: Vorbereitung | Kochzeit | Gesamt
- Blöcke verschiebbar (Zutaten, Anleitung, Nährwerte, etc.)

---

## Sprint 19: Lighthouse + Polish (Nachranging)

- Lighthouse Audit (PWA, Performance, Accessibility)
- UI-Polish von Miso-Inspiration

---

## Sprint 20: Shared Library (Nachranging)

- Multi-Family Recipe Sharing (Low-Prio)

---

## Additional Features (Backlog)

- [ ] **PDF-Upload** — User kann Rezepte als PDF hochladen
  - Parser extrahiert Titel/Zutaten/Anleitung?
  - Oder nur speichern + manuell?

---

## Design-Inspiration: Miso

- Sauberes, aufgeräumtes Layout
- Kochzeit klar separiert (Vorbereitung vs. Kochzeit vs. Gesamt)
- Blöcke verschiebbar (User kann Reihenfolge ändern)
- Starke visuelle Hierarchie

---

## Open Questions für Thomas

1. **SanaMana Bilder:** Wo sind die? Hast du die Originalfotos?
2. **Externe Quellen:** Welche Quellen? Wie oft sync?
3. **PDF-Upload:** Nur speichern, oder Parser?
4. **4-stelliger PIN:** Migration nötig oder neu bauen?
