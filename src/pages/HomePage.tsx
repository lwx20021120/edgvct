import { ErrorBoundary } from '../components/shared/ErrorBoundary'
import { WallSection } from '../components/wall/WallSection'

/* ──────────────── 设计令牌（来自 Ardot 画布 node tree）──────────────── */
const COLORS = {
  accent: '#E11D48',
  bg: '#000000',
  bgCard: '#0C0C0D',
  bgSecondary: '#09090B',
  border: '#312E81',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#666666',
} as const

/* ──────────────── Header ──────────────── */
function Header() {
  return (
    <header className="sticky top-0 z-50 px-[60px] h-[77px] flex items-center justify-between bg-transparent">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span
          className="text-[24px] font-bold tracking-[4px]"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.accent }}
        >
          EDG
        </span>
        <div className="w-px h-5" style={{ backgroundColor: COLORS.border }} />
        <span
          className="text-[12px] tracking-[3px]"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: COLORS.textSecondary, fontWeight: 500 }}
        >
          VCT LONDON
        </span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-8 text-[14px]" style={{ fontWeight: 500 }}>
        <span style={{ color: COLORS.textPrimary, cursor: 'pointer' }}>直播</span>
        <span style={{ color: COLORS.textSecondary, cursor: 'pointer' }}>赛程</span>
        <span style={{ color: COLORS.textSecondary, cursor: 'pointer' }}>选手</span>
        <span style={{ color: COLORS.textSecondary, cursor: 'pointer' }}>应援墙</span>
      </nav>

      {/* CTA Button */}
      <button
        className="px-6 py-[10px] text-[14px] font-semibold tracking-[1.5px] transition-colors"
        style={{ backgroundColor: COLORS.accent, color: '#FFFFFF' }}
      >
        进入直播间
      </button>
    </header>
  )
}

/* ──────────────── Section Header ──────────────── */
function SectionHeader({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <span
        className="text-[14px] tracking-[2px]"
        style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.accent, fontWeight: 500 }}
      >
        {tag}
      </span>
      <h2
        className="text-[40px] font-bold"
        style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
      >
        {title}
      </h2>
      <p className="text-[18px]" style={{ color: COLORS.textSecondary }}>
        {desc}
      </p>
    </div>
  )
}

/* ──────────────── Neon Divider ──────────────── */
function Divider() {
  return (
    <div className="w-full flex justify-center py-24">
      <div
        className="w-full max-w-[1240px] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.border}66, ${COLORS.accent}33, ${COLORS.border}66, transparent)`,
        }}
      />
    </div>
  )
}

/* ──────────────── HomePage ──────────────── */
export function HomePage() {
  return (
    <div className="min-h-dvh w-full" style={{ backgroundColor: COLORS.bg }}>
      <Header />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="flex flex-col items-center gap-10"
        style={{
          padding: '120px 100px 100px',
          background: `linear-gradient(180deg, ${COLORS.accent}14 0%, transparent 100%)`,
        }}
      >
        {/* Badge */}
        <div
          className="flex items-center gap-3 px-4 py-[6px]"
          style={{
            backgroundColor: COLORS.bgCard,
            boxShadow: `0 0 12px ${COLORS.accent}4D`,
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor: COLORS.accent,
              boxShadow: `0 0 8px ${COLORS.accent}CC`,
            }}
          />
          <span
            className="text-[14px] tracking-[2px] font-medium"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.accent }}
          >
            LIVE · VCT 伦敦大师赛 2025
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[72px] font-bold text-center leading-[1.28] max-w-[800px]"
          style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            color: COLORS.textPrimary,
            textShadow: `
              0 0 80px ${COLORS.accent}26,
              0 0 40px ${COLORS.accent}4D,
              0 0 16px ${COLORS.accent}99
            `,
          }}
        >
          无畏契约 · 伦敦大师赛
        </h1>

        {/* Subtitle */}
        <p className="text-[24px] text-center max-w-[600px]" style={{ color: COLORS.textSecondary }}>
          EDward Gaming · CN 电竞荣耀
        </p>
        <p
          className="text-[18px] text-center max-w-[560px] leading-[28px]"
          style={{ color: COLORS.textSecondary }}
        >
          直播、赛中数据、选手信息、应援墙一站聚合。与万千粉丝一起，为 EDG 呐喊！
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            className="px-10 py-4 text-[18px] font-bold tracking-[2px] transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.accent,
              color: '#FFFFFF',
              boxShadow: `0 0 24px ${COLORS.accent}66, 0 0 48px ${COLORS.accent}33`,
            }}
          >
            进入直播间
          </button>
          <button
            className="px-[38px] py-[14px] text-[18px] font-semibold tracking-[2px] transition-colors hover:border-opacity-80"
            style={{
              backgroundColor: 'transparent',
              color: COLORS.textPrimary,
              border: `2px solid ${COLORS.border}`,
            }}
          >
            查看赛程
          </button>
        </div>

        {/* Visual Placeholder */}
        <div
          className="w-[800px] h-[360px] flex items-center justify-center"
          style={{
            background: `linear-gradient(180deg, ${COLORS.accent}0D 0%, transparent 100%)`,
            border: `1px solid ${COLORS.border}80`,
          }}
        >
          <span
            className="text-[14px] tracking-[1px]"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textSecondary }}
          >
            赛事集锦 / 直播画面
          </span>
        </div>
      </section>

      <Divider />

      {/* ═══════════════ SCHEDULE (01) ═══════════════ */}
      <section
        className="flex flex-col gap-12 px-[100px] py-[100px]"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
        }}
      >
        <SectionHeader
          tag="01 — 赛程安排"
          title="伦敦大师赛 · 赛程"
          desc="实时追踪 EDG 的比赛进度，不错过每一个精彩瞬间"
        />

        <div className="flex gap-6">
          {[
            { status: 'LIVE', time: '6月5日 21:00', teams: 'EDG vs SEN', stage: '胜者组半决赛', live: true },
            { status: 'UPCOMING', time: '6月7日 23:00', teams: 'TBD vs TBD', stage: '胜者组决赛', live: false },
            { status: 'UPCOMING', time: '6月9日 02:00', teams: 'TBD vs TBD', stage: '总决赛', live: false },
          ].map((match, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col gap-4 p-6"
              style={{
                backgroundColor: COLORS.bgCard,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="text-[12px] font-bold tracking-[2px]"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  color: match.live ? COLORS.accent : COLORS.textSecondary,
                }}
              >
                {match.live && (
                  <span
                    className="inline-block w-[6px] h-[6px] rounded-full mr-2 align-middle"
                    style={{
                      backgroundColor: COLORS.accent,
                      boxShadow: `0 0 8px ${COLORS.accent}`,
                    }}
                  />
                )}
                {match.status}
              </span>
              <span className="text-[14px]" style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
                {match.time}
              </span>
              <span
                className="text-[24px] font-bold"
                style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
              >
                {match.teams}
              </span>
              <span className="text-[14px]" style={{ color: COLORS.textTertiary }}>
                {match.stage}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ═══════════════ PLAYERS (02) ═══════════════ */}
      <section className="flex flex-col gap-12 px-[100px] py-[100px]">
        <SectionHeader
          tag="02 — 选手阵容"
          title="EDG 明星选手"
          desc="了解每一位为荣耀而战的选手"
        />

        <div className="flex gap-5">
          {[
            { name: 'ZmjjKK', role: '决斗者', stats: { acs: '285', kd: '1.32', hs: '28%' } },
            { name: 'nobody', role: '控场者', stats: { acs: '210', kd: '1.15', hs: '22%' } },
            { name: 'Smoggy', role: '先锋', stats: { acs: '238', kd: '1.24', hs: '25%' } },
          ].map((player, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col"
              style={{ backgroundColor: COLORS.bgCard }}
            >
              {/* Photo placeholder */}
              <div
                className="h-[240px] flex items-center justify-center"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.accent}1A 0%, ${COLORS.bgCard} 100%)`,
                }}
              >
                <span
                  className="text-[12px]"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}
                >
                  选手照片
                </span>
              </div>
              {/* Info */}
              <div className="flex flex-col gap-[6px] p-5">
                <span
                  className="text-[20px] font-bold"
                  style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
                >
                  {player.name}
                </span>
                <span className="text-[14px]" style={{ color: COLORS.accent }}>
                  {player.role}
                </span>
                {/* Stats row */}
                <div className="w-full h-px my-2" style={{ backgroundColor: '#FFFFFF1A' }} />
                <div className="flex gap-0 mt-1">
                  {Object.entries(player.stats).map(([key, val]) => (
                    <div key={key} className="flex-1 flex flex-col gap-1 py-1">
                      <span
                        className="text-[20px] font-bold"
                        style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
                      >
                        {val}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: COLORS.textSecondary, fontWeight: 500 }}
                      >
                        {key.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ═══════════════ FAN WALL (03) ═══════════════ */}
      <section
        className="flex flex-col gap-12 px-[100px] py-[100px]"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
        }}
      >
        <SectionHeader
          tag="03 — 应援加油"
          title="粉丝应援墙"
          desc="留下你的祝福，与万千粉丝一起为 EDG 呐喊"
        />

        {/* Featured messages */}
        <div className="flex gap-4">
          {[
            { user: '电竞追梦人', msg: 'EDG冲！伦敦捧杯！CN VALORANT加油，这是我们的时代！' },
            { user: 'Valorantfans', msg: '康康加油！Smoggy最棒！从冠军赛开始就在关注了' },
            { user: 'EDG死忠粉', msg: '每天必看直播！EDG的配合越来越默契了，期待伦敦的精彩表现' },
          ].map((msg, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col gap-4 p-6"
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${COLORS.border}66`,
              }}
            >
              <span className="text-[14px] font-semibold" style={{ color: COLORS.accent }}>
                {msg.user}
              </span>
              <p className="text-[16px] leading-6" style={{ color: COLORS.textPrimary }}>
                {msg.msg}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Wall */}
        <ErrorBoundary>
          <WallSection />
        </ErrorBoundary>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section
        className="flex flex-col items-center gap-8 px-[100px] py-[140px] mx-auto max-w-[1040px]"
        style={{ backgroundColor: '#020204' }}
      >
        <h2
          className="text-[36px] font-bold text-center"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.accent }}
        >
          为什么选择 EDG 应援站？
        </h2>
        <p
          className="text-[16px] text-center max-w-[900px] leading-[1.6]"
          style={{ color: COLORS.textSecondary }}
        >
          一站聚合 EDG 所有赛事信息，从直播到数据、从选手到社区
        </p>

        <div className="flex flex-col gap-4 w-full max-w-[1000px] mt-4">
          {[
            { title: '实时直播追踪', tag: 'Live Coverage', desc: '多平台直播源聚合，不放过 EDG 任何一场比赛。自动切换最优画质，支持弹幕互动与实时比分同步。' },
            { title: '赛中数据面板', tag: 'Match Analytics', desc: '选手 ACS、K/D、爆头率实时更新，赛后自动生成数据分析报告。支持历史数据回溯与对比。' },
            { title: '选手资料档案', tag: 'Player Profiles', desc: '每位选手的完整资料：英雄池热力图、近期状态评分、高光时刻集锦。数据来源 Riot 官方 API 与社区精选。' },
            { title: '粉丝应援社区', tag: 'Fan Community', desc: '应援墙实时互动，为选手加油鼓劲。支持文字、图片、语音多种应援形式，精选应援直达选手。' },
            { title: '赛事日程管理', tag: 'Schedule & Alerts', desc: 'EDG 比赛日程一目了然，赛前推送提醒、赛中实时比分、赛后自动生成战报。支持日历订阅与多渠道通知。' },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 flex flex-col gap-3"
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: '12px',
              }}
            >
              <h3
                className="text-[22px] font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {feature.title}
              </h3>
              <span
                className="text-[14px] font-semibold"
                style={{ color: COLORS.accent }}
              >
                {feature.tag}
              </span>
              <p
                className="text-[15px] leading-[1.625]"
                style={{ color: COLORS.textSecondary }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-[16px] font-semibold mt-8 text-center max-w-[900px]"
          style={{ color: COLORS.accent }}
        >
          更多功能持续开发中。如果你有想法，欢迎在应援墙留言或访问我们的 GitHub 仓库贡献代码。
        </p>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="flex flex-col items-center gap-8 py-[120px] px-[100px]">
        <h2
          className="text-[48px] font-bold text-center max-w-[700px]"
          style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            color: COLORS.textPrimary,
            textShadow: `0 0 40px ${COLORS.accent}26`,
          }}
        >
          准备好为 EDG 呐喊了吗？
        </h2>
        <p className="text-[18px] text-center max-w-[500px]" style={{ color: COLORS.textSecondary }}>
          加入应援站，不错过每一场精彩比赛
        </p>
        <button
          className="px-12 py-[18px] text-[18px] font-bold tracking-[2px] transition-opacity hover:opacity-90"
          style={{
            backgroundColor: COLORS.accent,
            color: '#FFFFFF',
            boxShadow: `0 0 24px ${COLORS.accent}66`,
          }}
        >
          立即进入直播间
        </button>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        className="flex flex-col gap-10 px-[100px] pt-[60px] pb-5"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
        }}
      >
        <div className="flex justify-between items-start">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[24px] font-bold tracking-[4px]"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.accent }}
            >
              EDG
            </span>
            <span
              className="text-[12px] tracking-[2px]"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textSecondary, fontWeight: 500 }}
            >
              VCT LONDON 2025
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="flex justify-between items-center pt-5"
          style={{ borderTop: `1px solid ${COLORS.border}4D` }}
        >
          <span className="text-[12px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}>
            © 2025 EDG VCT London Fan Site. All rights reserved.
          </span>
          <span className="text-[12px]" style={{ color: COLORS.textTertiary }}>
            Made with ❤️ by EDG fans
          </span>
        </div>
      </footer>
    </div>
  )
}
