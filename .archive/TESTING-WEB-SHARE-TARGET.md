# Web Share Target API Testing Guide

> For Friday Testing: Complete flow for sharing Instagram recipes directly into MealPlanner

---

## Quick Test Flow

### 1. **Open MealPlanner on Mobile (iOS/iPad)**

- Navigiere zu: `https://mahlzeit.vercel.app` (Vercel Preview URL)
- Stelle sicher dass du **als User logged in** bist (mit Display Name)

### 2. **Open Instagram Reel with Recipe**

Empfohlene Testquellen:
- **@schmaleschulter** (931K Follower, viele Video-Rezepte)
  - z.B. Pasta Carbonara, Knödel, Kaiserschmarrn
- **@just.laura.cooks** (Schnelle Rezepte)
- **@fitmitlena** (Fitness-Rezepte)

### 3. **Share to MealPlanner**

**Flow:**
```
Reel öffnen 
  → Tippen auf "Share" (Pfeil-Icon rechts)
  → Scrollen bis du "Mahlzeit" siehst
  → "Mahlzeit" tippen
  → App öffnet sich automatisch
```

### 4. **ShareRecipePage wird geladen**

**Was passiert:**
- Spinner: "Instagram wird gelesen und mit KI analysiert..."
- Hinter den Kulissen:
  1. Fetched Instagram caption via og:description meta tag
  2. Sendet zu Groq Edge Function
  3. LLM parst caption → JSON
  4. Füllt Form vor

**Expected Zeit:** 2-3 Sekunden

### 5. **Form wird vorausgefüllt angezeigt**

**Sollte folgendes zeigen:**
- ✅ Rezept-Titel (von LLM geparst)
- ✅ Zutaten-Liste (zeilenweise)
- ✅ Zubereitung (Schritte)
- ✅ Optionale Felder: Zeit + Schwierigkeit
- ⚠️ Gelber Hinweis falls Parsing fehlgeschlagen

**Wenn LLM fehlschlägt:**
- Error message: "LLM-Parsing fehlgeschlagen, verwende Fallback..."
- Button "Manuell bearbeiten" erscheint
- User kann Daten manuell eintragen

### 6. **Rezept checken + speichern**

**User kann:**
- ✏️ Titel ändern (z.B. kürzer/präziser)
- ✏️ Zutaten adjustieren (fehlende ergänzen)
- ✏️ Zubereitung korrigieren
- ⏱️ Zubereitungszeit hinzufügen (optional)
- 📊 Schwierigkeit setzen (einfach/mittel/aufwendig)

**Dann:** "✅ Speichern" Button klicken

### 7. **Success Screen**

**Nach erfolgreichem Speichern:**
- Celebratory screen mit "✅ Rezept gespeichert!"
- Recipe name wird angezeigt
- Auto-redirect zu Rezept-Details nach 3 Sekunden
- User kann "Jetzt anschauen →" Button klicken

### 8. **Recipe Detail Page**

**Recipe sollte angezeigt werden mit:**
- ✅ Titel + Bild (falls noch kein Bild: placeholder)
- ✅ Zutaten-Liste (formatiert)
- ✅ Zubereitung (nummeriert 1. 2. 3...)
- ✅ Zubereitungszeit + Schwierigkeit Badge
- ✅ "source: instagram" (in DB)

---

## Test Scenarios

### ✅ Happy Path

```
Instagram Reel (deutsches Rezept)
  → Share to Mahlzeit
  → Caption wird korrekt geparst
  → Form vorausgefüllt
  → User speichert
  → Recipe in Rezepte-Seite sichtbar
```

**Expected:** ~5 Sekunden Ende-zu-Ende

---

### ⚠️ Fallback: LLM Error

```
Instagram Reel (schlechte Caption oder Groq-Fehler)
  → ShareRecipePage mit Error-Hinweis
  → User klickt "Manuell bearbeiten"
  → Form wird leer oder mit Regex-Fallback gefüllt
  → User trägt manuell ein
  → Speichern funktioniert normal
```

**Expected:** Regex-Fallback reicht aus für simple Captions

---

### 🏠 Manual Entry (No Instagram)

Wenn Testing ohne Instagram:
1. Gehe zu `/rezepte`
2. Button "Rezept hinzufügen" (falls vorhanden) oder...
3. Öffne `/share` mit leerer IndexedDB (clearer Browser)
4. Form sollte empty sein
5. User trägt manuell ein

---

## Debugging Tips

### Browser Console (F12)

**Logs zu checken:**
```
[ShareRecipePage] Calling parse-recipe-caption Edge Function...
[ShareRecipePage] Groq parse success: { titel, zutaten, zubereitung }
```

**Errors zu checken:**
```
Failed to fetch Instagram caption
Groq parse error
Parse error
```

### IndexedDB (DevTools → Application → IndexedDB)

**Expected:**
```
Database: MealPlannerDB (v2)
ObjectStore: shared-recipes
  ├─ timestamp: 1717417200123
  ├─ title: "Recipe name from Instagram"
  ├─ text: "..."
  └─ url: "https://instagram.com/reel/..."
```

---

## Known Limitations & Workarounds

### 🟨 Instagram Caption Nicht vollständig abrufbar

**Problem:** Manchmal fetcht og:description nur erste 150 Zeichen

**Workaround:** 
- Groq parst trotzdem mit besten Vermutungen
- User kann manuell nachbearbeiten

### 🟨 Groq API Quota

**Problem:** Groq Free Tier hat 14k requests/day Limit

**Workaround:**
- Regex Fallback kicks in automatically
- User kann manuell eintippen

### 🟨 Service Worker Registration

**Problem:** SW muss manuell aktualisiert werden wenn öfter gebaut wird

**Expected:**
```
[App] Custom Share SW registered: /
[App] PWA Service Worker registered: /
```

---

## Success Checklist

Alle Punkte bis Freitag getestet:

- [ ] Instagram Reel mit deutschem Rezept teilen
- [ ] MealPlanner öffnet sich automatisch
- [ ] Caption wird geparst (Groq erfolg oder Fallback)
- [ ] Form wird vorausgefüllt
- [ ] User kann editieren
- [ ] Rezept speichert erfolgreich
- [ ] Success Screen angezeigt
- [ ] Rezept in Rezepte-Seite sichtbar
- [ ] Rezept hat korrekte Daten (titel, zutaten, zubereitung)
- [ ] Browser Console zeigt keine Errors

---

## Noch zu testen (Future)

- [ ] Englische Instagram Captions (Groq sollte auch Englisch können)
- [ ] Multiple Rezepte in Folge teilen (IndexedDB persistence)
- [ ] Offline Mode (Service Worker sollte cachen)
- [ ] iPad Split View / multitasking
- [ ] Network Error Recovery

---

**Ready für Friday!** 🚀
