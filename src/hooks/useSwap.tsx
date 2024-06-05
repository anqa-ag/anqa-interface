import { useCallback, useMemo, useState } from "react"
import { martian, petra } from "../../types"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { NotificationData, addNotification } from "../redux/slices/user"
import { divpowToFraction } from "../utils/number"
import { GetRouteResponseDataPath } from "./useQuote"
import { toast } from "react-toastify"
import { Link } from "@nextui-org/react"
import { TitleT2 } from "../components/Texts"

interface SwapState {
  isSwapping: boolean
  txVersion: string | undefined
  success: boolean | undefined
}

interface SwapArgs {
  tokenIn: string
  tokenOut: string
  amountIn: string // string of an integer
  amountOut: string // string of an integer
  minAmountOut: string // string of an integer
  paths: GetRouteResponseDataPath[][]
}

const MAX_HOPS = 3

function pathToSwapArgument(path: GetRouteResponseDataPath): [number, number, number, string] {
  let source: number
  let poolType: number
  let isXToY: number

  switch (path.source) {
    case "pancake_swap":
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 1
      poolType = 1
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "sushi_swap":
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 2
      poolType = 2
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "liquid_swap_v0":
      if (path.extra?.isStable === undefined)
        throw new Error(`Error: isStable undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 3
      poolType = path.extra.isStable ? 3 : 2
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "liquid_swap_v0.5":
      if (path.extra?.isStable === undefined)
        throw new Error(`Error: isStable undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 3
      poolType = path.extra.isStable ? 1 : 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "thala_swap_stable":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "thala_swap_weighted":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "bapt_swap_v1":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "bapt_swap_v2":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "bapt_swap_v2.1":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "aux_exchange":
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 6
      poolType = 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "cellana_finance":
      throw new Error(`Frontend not support ${path.source} yet. 4 types of pool, ping @matthew.`)
    case "cetus_amm":
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 8
      poolType = 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "aptoswap":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "anime_swap":
      source = 10
      poolType = 0 // Can be anything.
      isXToY = 0 // Can be anything.
      break
    case "econia":
      throw new Error(`Frontend not support ${path.source} yet.`)
    case "obric_v3_abel":
      if (path.extra?.isXToY === undefined) throw new Error(`Error: isXToYor undefined, path = ${JSON.stringify(path)}`)
      source = 11
      poolType = 3
      isXToY = path.extra.isXToY ? 1 : 0
      break
    default:
      throw new Error(`Frontend not support ${path.source} yet.`)
  }
  return [source, poolType, isXToY, path.amountIn]
}

function getSwapDataFromPaths(args: SwapArgs): {
  function: string
  arguments: ((number | string)[] | string)[]
  typeArguments: string[]
} {
  console.log(`args`, args)
  const data = {
    function: "2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::swap",
    arguments: [
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      [0, 0, 0, "0"],
      args.minAmountOut,
    ],
    typeArguments: [
      args.tokenIn,
      args.tokenOut,
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
      "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null",
    ],
  }
  // Fill arguments.
  for (let i = 0; i < args.paths.length; i++) {
    for (let j = 0; j < args.paths[i].length; j++) {
      data.arguments[i * MAX_HOPS + j] = pathToSwapArgument(args.paths[i][j])
    }
  }
  // Fill typeArguments.
  for (let i = 0; i < args.paths.length; i++) {
    if (args.paths[i].length === 1) {
      data.typeArguments[2 + i * (MAX_HOPS - 1)] = args.tokenOut
      continue
    }
    for (let j = 0; j < args.paths[i].length; j++) {
      data.typeArguments[2 + i * (MAX_HOPS - 1) + j] = args.paths[i][j].tokenOut
    }
  }
  console.log(`data`, data)
  return data
}

export default function useSwap() {
  const [{ isSwapping, txVersion, success }, setSwapState] = useState<SwapState>({
    isSwapping: false,
    txVersion: undefined,
    success: undefined,
  })
  const dispatch = useAppDispatch()
  const { walletAddress, provider } = useAppSelector((state) => state.wallet)
  const { followingTokenData } = useAppSelector((state) => state.token)

  const onSwap = useCallback(
    async (args: SwapArgs) => {
      if (!provider || !walletAddress || isSwapping) return

      dispatch(
        addNotification({
          version: Date.now().toString(),
          isSuccess: true,
          tokenInLogoUrl:
            "https://aptoscan.com/_next/image?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhippospace%2Faptos-coin-list%2Fmain%2Ficons%2FAPT.webp&w=16&q=75",
          tokenOutLogoUrl:
            "https://aptoscan.com/_next/image?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhippospace%2Faptos-coin-list%2Fmain%2Ficons%2FUSDC.svg&w=16&q=75",
          tokenInSymbol: "APT",
          tokenOutSymbol: "zUSDC",
          readableAmountIn: Math.random().toFixed(6),
          readableAmountOut: Math.random().toFixed(6),
          isHide: false,
        }),
      )

      toast(({ closeToast }) => (
        <div className="w-[350px] rounded bg-buttonDisabled p-4">
          <Link href="https://aptoscan.com/transaction/964881358" isExternal>
            <TitleT2>
              {/* {data.isSuccess ? "✅" : "❌"} Swap {data.readableAmountIn} {data.tokenInSymbol ?? "--"} to{" "}
              {data.readableAmountOut} {data.tokenOutSymbol ?? "--"} */}
              Swap 123.45226 APT to 114,282.123882 USDC
            </TitleT2>
          </Link>
        </div>
      ))

      return

      try {
        setSwapState({ isSwapping: true, txVersion: undefined, success: undefined })
        if (provider === "Petra") {
          if (!petra) return
          const swapData = getSwapDataFromPaths(args)
          // TODO: Simulate transaction.
          const response = await petra.signAndSubmitTransaction({
            payload: {
              function: swapData.function,
              arguments: swapData.arguments,
              type_arguments: swapData.typeArguments,
            },
          })
          console.log(`response`, response)
          setSwapState({ isSwapping: false, txVersion: response.version, success: response.success })
          const tokenInData = followingTokenData[args.tokenIn]
          const tokenOutData = followingTokenData[args.tokenOut]
          if (tokenInData && tokenOutData) {
            const payload: NotificationData = {
              version: response.version,
              isSuccess: response.success,
              tokenInLogoUrl: tokenInData.logoUrl,
              tokenOutLogoUrl: tokenOutData.logoUrl,
              tokenInSymbol: tokenInData.symbol,
              tokenOutSymbol: tokenOutData.symbol,
              readableAmountIn: divpowToFraction(args.amountIn, tokenInData.decimals).toSignificant(6),
              readableAmountOut: divpowToFraction(args.amountOut, tokenOutData.decimals).toSignificant(6),
              isHide: false,
            }
            dispatch(addNotification(payload))
          }
        } else if (provider === "Martian") {
          if (!martian) return
          const swapData = getSwapDataFromPaths(args)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const response = await martian.generateSignAndSubmitTransaction(walletAddress, {
            function: swapData.function,
            arguments: swapData.arguments,
            type_arguments: swapData.typeArguments,
            // function: "0x1::coin::transfer",
            // arguments: ["0x57b057e189f60ed079bbfe11b88b187cc6bea5016d1bc58aee5ec087f76ce44e", 50],
            // type_arguments: ["0x1::aptos_coin::AptosCoin"],
          })
          console.log(`response`, response)
          setSwapState({ isSwapping: false, txVersion: response.version, success: response.success })
        }
      } catch (err) {
        console.error(err)
        setSwapState((prev) => ({ ...prev, isSwapping: false }))
      }
    },
    [dispatch, followingTokenData, isSwapping, provider, walletAddress],
  )

  const res = useMemo(
    () => ({
      isSwapping,
      txVersion,
      success,
      onSwap,
    }),
    [isSwapping, onSwap, success, txVersion],
  )
  return res
}

// const txxxxxxxx = await martian.generateTransaction(
//   "0x57b057e189f60ed079bbfe11b88b187cc6bea5016d1bc58aee5ec087f76ce44e",
//   transaction.data,
// )
