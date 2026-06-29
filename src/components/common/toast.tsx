import { useCallback, useRef } from "react"
import { useMount } from "react-use"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import type { ToastItem } from "~/atoms/types"
import { Timer } from "~/utils"

export function Toast() {
  const toastItems = useAtomValue(toastAtom)
  const [parent] = useAutoAnimate({ duration: 200 })
  return (
    <ol
      ref={parent}
      className="absolute top-4 left-1/2 z-99 flex flex-col gap-2 w-max min-w-80 max-w-[90vw] -translate-x-1/2"
    >
      {
        toastItems.map(k => <Item key={k.id} info={k} />)
      }
    </ol>
  )
}

const colors = {
  success: "green",
  error: "red",
  warning: "orange",
  info: "blue",
}

function Item({ info }: { info: ToastItem }) {
  const color = colors[info.type ?? "info"]
  const setToastItems = useSetAtom(toastAtom)
  const hidden = useCallback((dismiss = true) => {
    setToastItems(prev => prev.filter(k => k.id !== info.id))
    if (dismiss) {
      info.onDismiss?.()
    }
  }, [info, setToastItems])
  const timer = useRef<Timer | null>(null)

  useMount(() => {
    timer.current = new Timer(() => {
      hidden()
    }, info.duration ?? 5000)
    return () => timer.current?.clear()
  })

  const [hoverd, setHoverd] = useState(false)
  useEffect(() => {
    if (hoverd) {
      timer.current?.pause()
    } else {
      timer.current?.resume()
    }
  }, [hoverd])

  return (
    <li
      className={$(
        "bg-base rounded-lg shadow-xl relative",
      )}
      onMouseEnter={() => setHoverd(true)}
      onMouseLeave={() => setHoverd(false)}
    >
      <div className={$(
        `bg-${color}-500 dark:bg-${color} bg-op-40! p2 backdrop-blur-5 rounded-lg w-full`,
        "flex items-center gap-2 flex-nowrap",
      )}
      >
        {
          hoverd
            ? <button type="button" className={`i-ph:x-circle color-${color}-500 i-ph:info shrink-0`} onClick={() => hidden(false)} />
            : <span className={`i-ph:info color-${color}-500 shrink-0`} />
        }
        <div className="flex justify-between w-full items-center gap-2 flex-nowrap">
          <span className="op-90 dark:op-100 whitespace-nowrap">
            {info.msg}
          </span>
          {info.action && (
            <button
              type="button"
              className={`text-sm color-${color}-500 bg-base op-80 bg-op-50! px-2 rounded shrink-0 whitespace-nowrap hover:bg-op-70!`}
              onClick={info.action.onClick}
            >
              {info.action.label}
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
