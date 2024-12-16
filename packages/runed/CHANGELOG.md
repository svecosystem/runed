# runed

## 0.19.0

### Minor Changes

- Breaking: Set minimum peer dep to `svelte@5.7.0` or greater to support
  [`createSubscriber`](https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber) API
  ([#177](https://github.com/svecosystem/runed/pull/177))

- Enable `PersistedState` to be used in `.svelte.[ts|js]` files
  ([#177](https://github.com/svecosystem/runed/pull/177))

## 0.18.0

### Minor Changes

- feat: add `runScheduledNow` and `updateImmediately` to `Debounced`
  ([#142](https://github.com/svecosystem/runed/pull/142))

### Patch Changes

- fix: `PersistedState` - only listen for the `'storage'` event if using `'local'` storage
  ([#159](https://github.com/svecosystem/runed/pull/159))

## 0.17.0

### Minor Changes

- change: handle boolean conversion within `IsSupported` to improve DX
  ([#165](https://github.com/svecosystem/runed/pull/165))

- feat: `useGeolocation` ([#165](https://github.com/svecosystem/runed/pull/165))

## 0.16.3

### Patch Changes

- fix: `AnimationFrames` ([#168](https://github.com/svecosystem/runed/pull/168))

## 0.16.2

### Patch Changes

- Refactored public methods to use prototype-based bound functions instead of arrow functions for
  ([#161](https://github.com/svecosystem/runed/pull/161)) better inheritance and reduced memory
  usage

## 0.16.1

### Patch Changes

- widen the type of element getter args to `HTMLElement | undefined | null`
  ([#157](https://github.com/svecosystem/runed/pull/157))

- ensure explicit return types for utilities ([#157](https://github.com/svecosystem/runed/pull/157))

- fix: `isIdle.current` should be readonly ([#157](https://github.com/svecosystem/runed/pull/157))

## 0.16.0

### Minor Changes

- Add `PersistedState` ([#113](https://github.com/svecosystem/runed/pull/113))

## 0.15.4

### Patch Changes

- docs: add jsdoc comments to the Debounced state util
  ([#140](https://github.com/svecosystem/runed/pull/140))

- fix: useDebounce race condition (#139) ([#146](https://github.com/svecosystem/runed/pull/146))

## 0.15.3

### Patch Changes

- fix: add a browser check in `MediaQuery` ([#137](https://github.com/svecosystem/runed/pull/137))

## 0.15.2

### Patch Changes

- update svelte dep
  ([`1aba37642783caff0a4ad327e129ce41e98b2d92`](https://github.com/svecosystem/runed/commit/1aba37642783caff0a4ad327e129ce41e98b2d92))

## 0.15.1

### Patch Changes

- fix: avoid writing to state in media-query getter
  ([#122](https://github.com/svecosystem/runed/pull/122))

- Replace $state.frozen with $state.raw ([#130](https://github.com/svecosystem/runed/pull/130))

## 0.15.0

### Minor Changes

- feat: Add `FiniteStateMachine` ([#111](https://github.com/svecosystem/runed/pull/111))

## 0.14.0

### Minor Changes

- feat: `IsFocusWithin` ([#103](https://github.com/svecosystem/runed/pull/103))

## 0.13.0

### Minor Changes

- allow setting immediately and cancelling Debounced update
  ([#96](https://github.com/svecosystem/runed/pull/96))

- feat: `IsIdle` ([#94](https://github.com/svecosystem/runed/pull/94))

- allow passing multiple events to useEventListener
  ([#96](https://github.com/svecosystem/runed/pull/96))

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

- feat: allow media query to be initialized in a module
  ([#68](https://github.com/svecosystem/runed/pull/68))

### Patch Changes

- chore: use esm-env For Browser Checks ([#79](https://github.com/svecosystem/runed/pull/79))

## 0.10.0

### Minor Changes

- feat: useIntersectionObserver ([#73](https://github.com/svecosystem/runed/pull/73))

### Patch Changes

- fix: ensure "add" utility exports types as well
  ([#74](https://github.com/svecosystem/runed/pull/74))

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

- fix active element not being up to date outside effects
  ([#55](https://github.com/svecosystem/runed/pull/55))

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

- Initial release, including `withDebounce` and `withElementSize`
  ([`dd5815315c353d79f9481d54b9fdcbcab308aaeb`](https://github.com/svecosystem/runed/commit/dd5815315c353d79f9481d54b9fdcbcab308aaeb))
