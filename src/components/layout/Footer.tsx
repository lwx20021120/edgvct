import { Container } from './Container'
import { ShareButton } from '../shared/ShareButton'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gradient-to-t from-[#050505] to-[#111] pb-[env(safe-area-inset-bottom)]">
      <Container className="py-8 md:py-10">
        <div className="flex flex-col items-center text-center gap-6 md:flex-row md:justify-between md:text-left">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
            <div className="h-28 w-28 rounded-xl bg-white p-2 overflow-hidden
              shadow-[0_0_15px_rgba(225,6,0,0.1)]">
              <img
                src="/qr-wechat-group.png"
                alt="微信群二维码"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
            <div>
              <p className="text-body-sm font-semibold text-text-primary">
                扫码加入 EDG 淀粉群
              </p>
              <p className="mt-1 text-caption text-text-tertiary">
                一起看比赛，为 EDG 加油！
              </p>
            </div>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <ShareButton />
            <p className="text-caption text-text-tertiary">
              © 2026 EDG VCT London Fan Hub
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
