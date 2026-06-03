# Deployment Checklist — Vor jedem Git Push

**Regel:** IMMER diese Schritte vor `git push` machen!

---

## Pre-Push Checklist

### 1. **Tests ausführen** (2 Min)
```bash
npm test -- --run
```
✅ Alle Tests GRÜN?
- Wenn NEIN → Fix lokal, nicht pushen!
- Wenn JA → Weiter zu Schritt 2

### 2. **Build checken** (1 Min)
```bash
npm run build
```
✅ Build erfolgreich?
- Wenn NEIN → TypeScript/Vite Fehler → Fix lokal!
- Wenn JA → Weiter zu Schritt 3

### 3. **TypeScript Check** (1 Min)
```bash
npx tsc --noEmit
```
✅ Keine Type-Fehler?
- Wenn NEIN → Type-Fehler → Fix lokal!
- Wenn JA → Weiter zu Schritt 4

### 4. **Lint checken** (1 Min)
```bash
npm run lint
```
✅ Keine Lint-Fehler?
- Wenn NEIN → ESLint Issues → Fix lokal!
- Wenn JA → SAFE TO PUSH ✅

---

## Dann pushen:

```bash
git add -A
git commit -m "..."
git push
```

⏳ Warten bis Vercel Deploy fertig (2-3 Min)  
✅ Live auf https://mahlzeit.vercel.app

---

## Workflow für neue Features

**Neue Feature? → DEVELOP BRANCH!**

```bash
git checkout -b feature/name
# Code schreiben...
npm test -- --run  # ← PRE-PUSH CHECKLIST!
git push origin feature/name
```

Vercel erstellt automatisch Preview URL.  
Nach Testing: Lokal `git merge main`, dann pushen.

---

## Im Notfall (etwas ist kaput auf live)

1. **App ist broken?**
   ```bash
   git log --oneline -5
   git revert <commit-id>
   git push
   ```

2. **Schnell fixen + pushen:**
   ```bash
   # Fix locally
   npm test -- --run
   npm run build
   git push
   ```

---

## Checkliste als Shell Script (Optional)

Speichern als `pre-push.sh`:

```bash
#!/bin/bash
set -e

echo "🧪 Running tests..."
npm test -- --run || exit 1

echo "🏗️ Building..."
npm run build || exit 1

echo "✅ TypeScript check..."
npx tsc --noEmit || exit 1

echo "🎨 Linting..."
npm run lint || exit 1

echo "✅ All checks passed! Safe to push."
```

**Nutzen:**
```bash
chmod +x pre-push.sh
./pre-push.sh && git push
```

---

## Status: Ready für produktive Nutzung
- ✅ Tests vor Push (lokal)
- ✅ Build-Verifikation
- ✅ Type-Sicherheit
- ✅ Auto-Deploy nach Push

**Keine Überraschungen!** 🚀
