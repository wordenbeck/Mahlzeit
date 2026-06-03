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

### 2. `deploy-preview.yml` - Vercel Preview Deployment

**Runs on:** `push` to main/develop, `pull_request` to main

**Steps:**
- ✅ Test first (must pass!)
- ✅ Build project
- ✅ Deploy to Vercel
- ✅ Add GitHub comment with preview URL

**Preview URLs:**
- **PRs:** `https://mealplanner-pr-{NUMBER}.vercel.app`
- **main:** `https://mahlzeit.vercel.app` (production)
- **develop:** `https://mahlzeit-develop.vercel.app` (staging)

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

### 1. Generate Vercel Token

```bash
# Go to https://vercel.com/account/tokens
# Create new token, copy it
```

### 2. Add GitHub Secrets

```bash
# In GitHub repo: Settings → Secrets and variables → Actions

VERCEL_TOKEN=<paste_token>
VERCEL_ORG_ID=<your_org_id>
VERCEL_PROJECT_ID=<your_project_id>
VITE_SUPABASE_URL=<from_.env.local>
VITE_SUPABASE_ANON_KEY=<from_.env.local>
```

### 3. Verify Workflows

```bash
# Check Actions tab in GitHub repo
# Should see workflows triggered on next push
```

---

## Expected Behavior

### On Every Push to main/develop:

```
1. GitHub Actions triggers
2. Tests run (Node 18 + 20)
3. Build verified
4. Deploy to Vercel preview
5. GitHub comment added with URL
6. Production deploy (if main branch)
```

### On Every PR:

```
1. GitHub Actions triggers
2. Tests run (Node 18 + 20)
3. Build verified
4. Deploy to preview URL
5. Comment added to PR with link
6. "All checks passed" ✅
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
Feature branch → PR → Tests pass → Vercel preview
                              ↓
                        Review URL
                              ↓
                        Merge to main
                              ↓
                        Production deploy
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
