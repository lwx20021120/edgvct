import { motion } from 'framer-motion'
import { Container } from '../components/layout/Container'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Section } from '../components/layout/Section'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'
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
              className="relative text-center py-12 md:py-20"
            >
              {/* 背景发光 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] md:w-[500px] md:h-[300px]
                bg-[radial-gradient(ellipse,_rgba(225,6,0,0.12)_0%,_transparent_70%)] pointer-events-none" />

              {/* 主标题 - 渐变文字 */}
              <h1 className="relative text-[clamp(40px,7vw,64px)] font-black leading-none tracking-tighter">
                <span className="bg-gradient-to-b from-text-primary via-text-primary to-primary/60 bg-clip-text text-transparent">
                  EDG
                </span>
                <span className="text-primary">·</span>
                <span className="bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent">
                  VCT London
                </span>
              </h1>

              {/* 副标题 - 发光红色文字 */}
              <p className="mt-4 text-[clamp(16px,2.5vw,20px)] font-bold text-primary inline-block px-4 py-1 rounded-full
                border border-primary/20 bg-primary/5 backdrop-blur-sm"
                style={{ animation: 'pulse-glow 2s infinite' }}>
                为 EDward Gaming 加油 🔥
              </p>

              {/* 信息条 */}
              <div className="mt-6 flex items-center justify-center gap-4 md:gap-6 text-caption md:text-body-sm text-text-tertiary">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  2026年6月12日 · 伦敦
                </span>
                <span className="text-border-light">|</span>
                <span>淘汰赛阶段</span>
                <span className="text-border-light">|</span>
                <span>CN #1 Seed</span>
              </div>

              {/* 快捷滚动按钮 */}
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                {['视频','选手','赛程','应援'].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => document.getElementById(['video','players','schedule','wall'][i])?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full border border-white/10 hover:border-primary/30 px-4 py-2 text-body-sm font-medium
                      text-text-secondary hover:text-primary bg-white/5 hover:bg-primary/5 transition-all duration-200"
                  >
                    {label}
                  </button>
                ))}
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
