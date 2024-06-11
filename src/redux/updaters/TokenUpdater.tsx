import { memo, useEffect, useMemo } from "react"
import useTokenInfo from "../../hooks/useTokenInfo"
import useWhitelistedTokens from "../../hooks/useWhitelistedTokens"
import { useAppDispatch, useAppSelector } from "../hooks"
import { Token, addTokensToFollow, updateTokenData } from "../slices/token"

function TokenUpdater() {
  const dispatch = useAppDispatch()

  const whitelistedTokenMap = useWhitelistedTokens()
  useEffect(() => {
    if (whitelistedTokenMap) {
      dispatch(addTokensToFollow(Object.keys(whitelistedTokenMap)))
      const newTokenData: Record<string, Token> = {}
      for (const key of Object.keys(whitelistedTokenMap)) {
        newTokenData[key] = {
          id: key,
          name: whitelistedTokenMap[key].name,
          symbol: whitelistedTokenMap[key].symbol,
          decimals: whitelistedTokenMap[key].decimals,
          logoUrl: whitelistedTokenMap[key].logo_url,
        }
      }
      dispatch(updateTokenData(newTokenData))
    }
  }, [dispatch, whitelistedTokenMap])

  const followingTokenAddresses = useAppSelector((state) => state.token.followingTokenAddresses)
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)

  const missingTokenInfoAddresses = useMemo(() => {
    const res: string[] = []
    for (const address of followingTokenAddresses) {
      if (followingTokenData[address] === undefined) {
        res.push(address)
      }
    }
    return res
  }, [followingTokenAddresses, followingTokenData])

  const { tokenInfoMap } = useTokenInfo(missingTokenInfoAddresses)
  useEffect(() => {
    if (tokenInfoMap) {
      const newTokenData: Record<string, Token> = {}
      for (const address of Object.keys(tokenInfoMap)) {
        newTokenData[address] = {
          id: tokenInfoMap[address].id,
          name: tokenInfoMap[address].name,
          symbol: tokenInfoMap[address].symbol,
          decimals: tokenInfoMap[address].decimals,
          logoUrl: followingTokenData[address]?.logoUrl,
        }
      }
      dispatch(updateTokenData(newTokenData))
    }
  }, [dispatch, followingTokenData, tokenInfoMap])

  return null
}

const MemoTokenUpdater = memo(TokenUpdater)
export default MemoTokenUpdater
