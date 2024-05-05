import type { MaybeGetter } from "../types.js";
import { isFunction } from "./is.js";

export function get<T>(value: MaybeGetter<T>): T {
  if (isFunction(value)) {
    return value();
  }

  return value;
}