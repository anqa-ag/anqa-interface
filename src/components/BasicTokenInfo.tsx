import { useEffect, useState } from 'react'
import { Image } from '@nextui-org/react'
import { numberWithCommas } from '../utils/number.ts'
import { getShortAddress } from '../utils/token.ts'
import { Icon } from '@iconify/react/dist/iconify.js'
import { motion } from 'framer-motion'
import { TokenWithBalance } from './modals/ModalSelectToken.tsx'
import { useTotalBalanceToken } from '../hooks/useTokenBalance.ts'
import useMigrateToken from '../hooks/useMigrateToken.ts'
import { BodyB4, Subtitle3 } from './Texts.tsx'
import Copy from './Copy.tsx'
import { ButtonBase } from './Button.tsx'

export default function BasicTokenInfo({
                                         token,
                                         onClick,
                                         onChangeHeight,
                                       }: {
  token: TokenWithBalance
  onClick?: () => void
  onChangeHeight?: (height: boolean) => void
}) {
  const migrateToken = useMigrateToken()
  const [src, setSrc] = useState(token.logoUrl || '/images/404.svg')

  useEffect(() => {
    setSrc(token.logoUrl || '/images/404.svg')
  }, [token])

  const [loading, setLoading] = useState(false)
  const onMigrate = async () => {
    try {
      if (loading) return
      setLoading(true)
      await migrateToken({ token })
    } catch (error) { /* empty */ }
    setLoading(false)
  }

  const { totalBalance, totalBalanceUsd } = useTotalBalanceToken(token)
  const emptyBalance = totalBalance.isZero()

  const [expand, setExpand] = useState(!totalBalance.isZero())
  const getHeight = (expand: boolean) => (expand && token.coinType ? 56.5 : 35)

  const onClickExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpand(!expand)
  }

  useEffect(() => {
    onChangeHeight?.(expand && !!token.coinType)
    // eslint-disable-next-line
  }, [expand, token.coinType])

  const expandIcon = (
    <Icon
      onClick={onClickExpand}
      icon={expand ? 'raphael:arrowup' : 'raphael:arrowdown'}
      color="#8B8D91"
      fontSize={14}
      className={expand ? 'pb-[2px]' : ''}
    />
  )

  return (
    <motion.div
      animate={{ height: getHeight(expand) }}
      className={' flex w-full cursor-pointer items-center gap-2'}
      onClick={onClick}
    >
      <Image
        width={32}
        height={32}
        src={src}
        onError={() => setSrc('/images/404.svg')}
        className="flex h-[32px] min-h-[32px] w-[32px] min-w-[32px] rounded-full bg-white"
        disableSkeleton
      />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex justify-between">
          <div className={`flex gap-1  ${!expand ? 'flex-col items-start' : 'items-end'}`}>
            <div className="flex items-center gap-1">
              <Subtitle3 className="select-none text-white" onClick={onClickExpand}>
                {token.symbol}
              </Subtitle3>
              {!expand && expandIcon}
            </div>

            <BodyB4
              onClick={onClickExpand}
              className={`min-h-[16px] select-none overflow-hidden text-ellipsis whitespace-nowrap text-baseGrey sm:min-h-[14px] ${expand && 'pt-px'}`}
            >
              {token.name}
            </BodyB4>
            {expand && expandIcon}
          </div>

          <div className={`flex items-end gap-1 ${!expand && 'flex-col-reverse'}`}>
            <BodyB4
              className={`min-h-[16px] text-baseGrey sm:min-h-[14px] ${emptyBalance && 'opacity-0'} ${expand && 'pt-px'}`}
            >
              {totalBalanceUsd ? `~$${numberWithCommas(totalBalanceUsd?.toSignificant(6))}` : undefined}
            </BodyB4>
            <Subtitle3 className={` text-white ${emptyBalance && 'opacity-0'}`}>
              {totalBalance ? numberWithCommas(totalBalance?.toSignificant(6)) : undefined}
            </Subtitle3>
          </div>
        </div>

        {expand && (
          <>
            {token?.coinType && (
              <div className="flex justify-between">
                <BodyB4 className="flex w-full flex-1 gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-start text-baseGrey">
                  <BodyB4 className="overflow-hidden text-ellipsis whitespace-nowrap  text-baseGrey">
                    <span className="inline-block w-[50px] text-left sm:w-[30px]">Coin:</span>{' '}
                    <Copy value={token?.coinType}>
                      <BodyB4 className="text-baseGrey">{getShortAddress(token?.coinType)}</BodyB4>
                    </Copy>
                  </BodyB4>
                  {token.coinBalance?.greaterThan(0) && (
                    <ButtonBase
                      v="primary"
                      onPress={onMigrate}
                      size="sm"
                      color="secondary"
                      className="h-fit w-fit min-w-[unset] px-[6px] py-px text-[10px] text-white"
                    >
                      {loading ? 'Migrating...' : 'Migrate'}
                    </ButtonBase>
                  )}
                </BodyB4>
                <BodyB4 className={`text-baseGrey ${emptyBalance && 'opacity-0'}`}>
                  {token.coinBalance ? numberWithCommas(token.coinBalance?.toSignificant(6)) : 0}
                </BodyB4>
              </div>
            )}

            <div className="flex justify-between">
              <BodyB4 className="flex w-full flex-1 gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-start text-baseGrey">
                <span className="inline-block w-[50px] text-left sm:w-[30px]">Fa:</span>{' '}
                <Copy value={token?.faAddress}>
                  <BodyB4 className="text-baseGrey">{getShortAddress(token?.faAddress)}</BodyB4>
                </Copy>
              </BodyB4>

              <BodyB4 className={`text-baseGrey ${emptyBalance && 'opacity-0'}`}>
                {token.faBalance ? numberWithCommas(token.faBalance?.toSignificant(6)) : 0}
              </BodyB4>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
