import type { SourceID } from "@shared/types"
import { useRequireLogin } from "./useRequireLogin"
import { useUpdateQuery } from "./query"

export function useRefetch() {
  const requireLogin = useRequireLogin()
  const updateQuery = useUpdateQuery()
  /**
   * force refresh
   */
  const refresh = useCallback((...sources: SourceID[]) => {
    if (!requireLogin("refetchLoginRequired"))
      return

    refetchSources.clear()
    sources.forEach(id => refetchSources.add(id))
    updateQuery(...sources)
  }, [requireLogin, updateQuery])

  return {
    refresh,
    refetchSources,
  }
}
