# Hand-Off für nächste Session

> Wird nach jeder Sprint-Welle aktualisiert (siehe `CLAUDE.md` → Session-Management). Stand: **Sprint 13** (Edge-Function-Error-Fix + Bulk-Import-Polish + Token-Policy).

---

## Wo wir stehen

App ist **live** auf https://mahlzeit123.vercel.app, voll funktional.

**Sprint 0–13** durch (Mock-Prototypen → Auth → Plan/Einkauf/Liste/Heute → Bulk-Import → Magic Fill → Realtime → PWA → Profile-Polish → Recipe-Edit → Lucide-Icons → ErrorBoundary → Service-Worker → Bulk-Resume → recipe_type → Edge-Error-Fix).

Tech: React + Vite + TS + Supabase + Vercel + Groq.

---

## 🟢 Status Update — Sprint 13.5 (Fortschritt)

✅ **Edge-Function deployed** — Thomas hat `supabase functions deploy import-recipe-from-url` ausgeführt. 500-Fehler-Fix ist live. Frontend kann jetzt echte Groq-Fehlertexte lesen.

---

## 🔴 Sofort-Priorität für nächste Session

### 1. Bulk-Import + Single-Test
Nach Deploy: Bulk-Test wieder probieren. Wenn's immer noch hängt:
- Browser DevTools → Network → `import-recipe-from-url` Request → Response anschauen (jetzt mit echtem Fehlertext)
- Supabase Dashboard → Edge Functions → Logs lesen
- Wahrscheinliche Ursachen: Groq RPM/TPM-Limit, Insta-IP-Block. Dann ggf. Throttle auf 10-15s bumpen.

### 3. `mealplanner-spec/` durchgehen

```
~/Claude Code/CodingDojo/MealPlanner/mealplanner-spec/
  ├── meal-planner-strategy-v1.md  (Gemini-Diskussion zu Anforderungen + Strategie)
  └── SanaMana-Rezepte + Bilder (digitalisiert)
```

→ Lesen, mit Thomas validieren, dann SanaMana importieren. Bilder gehen in Supabase Storage Bucket `recipe-images`, Pfad `{workspace_id}/{recipe_id}.{ext}`.

### 4. SQL-Migration `recipe_type` ist schon applied ✓
Thomas hat in Sprint 12 die Migration durchgeführt.

---

## ⚙️ Status der Recipe-Type-Feature (teilweise drin)

✅ Migration applied, Types erweitert, `/rezepte` Filter-Pills da.

Offen:
- [ ] Recipe-Detail Edit-Mode mit `recipe_type` Select
- [ ] Parser-Prompt: AI soll `recipe_type` automatisch setzen beim Import
- [ ] Magic-Fill könnte type-aware werden

---

## 🐛 Aktuelle Bugs (status nach Sprint 13)

- ❗ **Edge Function 500** — Wurzelfix gepusht, braucht **Deploy** (siehe oben). Vorher hat das Frontend nur „non-2xx" gesehen, jetzt kommt der echte Fehlertext durch.
- ✅ **Dublette nicht erkannt** im Single-Import — gefixt: prüft jetzt vor Edge-Call ob `source_url` schon existiert.
- ✅ **Enter-Taste submitted nicht** im URL-Input — gefixt mit `<form>`-Wrapper.

---

## 📋 Backlog (priorisiert)

### Klein, hoher Impact
- [ ] `mealplanner-spec/meal-planner-strategy-v1.md` validieren mit Thomas
- [ ] SanaMana-Rezepte+Bilder importieren
- [ ] Recipe-Type Edit-Select in RezeptDetail
- [ ] Parser-Prompt: AI setzt `recipe_type` beim Import (kein Function-Deploy nötig, Prompt kommt vom Client)
- [ ] Magic-Fill type-aware

### Mittel
- [ ] Lighthouse-Audit
- [ ] Shared Library als Architecture-Entscheidung (Thomas erwähnte „für alle Haushalte")

### Backlog (niedriger Druck)
- [ ] Refereo-TBD klären
- [ ] iPhone-Polish-Iterationen
- [ ] Konzept-System als eigene Entity

---

## 🚨 Pitfalls (nicht reingerennt)

1. **Service-Role-Key NIE in Frontend** — nur in Edge-Functions
2. **Realtime muss pro Tabelle aktiviert sein** in Supabase → Database → Replication
3. **Workspace-RLS** für neue Tabellen
4. **Profile-Anlage via RPC** (`create_workspace_and_join`) wegen RLS-After-Insert-Gotcha
5. **Bulk-Import läuft im Browser** — Tab muss offen bleiben (Resume klappt aber)
6. **Edge-Function-Deploy ist Thomas-Sache** — Claude kann nicht autonom CLI-deployen
7. **Edge-Function-Errors** müssen mit 200+JSON-Body returnt werden (nicht 500) damit supabase-js den Body lesen kann

---

## 🗂️ Docs im Repo

1. `CLAUDE.md` — Working-Style, Stack, **Session-Management-Policy**
2. `COLLAB-PRINCIPLES.md` — Workflow
3. `PROJECT-SPEC.md` — Komplette Spec
4. `DESIGN-BRIEF.md` — Visual-System + Backlog
5. `SETUP.md` — Account-Setup
6. `TESTS-PENDING.md` — Smoke-Tests
7. `HANDOFF.md` — Dieser File (live state)

---

## Erste Aktion für nächste Session

```
User wird typisch sagen: "lies HANDOFF, dann <thema>"
```

1. HANDOFF.md lesen ✓
2. `git log --oneline -10` checken — wo stehen wir wirklich
3. Wenn Edge-Function-Deploy noch nicht durch: Thomas zum Deploy auffordern
4. Wenn Bulk-Import-Test noch ansteht: gemeinsam testen
5. `mealplanner-spec/` durchgehen
6. Sprint-Plan erstellen basierend auf gefundenen Anforderungen

Don't be afraid to ask clarifying questions.

---

## Session-Management — Quick-Reference

**Wann HANDOFF updaten:**
- Nach jeder Sprint-Welle
- Wenn `/context` >65%
- Vor `/clear`

**Wann `/clear` vorschlagen:**
- `/context` >75%
- Sauberer Breakpoint erreicht (Feature done + committed)
- Lange Session, viele Iterationen

**Was im Repo persistent ist** (siehe CLAUDE.md):
- Architecture → PROJECT-SPEC
- Visual → DESIGN-BRIEF
- Setup → SETUP
- Bugs/Sprint → HANDOFF
- Migrations → supabase/migrations
- Edge-Functions → supabase/functions

Damit ist `/clear` immer schmerzfrei.
