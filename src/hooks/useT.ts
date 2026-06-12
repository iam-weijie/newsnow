import { useCallback } from "react"
import { useLocale } from "./useLocale"
import type { MessageKey } from "~/i18n/messages"
import { messages } from "~/i18n/messages"

export function useT() {
  const { locale } = useLocale()

  return useCallback((key: MessageKey, time?: string) => {
    const value = messages[locale][key]
    return typeof value === "function" ? value(time!) : value
  }, [locale])
}
