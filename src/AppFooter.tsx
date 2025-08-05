import { BodyB2 } from './components/Texts.tsx'
import { Link } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useIsSm } from './hooks/useMedia.ts'

export default function AppFooter() {
  const isSm = useIsSm()
  return (
    <footer className="flex w-full flex-1 items-end">
      <div className="flex h-[84px] w-full content-center items-center justify-between px-[60px] lg:px-[30px] md:static md:px-[16px] sm:justify-center">
        <div className="flex items-center gap-2">
          <BodyB2 className="text-buttonSecondary">© Anqa 2024</BodyB2>

          <div className="flex items-center">
            <Link
              isBlock
              href="https://x.com/anqa_apt"
              color="primary"
              className="text-buttonSecondary"
              disableAnimation
              size="sm"
              isExternal
            >
              <Icon icon="mdi:twitter" fontSize={16} />
            </Link>
            <Link
              isBlock
              href="https://discord.gg/UR7fasRR"
              color="primary"
              className="text-buttonSecondary"
              disableAnimation
              size="sm"
              isExternal
            >
              <Icon icon="ic:baseline-discord" fontSize={16} />
            </Link>
          </div>
        </div>

        {isSm ? (
          <div />
        ) : (
          <div className="flex items-center gap-5 md:gap-0">
            <Link
              isBlock
              href="https://dev.anqa.ag"
              color="primary"
              className="text-buttonSecondary"
              size="sm"
              isExternal
              showAnchorIcon
            >
              <BodyB2>Documentations</BodyB2>
            </Link>
            <Link
              isBlock
              href="/docs/Terms_of_Use.pdf"
              color="primary"
              className="text-buttonSecondary"
              size="sm"
              isExternal
              showAnchorIcon
            >
              <BodyB2>Terms & Conditions</BodyB2>
            </Link>
            <Link
              isBlock
              href="/docs/Privacy_and_Policy.pdf"
              color="primary"
              className="text-buttonSecondary"
              size="sm"
              isExternal
              showAnchorIcon
            >
              <BodyB2>Privacy Policy</BodyB2>
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
