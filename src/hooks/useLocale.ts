import { useCallback } from "react"
import { useMount, useUpdateEffect } from "react-use"
import type { Locale } from "@shared/metadata"

export const localeAtom = atomWithStorage<Locale>("locale", "zh-CN")

export function useLocale() {
  const [locale, setLocale] = useAtom(localeAtom)

  useMount(() => {
    document.documentElement.lang = locale
  })

  useUpdateEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const toggleLocale = useCallback(() => {
    setLocale(current => current === "zh-CN" ? "en" : "zh-CN")
  }, [setLocale])

  return { locale, setLocale, toggleLocale }
}
