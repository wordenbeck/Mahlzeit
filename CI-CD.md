# CI/CD Setup - GitHub Actions

Automated testing, building, and deployment on every push/PR.

## Workflows

### 1. `test.yml` - Tests & Build Check

**Runs on:** `push` to main/develop, `pull_request` to main/develop

**Matrix:** Node 18.x, 20.x (parallel)

**Steps:**
- ✅ Lint code (ESLint)
- ✅ Run all tests (Vitest)
- ✅ Generate coverage report
- ✅ Upload to Codecov
- ✅ Build TypeScript
- ✅ Type check

**Critical Test Suite:**
- Ingredient parsing (21 tests)
- Error handling (27 tests)
- Image modal (13 tests)
- Integration (6 scenarios)

**Fails if:**
- ❌ Tests fail
- ❌ Build fails
- ❌ TypeScript errors

---

### 2. `deploy-preview.yml` - Direct Production Deployment

**Runs on:** `push` to main only

**Steps:**
- ✅ Test first (MUST PASS!)
- ✅ Build project
- ✅ Deploy directly to production

**Production URL:**
- **main → Production:** `https://mahlzeit.vercel.app`

**Secrets Required:**
```
VERCEL_TOKEN          - Vercel authentication
VERCEL_ORG_ID         - Vercel organization ID
VERCEL_PROJECT_ID     - Vercel project ID
VITE_SUPABASE_URL     - Supabase URL
VITE_SUPABASE_ANON_KEY - Supabase anon key
GITHUB_TOKEN          - Auto-generated, no config needed
```

---

## Setup Instructions

### 1. GitHub Secrets

```bash
# In GitHub repo: Settings → Secrets and variables → Actions
# Add these:

VERCEL_TOKEN           (from https://vercel.com/account/tokens)
VERCEL_ORG_ID          (from Vercel project)
VERCEL_PROJECT_ID      (from Vercel project)
VITE_SUPABASE_URL      (from .env.local)
VITE_SUPABASE_ANON_KEY (from .env.local)
```

### 2. Push Code

```bash
git push origin main
# Workflows auto-trigger!
```

### 3. Watch Deployment

```
GitHub → Actions tab → See "Test → Deploy Production" running
Vercel → Deployments → See new deploy happening
After 2-3 min: App live at https://mahlzeit.vercel.app ✅
```

---

## Expected Behavior

### On Every Push to main:

```
1. GitHub Actions triggers
2. Tests run (Node 18 + 20)
3. Build verified
4. ✅ If all pass → Deploy directly to production!
5. App live at https://mahlzeit.vercel.app
6. Done! 🚀
```

### If Tests Fail:

```
1. Tests fail
2. Build stops
3. NO deployment happens
4. Fix locally
5. Push again
6. Retry automatic
```

### If Tests Fail:

```
1. Build stops
2. PR marked as "failed"
3. Comment shows error details
4. No deploy happens
5. Fix required before merge
```

---

## Monitoring

### GitHub Actions Dashboard

```
Repo → Actions tab
├── test.yml (most recent)
│   ├── Lint
│   ├── Tests (Node 18)
│   ├── Tests (Node 20)
│   ├── Coverage
│   ├── Build
│   └── TypeScript
└── deploy-preview.yml
    ├── Tests
    ├── Build
    └── Deploy to Vercel
```

### Codecov Coverage

```
https://codecov.io/github/wordenbeck/Mahlzeit
├── Overall coverage %
├── Per-file coverage
└── Trend over time
```

### Vercel Deployments

```
https://vercel.com/wordenbeck/mahlzeit
├── Production (main)
├── Preview (develop + PRs)
└── Deployment logs
```

---

## Troubleshooting

### ❌ Tests Fail in CI but Pass Locally

**Cause:** Different Node versions or cached deps

**Fix:**
```bash
npm ci  # Clean install (CI mode)
npm test -- --run  # Same as CI
```

### ❌ Build Fails: "VITE_SUPABASE_URL not found"

**Cause:** Missing environment variables

**Fix:**
1. Go to repo Settings → Secrets
2. Add missing env vars from `.env.local`
3. Re-run workflow

### ❌ Vercel Deploy Fails

**Cause:** Token expired or project ID wrong

**Fix:**
1. Verify `VERCEL_TOKEN` in secrets
2. Check `VERCEL_PROJECT_ID` matches
3. Regenerate token if needed

### ❌ PR Comment Not Showing Preview URL

**Cause:** `GITHUB_TOKEN` permission issue

**Fix:**
1. Check GitHub token has `pull-requests: write`
2. Regenerate token
3. Try again

---

## Best Practices

### Before Pushing:

```bash
# 1. Run tests locally
npm test

# 2. Build locally
npm run build

# 3. Check types
npx tsc --noEmit

# 4. Lint
npm run lint
```

### Reviewing PR Feedback:

```
✅ All checks passed → Safe to merge
❌ Tests failed → Fix and push again
⚠️ Coverage decreased → Add more tests
```

### Deployment Flow:

```
Code locally
    ↓
git push main
    ↓
Tests run automatically ✅
    ↓
Build verified ✅
    ↓
Deploy to production ✅
    ↓
Live at https://mahlzeit.vercel.app ✅
```

---

## Optimization Notes

- Tests run on **2 Node versions** for compatibility
- **Coverage uploaded** to Codecov for tracking
- **Parallel builds** for speed (15min timeout)
- **Preview URL** in PR comment for quick testing
- **Fail-fast** on tests (no build if tests fail)

---

## Next Steps

1. ✅ Add secrets to GitHub
2. ✅ Create first PR (triggers workflow)
3. ✅ Check Vercel preview URL
4. ✅ Monitor coverage trends
5. ✅ Celebrate automated testing! 🎉

---

**Status:** Ready to use!  
**Secrets Needed:** 5 (see setup section)  
**Estimated First Run:** 3-5 minutes
