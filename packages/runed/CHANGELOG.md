# runed

## 0.15.1

### Patch Changes

- fix: avoid writing to state in media-query getter ([#122](https://github.com/svecosystem/runed/pull/122))

## 0.15.0

### Minor Changes

- feat: Add `FiniteStateMachine` ([#111](https://github.com/svecosystem/runed/pull/111))

## 0.14.0

### Minor Changes

- feat: `IsFocusWithin` ([#103](https://github.com/svecosystem/runed/pull/103))

## 0.13.0

### Minor Changes

- allow setting immediately and cancelling Debounced update ([#96](https://github.com/svecosystem/runed/pull/96))

- feat: `IsIdle` ([#94](https://github.com/svecosystem/runed/pull/94))

- allow passing multiple events to useEventListener ([#96](https://github.com/svecosystem/runed/pull/96))

- allow cancelling debounce fn ([#96](https://github.com/svecosystem/runed/pull/96))

- update `watch` utility ([#83](https://github.com/svecosystem/runed/pull/83))

### Patch Changes

- fix animationFrames ([#91](https://github.com/svecosystem/runed/pull/91))

- Fix isIdle errors ([#96](https://github.com/svecosystem/runed/pull/96))

## 0.12.1

### Patch Changes

- fix animationFrames ([#89](https://github.com/svecosystem/runed/pull/89))

## 0.12.0

### Minor Changes

- add `AnimationFrames` ([#78](https://github.com/svecosystem/runed/pull/78))

## 0.11.0

### Minor Changes

- feat: allow media query to be initialized in a module ([#68](https://github.com/svecosystem/runed/pull/68))

### Patch Changes

- chore: use esm-env For Browser Checks ([#79](https://github.com/svecosystem/runed/pull/79))

## 0.10.0

### Minor Changes

- feat: useIntersectionObserver ([#73](https://github.com/svecosystem/runed/pull/73))

### Patch Changes

- fix: ensure "add" utility exports types as well ([#74](https://github.com/svecosystem/runed/pull/74))

## 0.9.1

### Patch Changes

- rename match to matches in MediaQuery ([#69](https://github.com/svecosystem/runed/pull/69))

## 0.9.0

### Minor Changes

- add ElementRect ([#67](https://github.com/svecosystem/runed/pull/67))

- feat: `useStore` ([#50](https://github.com/svecosystem/runed/pull/50))

- add useMutationObserver ([#67](https://github.com/svecosystem/runed/pull/67))

- add useResizeObserver ([#67](https://github.com/svecosystem/runed/pull/67))

- return cleanup from watch ([#67](https://github.com/svecosystem/runed/pull/67))

### Patch Changes

- rename match to matches in MediaQuery ([#67](https://github.com/svecosystem/runed/pull/67))

## 0.8.0

### Minor Changes

- feat: add MediaQuery utility ([#63](https://github.com/svecosystem/runed/pull/63))

### Patch Changes

- Add Explicit Return Types ([#65](https://github.com/svecosystem/runed/pull/65))

## 0.7.0

### Minor Changes

- add PressedKeys utility ([#58](https://github.com/svecosystem/runed/pull/58))

### Patch Changes

- fix active element erroring on SSR ([#60](https://github.com/svecosystem/runed/pull/60))

- fix active element not being up to date outside effects ([#55](https://github.com/svecosystem/runed/pull/55))

## 0.6.0

### Minor Changes

- add Debounced utility ([#48](https://github.com/svecosystem/runed/pull/48))

- BREAKING: Remove box ([#48](https://github.com/svecosystem/runed/pull/48))

### Patch Changes

- Change useMounted to IsMounted ([#48](https://github.com/svecosystem/runed/pull/48))

- change useSupported to IsSupported ([#48](https://github.com/svecosystem/runed/pull/48))

- change useElementSize to ElementSize ([#48](https://github.com/svecosystem/runed/pull/48))

- change useActiveElement to activeElement ([#48](https://github.com/svecosystem/runed/pull/48))

- change useStateHistory to StateHistory ([#48](https://github.com/svecosystem/runed/pull/48))

- change usePrevious to Previous ([#48](https://github.com/svecosystem/runed/pull/48))

## 0.5.0

### Minor Changes

- feat: `useStateHistory` & `usePrevious` ([#33](https://github.com/svecosystem/runed/pull/33))

- feat: `watch` helper ([#34](https://github.com/svecosystem/runed/pull/34))

## 0.4.1

### Patch Changes

- Fix addEventListener overloads ([#16](https://github.com/svecosystem/runed/pull/16))

## 0.4.0

### Minor Changes

- feat: `useSupported` ([#25](https://github.com/svecosystem/runed/pull/25))

## 0.3.0

### Minor Changes

- feat: `useMounted` ([#22](https://github.com/svecosystem/runed/pull/22))

## 0.2.0

### Minor Changes

- Add `box.readonly` utility ([#17](https://github.com/svecosystem/runed/pull/17))

### Patch Changes

- box.readonly perfomance adjustment ([#21](https://github.com/svecosystem/runed/pull/21))

## 0.1.0

### Minor Changes

- add useActiveElement ([#3](https://github.com/svecosystem/runed/pull/3))

- add `box` utilities ([#15](https://github.com/svecosystem/runed/pull/15))

### Patch Changes

- allow undefined | null in useEventListener ([#12](https://github.com/svecosystem/runed/pull/12))

- New Function: `useEventListener` ([#7](https://github.com/svecosystem/runed/pull/7))

- fix element size & improve JSDoc ([#10](https://github.com/svecosystem/runed/pull/10))

## 0.0.1

### Patch Changes

- Initial release, including `withDebounce` and `withElementSize` ([`dd5815315c353d79f9481d54b9fdcbcab308aaeb`](https://github.com/svecosystem/runed/commit/dd5815315c353d79f9481d54b9fdcbcab308aaeb))
