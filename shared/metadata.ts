import { sources } from "./sources"
import { typeSafeObjectEntries, typeSafeObjectFromEntries } from "./type.util"
import type { ColumnID, HiddenColumnID, Metadata, SourceID } from "./types"

export type Locale = "zh-CN" | "en"

export const columns = {
  china: {
    zh: "国内",
    en: "China",
  },
  world: {
    zh: "国际",
    en: "World",
  },
  tech: {
    zh: "科技",
    en: "Tech",
  },
  finance: {
    zh: "财经",
    en: "Finance",
  },
  focus: {
    zh: "关注",
    en: "Following",
  },
  realtime: {
    zh: "实时",
    en: "Live",
  },
  hottest: {
    zh: "最热",
    en: "Trending",
  },
} as const

export function getColumnName(id: ColumnID, locale: Locale = "zh-CN") {
  return locale === "en" ? columns[id].en : columns[id].zh
}

export const fixedColumnIds = ["focus", "hottest", "realtime"] as const satisfies Partial<ColumnID>[]
export const hiddenColumns = Object.keys(columns).filter(id => !fixedColumnIds.includes(id as any)) as HiddenColumnID[]

export const metadata: Metadata = typeSafeObjectFromEntries(typeSafeObjectEntries(columns).map(([k, v]) => {
  switch (k) {
    case "focus":
      return [k, {
        name: v.zh,
        sources: [] as SourceID[],
      }]
    case "hottest":
      return [k, {
        name: v.zh,
        sources: typeSafeObjectEntries(sources).filter(([, v]) => v.type === "hottest" && !v.redirect).map(([k]) => k),
      }]
    case "realtime":
      return [k, {
        name: v.zh,
        sources: typeSafeObjectEntries(sources).filter(([, v]) => v.type === "realtime" && !v.redirect).map(([k]) => k),
      }]
    default:
      return [k, {
        name: v.zh,
        sources: typeSafeObjectEntries(sources).filter(([, v]) => v.column === k && !v.redirect).map(([k]) => k),
      }]
  }
}))
