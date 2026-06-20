import type { SourceID } from "@shared/types"
import { useRequireLogin } from "./useRequireLogin"
import { focusSourcesAtom } from "~/atoms"

export function useFocus() {
  const [focusSources, setFocusSources] = useAtom(focusSourcesAtom)
  const requireLogin = useRequireLogin()
  const toggleFocus = useCallback((id: SourceID) => {
    const isCurrentlyFocused = focusSources.includes(id)
    if (!isCurrentlyFocused && !requireLogin("starLoginRequired"))
      return
    setFocusSources(isCurrentlyFocused ? focusSources.filter(i => i !== id) : [...focusSources, id])
  }, [setFocusSources, focusSources, requireLogin])
  const isFocused = useCallback((id: SourceID) => focusSources.includes(id), [focusSources])

  return {
    toggleFocus,
    isFocused,
  }
}

export function useFocusWith(id: SourceID) {
  const [focusSources, setFocusSources] = useAtom(focusSourcesAtom)
  const requireLogin = useRequireLogin()
  const toggleFocus = useCallback(() => {
    const isCurrentlyFocused = focusSources.includes(id)
    if (!isCurrentlyFocused && !requireLogin("starLoginRequired"))
      return
    setFocusSources(isCurrentlyFocused ? focusSources.filter(i => i !== id) : [...focusSources, id])
  }, [setFocusSources, focusSources, id, requireLogin])
  const isFocused = useMemo(() => focusSources.includes(id), [id, focusSources])

  return {
    toggleFocus,
    isFocused,
  }
}
