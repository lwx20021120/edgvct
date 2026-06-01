import { motion } from 'framer-motion'
import { Container } from '../components/layout/Container'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Section } from '../components/layout/Section'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'
import { DataBadge } from '../components/shared/DataBadge'
import { VideoSection } from '../components/video/VideoSection'
import { VideoUpload } from '../components/video/VideoUpload'
import { PlayerSection } from '../components/players/PlayerSection'
import { ScheduleSection } from '../components/schedule/ScheduleSection'
import { WallSection } from '../components/wall/WallSection'

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
}

const SPONSORS = [
  { name: 'HyperX', url: '#' },
  { name: 'Intel', url: '#' },
  { name: 'Monster', url: '#' },
  { name: 'Razer', url: '#' },
  { name: 'AutoFull', url: '#' },
  { name: 'Taobao', url: '#' },
]

export function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      <Header />
      <main className="pt-14 md:pt-16">
        <Container>
          {/* Hero */}
          <Section id="hero" title="" className="pt-6 md:pt-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative text-center py-12 md:py-16 lg:py-20"
            >
              {/* 背景发光 - 多层光晕 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] md:w-[600px] md:h-[360px]
                bg-[radial-gradient(ellipse,_rgba(225,6,0,0.10)_0%,_rgba(225,6,0,0.04)_40%,_transparent_70%)] pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 w-[200px] h-[150px] md:w-[300px] md:h-[200px]
                bg-[radial-gradient(ellipse,_rgba(99,102,241,0.05)_0%,_transparent_60%)] pointer-events-none" />

              {/* 节点连接线 SVG - 纯装饰 */}
              <svg
                className="absolute inset-0 pointer-events-none hidden lg:block"
                viewBox="0 0 1200 500"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* 从顶部数据标签到右侧底部 */}
                <line x1="880" y1="80" x2="1020" y2="380"
                  stroke="rgba(225,6,0,0.10)" strokeWidth="1" strokeDasharray="4 6"
                  style={{ animation: 'dash-flow 8s linear infinite' }} />
                <circle cx="880" cy="80" r="2.5" fill="rgba(225,6,0,0.25)"
                  style={{ animation: 'node-pulse 3s ease-in-out infinite' }} />
                <circle cx="1020" cy="380" r="2.5" fill="rgba(225,6,0,0.25)"
                  style={{ animation: 'node-pulse 3s ease-in-out 1.5s infinite' }} />
                {/* 从左侧数据标签到右下 */}
                <line x1="150" y1="100" x2="180" y2="350"
                  stroke="rgba(99,102,241,0.08)" strokeWidth="1" strokeDasharray="4 6"
                  style={{ animation: 'dash-flow 8s linear 2s infinite' }} />
                <circle cx="150" cy="100" r="2.5" fill="rgba(99,102,241,0.2)"
                  style={{ animation: 'node-pulse 3s ease-in-out 0.5s infinite' }} />
                <circle cx="180" cy="350" r="2.5" fill="rgba(99,102,241,0.2)"
                  style={{ animation: 'node-pulse 3s ease-in-out 2s infinite' }} />
                {/* 交叉连线 */}
                <line x1="150" y1="100" x2="880" y2="80"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 8" />
                <line x1="180" y1="350" x2="1020" y2="380"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 8" />
              </svg>

              {/* 浮动数据标签 - 左上 */}
              <div className="absolute top-0 left-4 md:left-12 hidden lg:block">
                <DataBadge label="康康 · ACS" value="285.3" variant="green" delay={0.2} />
              </div>
              {/* 浮动数据标签 - 右上 */}
              <div className="absolute top-4 right-4 md:right-12 hidden lg:block">
                <DataBadge label="Smoggy · K/D" value="1.42" variant="gold" delay={0.4} />
              </div>
              {/* 浮动数据标签 - 左下 */}
              <div className="absolute bottom-24 md:bottom-20 left-8 md:left-24 hidden lg:block">
                <DataBadge label="CHICHOO · HS%" value="32.5" variant="green" delay={0.6} />
              </div>
              {/* 浮动数据标签 - 右下 */}
              <div className="absolute bottom-12 md:bottom-8 right-12 md:right-28 hidden lg:block">
                <DataBadge label="nobody · KPR" value="0.89" variant="primary" delay={0.8} />
              </div>

              {/* 品牌徽章 - DeFi 药丸风格 */}
              <motion.div
                className="relative inline-flex items-center gap-2 rounded-full border border-primary/20
                  bg-primary/[0.06] backdrop-blur-sm px-4 py-1.5 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-body-sm font-semibold text-primary tracking-wide">
                  CN #1 Seed · VCT Masters London
                </span>
              </motion.div>

              {/* 主标题 - 渐变文字 */}
              <h1 className="relative text-[clamp(44px,7vw,68px)] font-black leading-none tracking-tighter">
                <span className="bg-gradient-to-b from-text-primary via-text-primary to-primary/50 bg-clip-text text-transparent">
                  EDG
                </span>
                <span className="text-primary mx-0.5">·</span>
                <span className="bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent">
                  VCT London
                </span>
              </h1>

              {/* 副标题 */}
              <p className="mt-4 text-[clamp(15px,2vw,18px)] text-text-secondary max-w-lg mx-auto leading-relaxed">
                EDward Gaming 出征伦敦大师赛 · 为 CN 荣耀而战
              </p>

              {/* 信息条 */}
              <div className="mt-6 flex items-center justify-center gap-4 md:gap-6 text-caption md:text-body-sm text-text-tertiary">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  2026年6月12日 · 伦敦
                </span>
                <span className="w-px h-3 bg-white/[0.12]" />
                <span>淘汰赛阶段</span>
                <span className="w-px h-3 bg-white/[0.12]" />
                <span>CN #1 Seed</span>
              </div>

              {/* 双 CTA 按钮 */}
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full bg-primary hover:bg-primary-hover px-6 py-2.5 text-body-sm font-semibold
                    text-white shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:shadow-[0_0_30px_rgba(225,6,0,0.45)]
                    transition-all duration-200 active:scale-95"
                >
                  观看应援视频
                </button>
                <button
                  onClick={() => document.getElementById('wall')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border border-white/[0.12] hover:border-primary/30 px-6 py-2.5 text-body-sm font-semibold
                    text-text-secondary hover:text-primary bg-white/[0.04] hover:bg-primary/[0.06]
                    backdrop-blur-sm transition-all duration-200 active:scale-95"
                >
                  加入应援 🔥
                </button>
              </div>

              {/* 快捷导航标签 */}
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                {['视频','选手','赛程','应援'].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => document.getElementById(['video','players','schedule','wall'][i])?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full border border-white/[0.06] hover:border-primary/20 px-3 py-1.5 text-caption font-medium
                      text-text-tertiary hover:text-primary bg-transparent hover:bg-primary/[0.04] transition-all duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 合作伙伴标志行 */}
              <div className="mt-12 md:mt-16 flex items-center justify-center gap-6 md:gap-8 opacity-25 hover:opacity-40 transition-opacity duration-500">
                <span className="text-caption text-text-tertiary tracking-widest uppercase">
                  Partners
                </span>
                <div className="hidden sm:block h-4 w-px bg-white/[0.15]" />
                <div className="flex items-center gap-5 md:gap-8 flex-wrap justify-center">
                  {SPONSORS.map((brand) => (
                    <span
                      key={brand.name}
                      className="text-xs md:text-sm font-bold text-text-tertiary uppercase tracking-wider
                        hover:text-text-secondary transition-colors"
                    >
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Section>

          {/* Video Section */}
          <ErrorBoundary>
            <motion.div {...fadeInUp}>
              <Section id="video" title="应援视频轮播" subtitle="B站视频 + 粉丝自制，循环播放为EDG加油">
                <VideoSection />
              </Section>
            </motion.div>
            <motion.div {...fadeInUp}>
              <VideoUpload />
            </motion.div>
          </ErrorBoundary>

          {/* Players Section */}
          <ErrorBoundary>
            <motion.div {...fadeInUp}>
              <Section
                id="players"
                title="赛中数据"
                subtitle="选手实时数据与英雄池，MVP 标记高亮"
              >
                <PlayerSection />
              </Section>
            </motion.div>
          </ErrorBoundary>

          {/* Schedule Section */}
          <ErrorBoundary>
            <motion.div {...fadeInUp}>
              <Section
                id="schedule"
                title="赛程信息"
                subtitle="EDG 比赛时间与地图详情，倒计时提醒"
              >
                <ScheduleSection />
              </Section>
            </motion.div>
          </ErrorBoundary>

          {/* Wall Section */}
          <ErrorBoundary>
            <motion.div {...fadeInUp}>
              <Section
                id="wall"
                title="应援墙"
                subtitle="写下你的加油，让 EDG 选手们看到！"
              >
                <WallSection />
              </Section>
            </motion.div>
          </ErrorBoundary>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
