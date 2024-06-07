import { Link } from "@nextui-org/react"
import { useCallback, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { martian, petra } from "../../types"
import { TitleT2, TitleT4 } from "../components/Texts"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { NotificationData, addNotification } from "../redux/slices/user"
import { divpowToFraction } from "../utils/number"
import { GetRouteResponseDataPath } from "./useQuote"

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

const MAX_PATH = 15
const MAX_HOPS_PER_PATH = 3
const COIN_NULL = "0x2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::Null"

function pathToSwapArgument(path: GetRouteResponseDataPath): [number, number, number, string] {
  let source: number
  let poolType: number
  let isXToY: number

  switch (path.source) {
    case "pancake_swap":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 1
      poolType = 1
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "sushi_swap":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 2
      poolType = 2
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "liquid_swap_v0":
      if (path.extra?.isStable === undefined)
        throw new Error(`isStable undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 3
      poolType = path.extra.isStable ? 3 : 2
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "liquid_swap_v0.5":
      if (path.extra?.isStable === undefined)
        throw new Error(`isStable undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 3
      poolType = path.extra.isStable ? 1 : 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "thala_swap_stable":
      if (path.extra?.tokenInIndex === undefined)
        throw new Error(`tokenInIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.tokenOutIndex === undefined)
        throw new Error(`tokenOutIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.extra.tokenInIndex > 1)
        throw new Error(`Not support tokenInIndex > 1 yet, path = ${JSON.stringify(path)}`)
      if (path.extra.tokenOutIndex > 1)
        throw new Error(`Not support tokenOutIndex > 1 yet, path = ${JSON.stringify(path)}`)
      source = 4
      poolType = 0
      isXToY = path.extra.tokenInIndex === 0 ? 1 : 0
      break
    case "thala_swap_weighted": {
      if (path.extra?.tokenInIndex === undefined)
        throw new Error(`tokenInIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.tokenOutIndex === undefined)
        throw new Error(`tokenOutIndex undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.tokenInIndex > 1)
        throw new Error(`Not support tokenInIndex > 1 yet, path = ${JSON.stringify(path)}`)
      if (path.extra?.tokenOutIndex > 1)
        throw new Error(`Not support tokenOutIndex > 1 yet, path = ${JSON.stringify(path)}`)
      if (path.extra?.tokenInWeight === undefined)
        throw new Error(`tokenInWeight undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.tokenOutWeight === undefined)
        throw new Error(`tokenOutWeight undefined, path = ${JSON.stringify(path)}`)
      const weight = path.extra.tokenInIndex === 0 ? path.extra.tokenInWeight : path.extra.tokenOutWeight
      source = 4
      poolType = (1 << 20) + (1 << (weight / 5 - 1))
      isXToY = path.extra.tokenInIndex === 0 ? 1 : 0
      break
    }
    // case "bapt_swap_v1":
    //   throw new Error(`Frontend not support ${path.source} yet.`)
    // case "bapt_swap_v2":
    //   throw new Error(`Frontend not support ${path.source} yet.`)
    // case "bapt_swap_v2.1":
    //   throw new Error(`Frontend not support ${path.source} yet.`)
    case "aux_exchange":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 6
      poolType = 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "cellana_finance":
      if (path.extra?.isStable === undefined)
        throw new Error(`isStable undefined, path = ${JSON.stringify(path)}`)
      source = 7
      poolType = 0
      isXToY = path.extra.isStable ? 1 : 0 // isXToY is actually isStable.
      break
    case "cetus_amm":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 8
      poolType = 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "aptoswap":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      source = 9
      poolType = 0
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "anime_swap":
      source = 10
      poolType = 0 // Can be anything.
      isXToY = 0 // Can be anything.
      break
    case "econia":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
      if (path.extra?.marketId === undefined)
        throw new Error(`marketId undefined, path = ${JSON.stringify(path)}`)
      source = 12
      poolType = path.extra.marketId
      isXToY = path.extra.isXToY ? 1 : 0
      break
    case "obric_v3_abel":
      if (path.extra?.isXToY === undefined) throw new Error(`isXToY undefined, path = ${JSON.stringify(path)}`)
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
    function: "2e8671ebdf16028d7de00229c26b551d8f145d541f96278eec54d9d775a49fe3::router::swap_generic",
    arguments: [...Array(MAX_PATH * MAX_HOPS_PER_PATH).fill([0, 0, 0, "0"]), args.minAmountOut],
    typeArguments: [args.tokenIn, args.tokenOut, ...Array(MAX_PATH * (MAX_HOPS_PER_PATH - 1)).fill(COIN_NULL)],
  }
  // Fill arguments.
  for (let i = 0; i < args.paths.length; i++) {
    for (let j = 0; j < args.paths[i].length; j++) {
      data.arguments[i * MAX_HOPS_PER_PATH + j] = pathToSwapArgument(args.paths[i][j])
    }
  }
  // Fill typeArguments.
  for (let i = 0; i < args.paths.length; i++) {
    if (args.paths[i].length === 1) {
      data.typeArguments[2 + i * (MAX_HOPS_PER_PATH - 1)] = args.tokenOut
      continue
    }
    for (let j = 0; j < args.paths[i].length; j++) {
      data.typeArguments[2 + i * (MAX_HOPS_PER_PATH - 1) + j] = args.paths[i][j].tokenOut
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

      // const payload = {
      //   version: Date.now().toString(),
      //   isSuccess: true,
      //   tokenInSymbol: "APT",
      //   tokenOutSymbol: "zUSDC",
      //   readableAmountIn: Math.random().toFixed(6),
      //   readableAmountOut: Math.random().toFixed(6),
      //   isHide: false,
      // }
      // dispatch(addNotification(payload))
      // toast(
      //   payload.isSuccess ? (
      //     <div className="rounded bg-[rgba(24,207,106,0.2)] p-4">
      //       <TitleT2>
      //         Swap {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut} {payload.tokenOutSymbol}
      //       </TitleT2>
      //       <Link
      //         href={`https://aptoscan.com/transaction/${payload.version}`}
      //         isExternal
      //         showAnchorIcon
      //         className="text-buttonSecondary"
      //       >
      //         <TitleT4>View on explorer</TitleT4>
      //       </Link>
      //     </div>
      //   ) : (
      //     <div className="rounded bg-[rgba(244,70,70,0.2)] p-4">
      //       <TitleT2>
      //         Error swapping {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut}{" "}
      //         {payload.tokenOutSymbol}
      //       </TitleT2>
      //       <Link
      //         href={`https://aptoscan.com/transaction/${payload.version}`}
      //         isExternal
      //         showAnchorIcon
      //         className="text-buttonSecondary"
      //       >
      //         <TitleT4>View on explorer</TitleT4>
      //       </Link>
      //     </div>
      //   ),
      //   {
      //     className: "z-toast",
      //     bodyClassName: "z-toast-body",
      //     progressClassName: payload.isSuccess ? "z-toast-progress-success" : "z-toast-progress-failed",
      //   },
      // )
      // return

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
              tokenInSymbol: tokenInData.symbol,
              tokenOutSymbol: tokenOutData.symbol,
              readableAmountIn: divpowToFraction(args.amountIn, tokenInData.decimals).toSignificant(6),
              readableAmountOut: divpowToFraction(args.amountOut, tokenOutData.decimals).toSignificant(6),
              isHide: false,
            }
            dispatch(addNotification(payload))
            toast(
              payload.isSuccess ? (
                <div className="rounded bg-[rgba(24,207,106,0.2)] p-4">
                  <TitleT2>
                    Swap {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut}{" "}
                    {payload.tokenOutSymbol}
                  </TitleT2>
                  <Link
                    href={`https://aptoscan.com/transaction/${payload.version}`}
                    isExternal
                    showAnchorIcon
                    className="text-buttonSecondary"
                  >
                    <TitleT4>View on explorer</TitleT4>
                  </Link>
                </div>
              ) : (
                <div className="rounded bg-[rgba(244,70,70,0.2)] p-4">
                  <TitleT2>
                    Error swapping {payload.readableAmountIn} {payload.tokenInSymbol} to {payload.readableAmountOut}{" "}
                    {payload.tokenOutSymbol}
                  </TitleT2>
                  <Link
                    href={`https://aptoscan.com/transaction/${payload.version}`}
                    isExternal
                    showAnchorIcon
                    className="text-buttonSecondary"
                  >
                    <TitleT4>View on explorer</TitleT4>
                  </Link>
                </div>
              ),
              {
                className: "z-toast",
                bodyClassName: "z-toast-body",
                progressClassName: payload.isSuccess ? "z-toast-progress-success" : "z-toast-progress-failed",
              },
            )
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
