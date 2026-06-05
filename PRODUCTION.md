# PRODUCTION — MealPlanner Status & Runbook

**Last Updated:** 2026-06-05 (Workspace cleanup complete)  
**Status:** ✅ **PRODUCTION READY** — 🚀 Live on https://mahlzeit.vercel.app

---

## 📊 WORKSPACES (Current DB)

| ID | Name | Code | Status | Notes |
|---|---|---|---|---|
| `897fafb5-6b5d-43e2-9556-8d91217bf010` | Wordenbeck | 8991 | **LIVE** | Production workspace (90 recipes) |

**Status:** ✅ Single clean workspace. All test workspaces deleted. All recipes migrated. Database ready for production.

---

## 🗄️ DATABASE MIGRATIONS (DEPLOYED)

### Sprint 14: Recipes Global
```sql
-- All recipes visible to all workspaces (workspace_id = NULL)
-- RLS Policy: SELECT IF workspace_id IS NULL OR workspace_id IN own_workspace
-- Location: supabase/migrations/20260603000000_recipes_shared_global.sql
```

### Sprint 15: Cooking Tracking
```sql
CREATE TABLE recipe_ratings (stars 1-5, notes per user)
CREATE TABLE recipe_history (cooked_at tracking)
CREATE TABLE recipe_notes (household notes)
ALTER TABLE recipes ADD recipe_type (hauptgericht/beilage/etc)
-- Location: supabase/migrations/20260603000001_sprint15_cooking_tracking.sql
```

**✅ Status:** All migrations deployed to Supabase

---

## ✅ COMPLETED SPRINTS

### Sprint 14: Familie einladen
- ✅ Workspace-Settings Page (/workspace)
- ✅ PIN anzeigen + kopieren
- ✅ Family Members list
- ✅ Recipes global (all see 90)
- ✅ RLS-Policies updated

### Sprint 15: Cooking Tracking
- ✅ RecipeRating (1-5 Sterne + Notizen)
- ✅ CookedButton (Gekocht-Tracking)
- ✅ RecipeNotes (Haushalt-Notizen)
- ✅ RecipeTypeSelector (Kategorien)
- ✅ Integrated in RezeptDetail

### Sprint 16: iPhone-Responsive
- ✅ CSS Breakpoints (<600px mobile)
- ✅ Tap-Targets >= 44px
- ✅ Grid → Single-Column on mobile
- ✅ Image responsive
- ✅ iPad + iPhone optimized

### Web Share Target API (Phase 1+2)
- ✅ ShareRecipePage (fetch + parse)
- ✅ ImageSelectionModal (user-controlled)
- ✅ AddRecipeForm integration
- ✅ ShareSuccessPage
- ✅ 61 Integration Tests

---

## 📋 BACKLOG (Next Sprints)

### Sprint 17: Concept-System (6-8h)
- [ ] DB: `concepts` + `recipe_concepts` Tables
- [ ] UI: Filter by Concept in `/rezepte`
- [ ] Magic-Fill: Concept-aware
- [ ] User can create/assign concepts

### Sprint 18: iPhone-Polish (4-5h)
- [ ] Miso-inspired: Kochzeit-Separation
- [ ] Blöcke verschiebbar (Zutaten, Anleitung, etc.)
- [ ] Bottom navigation responsive
- [ ] Lighthouse score >= 80

### Sprint 19: Lighthouse + PWA (3-4h)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] PWA polish

### Sprint 20: Shared Library (6h)
- [ ] Multi-Family recipe sharing
- [ ] QR Code + Code-based sharing
- [ ] Read-only library imports

### Sprint 21+: Backlog (Not Prioritized)
- [ ] External Recipe APIs (Edamam, Spoonacular)
- [ ] PDF Upload
- [ ] Cooking-as-you-go notes
- [ ] Recipe recommendation engine

---

## 🚀 PRE-DEPLOY CHECKLIST

**Before every `git push main`:**

```bash
# 1. Run tests
npm test -- --run

# 2. Build check
npm run build

# 3. TypeScript
npx tsc --noEmit

# 4. Lint
npm run lint

# 5. Commit + Push
git add -A
git commit -m "..."
git push origin main
```

Vercel will auto-deploy if all checks pass.

---

## 🔧 DEPLOYMENT FLOW

```
Local Development
    ↓ (npm test + npm run build pass)
git push origin main
    ↓
Vercel auto-detects push
    ↓
Vercel builds + deploys
    ↓
Live on https://mahlzeit.vercel.app (2-3 min)
```

---

## 📱 TESTING CHECKLIST (Friday)

**Date:** 2026-06-06 (Real-world testing on iOS device)

- [ ] Install PWA on iPhone (Add to Home Screen)
- [ ] Instagram Reel → Share → Appears in share sheet
- [ ] Instagram Reel → Share → App opens → Caption parsed correctly
- [ ] Parse result → Save recipe → Appears in /rezepte
- [ ] Rating (RecipeRating) works on saved recipe
- [ ] "Gekocht markieren" (CookedButton) tracks correctly
- [ ] RecipeNotes persists
- [ ] Mobile layout (iPhone 12/13): text readable, tap-targets >= 44px
- [ ] iPad layout: grid OK, sticky ingredients OK
- [ ] Performance: No lag on image load or recipe save
- [ ] Network: Works on 4G (throttle in DevTools to test)

---

## 📚 REFERENCE DOCS (in root)

- `CLAUDE.md` — Working rules, tech stack, constraints
- `PROJECT-SPEC.md` — Complete design & architecture
- `SETUP.md` — Development environment setup
- `README.md` — Project overview

**Archived docs:** See `.archive/` folder

---

## 🔐 IMPORTANT CONSTRAINTS

- ✅ Free-tier only (Supabase 500MB, Vercel 100GB)
- ✅ No external UI libraries (Tailwind, shadcn, etc.)
- ✅ TypeScript strict mode
- ✅ Vanilla CSS (own design system)
- ✅ PWA-compliant

---

## 💡 NOTES FOR NEXT DEVELOPER

1. **Identity Model:** Anonymous Auth + Workspace-based (no user login)
2. **Recipes:** All 90 are GLOBAL (workspace_id = NULL)
3. **RLS:** Workspace-scoped for new data (ratings, notes, history)
4. **Database:** Separate tables for tracking (not mixed into recipes)
5. **Tests:** 61 integration tests cover critical paths
6. **Migrations:** All in `supabase/migrations/` numbered by timestamp

---

## 🎯 CURRENT FOCUS

**Freitag (Tomorrow):** Real-world Web Share Target testing  
**Next Week:** Sprint 17 (Concept-System) if feedback positive  
**Ongoing:** Monitor Lighthouse scores, user feedback

---

**Questions?** Check CLAUDE.md for working style, PROJECT-SPEC.md for architecture.
