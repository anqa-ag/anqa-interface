import { Link } from "@nextui-org/react"
import { useCallback, useMemo } from "react"
import { useTimeout } from "usehooks-ts"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { NotificationData, hideNotification } from "../redux/slices/user"
import { TitleT2 } from "./Texts"

function Notification({ data }: { data: NotificationData }) {
  const dispatch = useAppDispatch()

  const fn = useCallback(() => {
    dispatch(hideNotification(data.version))
  }, [data.version, dispatch])

  useTimeout(fn, 5000)

  return (
    <div className="w-[350px] rounded bg-buttonDisabled p-4">
      <Link href="https://aptoscan.com/transaction/964881358" isExternal>
        <TitleT2>
          {data.isSuccess ? "✅" : "❌"} Swap {data.readableAmountIn} {data.tokenInSymbol ?? "--"} to{" "}
          {data.readableAmountOut} {data.tokenOutSymbol ?? "--"}
        </TitleT2>
      </Link>
    </div>
  )
}

export default function NotificationList() {
  const map = useAppSelector((state) => state.user.notificationMap)
  const list = useMemo(() => Object.values(map), [map])
  return (
    <>
      <div className="absolute right-[60px] top-[160px] flex flex-col gap-5">
        {list
          .filter((item) => !item.isHide)
          .map((item) => (
            <Notification key={item.version} data={item} />
          ))}
      </div>
    </>
  )
}
