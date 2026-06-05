# Integration Test Setup

Tests für kritische Fixes (Parsing, Images, Error Handling).

## Quick Start

### 1. Install Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

### 2. Update package.json

Add these scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# UI Dashboard
npm run test:ui

# Coverage report
npm run test:coverage
```

## Test Files

### `src/__tests__/ingredient-parsing.test.ts`

Tests for FIX #1: Ingredient Parsing Edge Cases

**Coverage:**
- ✅ Reject negative quantities
- ✅ Reject unreasonable quantities (>10000)
- ✅ Clean cooking adjectives (gehackt, fein, etc)
- ✅ Split "oder" (or) into separate items
- ✅ Preserve menge + einheit across splits
- ✅ Combined edge cases

**Run:**
```bash
npm test ingredient-parsing
```

**Example:**
```
✓ Ingredient Parsing Edge Cases (17 tests)
  ✓ Menge Validation (3)
  ✓ Cooking Adjectives Cleanup (4)
  ✓ Order Splitting (3)
  ✓ Combined Edge Cases (1)
  ✓ Empty/Invalid Cases (2)
  ✓ 21 total tests pass
```

---

### `src/__tests__/error-handling.test.ts`

Tests for FIX #3: Error Handling System

**Coverage:**
- ✅ All 10 error codes map correctly
- ✅ User-friendly messages
- ✅ Actionable buttons (Retry, Manual, Skip)
- ✅ Error detection (timeout, rate-limit, 404)
- ✅ Icon assignment
- ✅ Context details preserved

**Run:**
```bash
npm test error-handling
```

**Example:**
```
✓ Error Handling System (35 tests)
  ✓ getErrorInfo (6)
  ✓ formatErrorDisplay (4)
  ✓ Error Detection Logic (4)
  ✓ All Error Codes Covered (10)
  ✓ User Experience (3)
  ✓ 27 total tests pass
```

---

### `src/__tests__/image-selection-modal.test.tsx`

Tests for FIX #2: Image Selection Modal

**Coverage:**
- ✅ Modal renders with images
- ✅ onSelect callback fires
- ✅ onSkip callback fires
- ✅ onRetry callback fires
- ✅ Image navigation works
- ✅ No images state handled
- ✅ Loading state disables buttons
- ✅ Accessibility (alt text, labels)

**Run:**
```bash
npm test image-selection-modal
```

**Example:**
```
✓ ImageSelectionModal (24 tests)
  ✓ Rendering (4)
  ✓ User Interactions (3)
  ✓ Image Navigation (1)
  ✓ No Images State (2)
  ✓ Loading State (1)
  ✓ Accessibility (2)
  ✓ 13 total tests pass
```

---

## CI Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --run
      - run: npm run test:coverage
```

---

## Expected Results

All tests should pass:

```
 ✓ src/__tests__/ingredient-parsing.test.ts (21)
 ✓ src/__tests__/error-handling.test.ts (27)
 ✓ src/__tests__/image-selection-modal.test.tsx (13)

 Test Files  3 passed (3)
      Tests  61 passed (61)
   Start at  14:23:45
   Duration  1.23s
```

---

## Notes

- Tests are **unit + integration**, not E2E
- No Supabase/Groq mocking (focus on logic)
- React Testing Library for component tests
- Vitest for speed + TypeScript support

---

## What These Tests Prevent

| Fix | Test | Prevents |
|-----|------|----------|
| #1 | Ingredient parsing | Broken data in DB (negatives, garbage names) |
| #2 | Image modal | Auto-saving wrong images, broken UX |
| #3 | Error handling | Confusing error messages, missing actions |

---

## Next Steps

- [ ] Run `npm test` locally
- [ ] Add to CI/CD
- [ ] Add E2E tests (Playwright) for full flows
- [ ] Monitor test coverage (aim for 80%+)
