# Starter Prompt — MealPlanner

Copy-paste das **als erste Nachricht** in eine neue Claude-Code-Session im neuen Projekt-Verzeichnis.

---

## Vorbereitung (1 Minute, manuell)

```bash
mkdir -p ~/"Claude Code/CodingDojo/MealPlanner"
cd ~/"Claude Code/CodingDojo/MealPlanner"

# Spec-Files reinkopieren
cp ~/"Claude Code/CodingDojo/MealPlanner-Spec/PROJECT-SPEC.md" .
cp ~/"Claude Code/CodingDojo/MealPlanner-Spec/CLAUDE.md" .
cp ~/"Claude Code/CodingDojo/MealPlanner-Spec/DESIGN-BRIEF.md" .

# Claude Code starten
claude
```

---

## Erste Nachricht (Copy-Paste)

```
Neues Projekt: MealPlanner — iPad-first PWA für Wochenplanung.

Lies in dieser Reihenfolge:
1. COLLAB-PRINCIPLES.md (wie wir arbeiten)
2. PROJECT-SPEC.md (was wir bauen)
3. DESIGN-BRIEF.md (wie es aussehen soll)
4. CLAUDE.md (Tech-Regeln)

Wir starten mit **Sprint 0: Prototyping** (siehe COLLAB-PRINCIPLES).
KEIN Backend, KEIN Supabase, KEIN Auth. Nur statische Prototypen mit
Mock-Daten, damit ich Layout, Flow und Design-Tokens fixe BEVOR
Real-Setup kommt.

Sprint 0 Output:
- Vite+React+TS Projekt-Skelett (kein PWA-Plugin nötig diese Phase)
- 3 Layout-Prototypen für das Plan-Board (iPad Split, je leicht
  unterschiedlich) — Mock-Rezepte hardcoded
- 1 Recipe-Card-Variant-Galerie (3-4 Varianten nebeneinander)
- 1 iPhone-Layout-Sketch (Tabs + Bottom-Sheet)
- Design-Token-File mit subtilen Gradients (siehe DESIGN-BRIEF Gradient-Tokens)

Output-Format: alle Prototypen als separate Routes erreichbar
(/proto/board-a, /proto/board-b, ...) damit ich sie auf dem iPad
durchklicken kann.

Stell mir 3 gezielte Klärungs-Fragen falls offen, dann legen wir los.
```

---

## Was Claude wahrscheinlich fragen wird (Sprint 0)

1. **GitHub Repo:** neu erstellen für die Prototypen, oder lokal lassen?
2. **Mock-Rezepte:** soll ich 8-10 generische Beispiele hardcoden, oder hast du eine Liste mit echten Rezepten parat?
3. **Profile-Colors:** 6 Pastell-Töne aus Design-Brief — fix oder darf ich variieren?

Antworten parat halten. Mehr braucht es für Sprint 0 nicht.

---

## Sprint-Reihenfolge danach

| Sprint | Hand-Off-Prompt (Copy-Paste in neue Session) |
|--------|----------------------------------------------|
| **0** | Siehe oben |
| **1** | "Sprint 0 ist abgenommen. Jetzt Sprint 1: echtes Setup. Supabase-Projekt anlegen, DB-Schema aus PROJECT-SPEC.md Sektion 5 anwenden, Anonymous Auth, Onboarding-Flow real machen. Halte dich an COLLAB-PRINCIPLES (Auto-Pilot-Modus aktiv)." |
| **2** | "Sprint 2: Recipe-Import aus Kalo extrahieren. Lies PROJECT-SPEC.md Sektion 8. Kalo-Pfad: ~/Claude Code/CodingDojo/Kalo. Anpassen: workspace_id und created_by hinzufügen." |
| **3-6** | Analog, jeweils Sprint-Nummer + kurzer Fokus referenzieren |
| **7** | "Design-Pass-Sprint. Lies DESIGN-BRIEF.md. Mach einen Audit der aktuellen Funktional-Version, dann iterativen Polish — Plan-Board zuerst." |

---

## Nach allen Code-Sprints: Design-Pass

Wenn Funktionalität steht, separate Session für Design-Polish:

```
Lies DESIGN-BRIEF.md durch. Mach einen kompletten Design-Pass 
über die App — primär für iPad, dann iPhone-Anpassung. 
Fokus auf das Plan-Board, weil das das Hero-Feature ist. 
Vor jeder größeren Änderung: zeig mir erst einen Mock oder beschreib 
was du machst, dann implementier.
```
