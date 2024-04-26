/* eslint-disable ts/consistent-type-definitions */

import type { Getter, Setter } from "$lib/internal/types.js";

const BoxSymbol = Symbol('box');

interface Box<T> {
  [BoxSymbol]: true
  value: T,
}

interface ReadonlyBox<T> extends Box<T> {
  readonly value: T,
}

export function box<T>(): Box<T | undefined>
export function box<T>(initial: T): Box<T>
export function box<T>(initial?: T) {
  let value = $state(initial)

  return {
    get value() {
      return value
    },
    set value(v) {
      value = v;
    },
    [BoxSymbol]: true
  }
}

box.isBox = function isBox<T>(value: unknown): value is Box<T> {
  return typeof value === 'object' && value !== null && (BoxSymbol in value);
}

function isWritable<T extends {}>(obj: T, key: keyof T) {
  const desc = Object.getOwnPropertyDescriptor(obj, key) || {}
  return Boolean(desc.writable)
}

box.isReadonly = function boxIsReadonly<T>(value: unknown): value is ReadonlyBox<T> {
  return box.isBox(value) && !isWritable(value, 'value')
}

box.isWritable = function boxIsWritable<T>(value: unknown): value is Box<T> {
  return box.isBox(value) && isWritable(value, 'value')
}

function boxFrom<T>(value: T): T extends ReadonlyBox<infer _> ? T : Box<T> {
  // eslint-disable-next-line ts/no-explicit-any -- I'm fucking something up here
  if (box.isBox(value)) return value as any;
  // eslint-disable-next-line ts/no-explicit-any
  return box(value) as any;
}
box.from = boxFrom

function boxWith<T>(get: Getter<T>): ReadonlyBox<T>
function boxWith<T>(get: Getter<T>, set: Setter<T>): Box<T>
function boxWith<T>(get: Getter<T>, set?: Setter<T>) {
  const value = $derived.by(get)

  if (set) {
    return {
      get value() {
        return value;
      },
      set value(v) {
        set(v)
      },
      [BoxSymbol]: true
    }
  } else {
    return {
      get value() {
        return value;
      },
      [BoxSymbol]: true
    }
  }
}
box.with = boxWith

// Usage examples
function acceptsReadonly(disabled: boolean | ReadonlyBox<boolean>) {
  const disabledBox = box.from(disabled);
  // @ts-expect-error -- testing
  disabledBox.value = false
  if (box.isWritable(disabledBox)) {
    disabledBox.value = true
  }
}

function acceptsMutable(disabled: boolean | Box<boolean>) {
  const disabledBox = box.from(disabled);
  disabledBox.value = false
}

let disabled = $state(false);

acceptsReadonly(
  box.with(() => disabled)
);

acceptsReadonly(
  box(false)
);

acceptsMutable(
  box.with(() => disabled, (v) => disabled = v)
)

acceptsMutable(
  box(false)
)