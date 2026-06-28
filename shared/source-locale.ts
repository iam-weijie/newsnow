import { sources } from "./sources"
import type { Locale } from "./metadata"
import type { FixedColumnID, SourceID } from "./types"

export function isSourceVisibleInLocale(id: SourceID, locale: Locale) {
  const displayIn = sources[id]?.displayIn
  if (!displayIn?.length) return true
  return displayIn.includes(locale)
}

export function filterSourcesByLocale(
  sourceIds: SourceID[],
  locale: Locale,
  columnId: FixedColumnID,
) {
  return sourceIds.filter(id => columnId === "focus" || isSourceVisibleInLocale(id, locale))
}

export function mergeVisibleReorder(all: SourceID[], visible: SourceID[]) {
  const visibleSet = new Set(visible)
  let vi = 0
  return all.map(id => visibleSet.has(id) ? visible[vi++]! : id)
}
