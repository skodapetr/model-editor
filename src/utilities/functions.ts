
/**
 * @returns A new array with item on given position replaced.
 */
export function arrayReplace<T>(array: T[], index: number, value: T): T[] {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

/**
 * @returns A new array with given item inserted at given position.
 */
export function arrayInsert<T>(array: T[], index: number, value: T): T[] {
  return [...array.slice(0, index), value, ...array.slice(index)];
}

/**
 * @returns A new array with item on given index removed.
 */
export function arrayRemove<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
