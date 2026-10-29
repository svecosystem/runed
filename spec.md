# PressedKeys Ergonomics Improvement Plan

## Problem Statement
The current `PressedKeys` implementation has an ergonomics issue where checking for a single key (e.g., `has("k")`) also matches when modifiers are pressed (e.g., Cmd+K). This doesn't align with user expectations or industry best practices.

## Todo List
- [x] Update the `has` method to use exact matching only
- [x] Update the `onKeys` method to use exact matching only
- [x] Remove inclusive option entirely for simpler API
- [x] Add comprehensive tests for exact matching behavior
- [x] Update documentation with examples of exact matching
- [x] Write PR description explaining the breaking change

## Implementation Details

### Option 1: Add options parameter to existing methods
```typescript
// Default behavior (backward compatible - inclusive match)
keys.has("k") // true for both "k" and "Cmd+k"

// New exact match option
keys.has("k", { exact: true }) // true only for "k" alone
keys.has(["meta", "k"], { exact: true }) // true only for exactly Cmd+k

// For onKeys
keys.onKeys("k", callback, { exact: true }) // fires only for "k" alone
```

### Option 2: Add new methods for exact matching
```typescript
// Existing methods remain unchanged (inclusive)
keys.has("k") // true for both "k" and "Cmd+k"

// New exact methods
keys.hasExact("k") // true only for "k" alone
keys.onKeysExact("k", callback) // fires only for "k" alone
```

### Option 3: Change default behavior (breaking change)
Make exact matching the default and add an option for inclusive matching. This would be more aligned with user expectations but would be a breaking change.

## Recommendation
I recommend **Option 1** as it:
- Maintains backward compatibility
- Provides clear, explicit control over matching behavior  
- Aligns with patterns used in other parts of the codebase
- Makes the API more flexible for different use cases

## Test Cases to Add
1. `has("k")` returns true when only "k" is pressed
2. `has("k")` returns true when "Cmd+k" is pressed (backward compatibility)
3. `has("k", { exact: true })` returns true only when "k" is pressed alone
4. `has("k", { exact: true })` returns false when "Cmd+k" is pressed
5. `has(["meta", "k"], { exact: true })` returns true only for exactly Cmd+k
6. `onKeys` with exact option fires appropriately
7. Edge cases with multiple modifiers

## Review

### Summary of Changes
1. **Simplified the API** - Removed the `KeyMatchOptions` type and `inclusive` option entirely
2. **Made exact matching the only behavior** - `has()` and `onKeys()` now only match when exactly the specified keys are pressed
3. **Updated tests** - Removed tests for inclusive matching and kept only exact matching tests
4. **Breaking change** - Users who relied on the previous inclusive behavior will need to update their code

### Key Decisions
- Chose simplicity over backward compatibility by removing the inclusive option
- This makes the API more predictable and aligns with user expectations
- Users who need inclusive behavior can use `keys.all.includes("k")` directly

### Migration Impact
- Any code using `has("k")` that expected it to match "Cmd+K" will break
- The migration path is clear: either specify all keys or use `keys.all.includes()`
- Documentation has been updated to explain the new behavior