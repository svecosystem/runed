# runed

## 0.34.0

### Minor Changes

- New Utility: `IsDocumentVisibile` ([#328](https://github.com/svecosystem/runed/pull/328))

## 0.33.0

### Minor Changes

- breaking(validateSearchParams): return an object with `searchParams` and `data`, `searchParams`
  being the ([#329](https://github.com/svecosystem/runed/pull/329)) validated `URLSearchParams` and
  `data` being the validated object

- New Utility: `onCleanup` ([#318](https://github.com/svecosystem/runed/pull/318))

### Patch Changes

- fix(validateSearchParams): fine grained access
  ([#329](https://github.com/svecosystem/runed/pull/329))

## 0.32.0

### Minor Changes

- New Utility: `useSearchParams` ([#266](https://github.com/svecosystem/runed/pull/266))

- feat(StateHistory): add `clear` method to reset the stack
  ([#293](https://github.com/svecosystem/runed/pull/293))

- New Utility: `boolAttr` ([#251](https://github.com/svecosystem/runed/pull/251))

### Patch Changes

- fix(IsIdle): use reactive events ([#317](https://github.com/svecosystem/runed/pull/317))

- fix: use a `$derived` in `Previous` ([#314](https://github.com/svecosystem/runed/pull/314))

- fix: type of `event.currentTarget` for `useEventListener`
  ([#311](https://github.com/svecosystem/runed/pull/311))

## 0.31.1

### Patch Changes

- fix(persisted-state): do not make complex objects reactive
  ([#270](https://github.com/svecosystem/runed/pull/270))

## 0.31.0

### Minor Changes

- feat: add interval utilities
  ([`c7de088`](https://github.com/svecosystem/runed/commit/c7de088300fcbf7df1fd57a4f1245debd2bc06bb))

## 0.30.0

### Minor Changes

- New Utilities: `useThrottle` and `Throttled`
  ([#115](https://github.com/svecosystem/runed/pull/115))

- Update Svelte to `5.0.0-next.200` ([#115](https://github.com/svecosystem/runed/pull/115))

## 0.29.2

### Patch Changes

- fix: remove `#version` from persisted & don't recreate proxies
  ([#279](https://github.com/svecosystem/runed/pull/279))

## 0.29.1

### Patch Changes

- feat(ScrollState): Add `progress.(x|y)` api
  ([#284](https://github.com/svecosystem/runed/pull/284))

- fix: add `defaults` export to package.json ([#285](https://github.com/svecosystem/runed/pull/285))

## 0.29.0

### Minor Changes

- feat(Debounced): Expose pending state from useDebounce
  ([#272](https://github.com/svecosystem/runed/pull/272))

## 0.28.0

### Minor Changes

- breaking: remove `initialSize` and calculate size before first resize
  ([#262](https://github.com/svecosystem/runed/pull/262))

### Patch Changes

- fix: use `createSubscriber` for `ElementSize` util
  ([#254](https://github.com/svecosystem/runed/pull/254))

## 0.27.0

### Minor Changes

- New utility: `TextareaAutosize` ([#233](https://github.com/svecosystem/runed/pull/233))

- New utility: `extract` ([#233](https://github.com/svecosystem/runed/pull/233))

- New utility: `ScrollState` ([#233](https://github.com/svecosystem/runed/pull/233))

- feat: export `Getter` and `MaybeGetter` types
  ([#233](https://github.com/svecosystem/runed/pull/233))

### Patch Changes

- change: `extract` types ([#233](https://github.com/svecosystem/runed/pull/233))

## 0.26.0

### Minor Changes

- feat(PressedKeys): add the ability to register a callback to execute when a specified key
  combination is pressed. ([#239](https://github.com/svecosystem/runed/pull/239))

### Patch Changes

- chore: add license field to package.json ([#238](https://github.com/svecosystem/runed/pull/238))

- fix(PersistedState): prevent console errors if `typeof window === undefined`
  ([#244](https://github.com/svecosystem/runed/pull/244))

- fix(resource): remove redundant equality comparison
  ([#248](https://github.com/svecosystem/runed/pull/248))

- fix(PressedKeys): keys are not cleared after key combination is pressed
  ([#239](https://github.com/svecosystem/runed/pull/239))

## 0.25.0

### Minor Changes

- previous: allow passing initial value
  ([`3bbcb9e`](https://github.com/svecosystem/runed/commit/3bbcb9e0185bb40fdb8d38b31876f0e297bee544))

### Patch Changes

- fix: Fix issues with `PersistedState` in runes mode.
  ([#236](https://github.com/svecosystem/runed/pull/236))

## 0.24.1

### Patch Changes

- fix(persisted-state): write state to storage even if only a nested property is changed. fixes #224
  ([#225](https://github.com/svecosystem/runed/pull/225))

## 0.24.0

### Minor Changes

- feat: add `resource` that watches dependencies and runs async data fetching
  ([#218](https://github.com/svecosystem/runed/pull/218))

## 0.23.4

### Patch Changes

- fix: package.json default exports ([#220](https://github.com/svecosystem/runed/pull/220))

## 0.23.3

### Patch Changes

- fix default export
  ([`09f37b3`](https://github.com/svecosystem/runed/commit/09f37b33927eb9a2e9c3a1d351c64d5b16b1fdbf))

## 0.23.2

### Patch Changes

- patch: add defined checks in addition to browser for `window`
  ([#212](https://github.com/svecosystem/runed/pull/212))

## 0.23.1

### Patch Changes

- fix: remove `PURE` from global exports ([#200](https://github.com/svecosystem/runed/pull/200))

## 0.23.0

### Minor Changes

- feat: `onClickOutside` ([#190](https://github.com/svecosystem/runed/pull/190))

- breaking: deprecate `Readable` in favor of `createSubscriber` from Svelte
  ([#193](https://github.com/svecosystem/runed/pull/193))

- breaking: replace `useActiveElement` with `ActiveElement` for custom `DocumentOrShadowRoot`
  options ([#193](https://github.com/svecosystem/runed/pull/193))

### Patch Changes

- breaking: remove `IsSupported` ([#199](https://github.com/svecosystem/runed/pull/199))

- internal: remove `addEventListener` in favor of
  [on](https://svelte.dev/docs/svelte/svelte-events#on) from Svelte
  ([#196](https://github.com/svecosystem/runed/pull/196))

## 0.22.0

### Minor Changes

- feat: Configurable globals (`window`, `document`, `navigator`, etc.)
  ([#186](https://github.com/svecosystem/runed/pull/186))

- breaking: Align `useGeolocation` API with the Geolocation Web API
  ([#189](https://github.com/svecosystem/runed/pull/189))

## 0.21.0

### Minor Changes

- breaking: deprecate `MediaQuery` in favor of Svelte's `MediaQuery`
  ([#184](https://github.com/svecosystem/runed/pull/184))

- breaking: deprecate `Store` in favor of Svelte's `fromStore` and `toStore`
  ([#184](https://github.com/svecosystem/runed/pull/184))

### Patch Changes

- simplify `IsSupported` internals ([#184](https://github.com/svecosystem/runed/pull/184))

## 0.20.0

### Minor Changes

- feat: `Context` - a type-safe wrapper around the Svelte
  [Context](https://svelte.dev/docs/svelte/context) API.
  ([#178](https://github.com/svecosystem/runed/pull/178))

- feat: `IsInViewport` ([#181](https://github.com/svecosystem/runed/pull/181))

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
