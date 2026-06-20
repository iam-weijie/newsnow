import type { MessageKey } from "~/i18n/messages"

export function useRequireLogin() {
  const { enableLogin, loggedIn, login } = useLogin()
  const toaster = useToast()
  const t = useT()

  return useCallback((message: MessageKey) => {
    if (enableLogin && !loggedIn) {
      toaster(t(message), {
        type: "warning",
        action: {
          label: t("login"),
          onClick: login,
        },
      })
      return false
    }
    return true
  }, [enableLogin, loggedIn, login, toaster, t])
}
