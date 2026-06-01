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

const CHEER_MESSAGE = {
  title: '致 EDG 的每一位战士',
  intro: '从伊斯坦布尔的初出茅庐，到洛杉矶的漫天金雨，再到如今出征伦敦——这条路你们走了三年。三年里，质疑声从未断过，但你们用冠军奖杯堵住了所有嘴巴。',
  players: [
    {
      name: 'ZmjjKK · 康康',
      tagline: 'CN 第一狙，世界顶级决斗者',
      message: '康康，你让我想起一句话：天才只是入场券，热爱才是天花板。你的狙不是工具，是刻在骨子里的直觉——开镜、甩枪、击杀，一气呵成。那些把外网解说惊到失语的精彩操作，是你每天训练十几个小时换来的肌肉记忆。从被质疑"只会炸鱼"到站在世界之巅，你用了不到两年。伦敦大师赛，继续用你的狙告诉所有人：CN 决斗者，从来不比任何人差。康神，我们等你再唱一次兰花草。',
    },
    {
      name: 'Smoggy · 张钊',
      tagline: '御驾亲征，EDG 最稳的底牌',
      message: '钊哥，你是那种不需要数据证明自己的选手——因为看过比赛的人都知道你有多强。残局一打三面不改色，封烟控图行云流水。你不是舞台上最亮的灯，但你是整个舞台的地基。每一个队友的高光时刻背后，都有你默默架枪、铺烟、拉扯空间的影子。你说过"御驾亲征"，这次伦敦，我们等着你再披龙袍。老将不死，只是愈发锋利。钊哥，伦敦见。',
    },
    {
      name: 'CHICHOO · 球球',
      tagline: '最高的丘陵，永远坚韧',
      message: '球球，你的成长是所有淀粉最骄傲的事。从那个被弹幕调侃体重的"小胖子"，到捧起世界冠军奖杯的 CHICHOO，你用了多少汗水和自律只有你自己知道。你的信息位是世界级的，每一次技能释放都像提前读懂了对手的心思。你证明了努力和天赋可以同时存在，证明了"瘦下来"的不只是体重，还有那份面对强敌时的从容。伦敦，继续做那座让对手望而生畏的"丘陵"。球球，冲！',
    },
    {
      name: 'Jieni7 · 杰尼龟',
      tagline: '超级进化水箭龟，新人的锋芒无人可挡',
      message: '杰尼，你可能是这支 EDG 里最被低估的一个——但真正懂比赛的人，都知道你的价值。从替补席到首发，从默默无闻到关键时刻站出来的英雄，你用一场又一场的稳定发挥证明了：你配得上这个位置。年轻不是短板，是你的武器。你敢打敢拼、不怯场的心态，是很多老将都羡慕的品质。"超级进化水箭龟"不只是梗，是你一次次突破自我的真实写照。杰尼，伦敦是你的新舞台，让世界记住你的 ID。',
    },
    {
      name: 'nobody · 王森旭',
      tagline: 'EDG 的大脑，CN 瓦最强 IGL',
      message: '王哥，如果说康康是 EDG 的尖刀，那你就是 EDG 的灵魂。指挥位是最容易被忽视的位置——镜头永远对准杀人的决斗者，很少有人能看到你在背后做了多少功课。每一张图的站位研究，每一个战术的反复推演，每一个残局的冷静调度——这些看不见的努力，才是 EDG 能走到今天的基石。从"电工钳"的玩笑到冠军指挥的蜕变，你经历了太多的压力和质疑，但你从没停下前进的脚步。王哥，伦敦的舞台上继续用你的指挥才华带领兄弟们冲锋。CN 瓦需要你这样的 IGL。',
    },
  ],
  teamMessage: '五个人，五种风格，一颗冠军的心。EDG 从来不是靠某一个人的个人能力赢比赛——你们赢在信任，赢在默契，赢在那个无论落后多少分都坚信能翻盘的信念。CN 瓦等了这么多年，等到的不只是一个冠军，等到的是属于我们自己的王朝。伦敦大师赛，我们不看衰，不毒奶，就安安静静守在屏幕前，看你们打每一场。',
  closing: 'EDG，去伦敦把冠军再带回来一次。淀粉，永远在。',
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
            >
              {/* ===== 桌面端左右分栏 (flex), 移动端居中 ===== */}
              <div className="flex flex-col lg:flex-row lg:gap-8 py-8 md:py-12 lg:py-16">

                {/* ========== 左侧 Hero 主内容 ========== */}
                <div className="relative flex-1 text-center lg:text-left overflow-hidden lg:max-w-[58%] lg:min-w-0">

                  {/* 背景光晕 */}
                  <div className="absolute top-0 left-1/2 lg:left-1/3 -translate-x-1/2 w-[400px] h-[250px] md:w-[500px] md:h-[320px]
                    bg-[radial-gradient(ellipse,_rgba(225,6,0,0.10)_0%,_rgba(225,6,0,0.04)_40%,_transparent_70%)] pointer-events-none z-0" />
                  <div className="absolute top-1/2 left-1/3 w-[200px] h-[150px] md:w-[300px] md:h-[200px]
                    bg-[radial-gradient(ellipse,_rgba(99,102,241,0.05)_0%,_transparent_60%)] pointer-events-none z-0" />

                  {/* 节点连线 SVG */}
                  <svg
                    className="absolute inset-0 pointer-events-none hidden lg:block z-0"
                    viewBox="0 0 700 500"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <line x1="15" y1="60" x2="15" y2="200"
                      stroke="rgba(225,6,0,0.08)" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="15" cy="60" r="2" fill="rgba(225,6,0,0.2)" />
                    <circle cx="15" cy="200" r="2" fill="rgba(225,6,0,0.2)" />
                    <line x1="680" y1="100" x2="680" y2="260"
                      stroke="rgba(212,168,83,0.08)" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="680" cy="100" r="2" fill="rgba(212,168,83,0.2)" />
                    <circle cx="680" cy="260" r="2" fill="rgba(212,168,83,0.2)" />
                    <line x1="15" y1="440" x2="690" y2="440"
                      stroke="rgba(99,102,241,0.06)" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="350" cy="440" r="2" fill="rgba(99,102,241,0.15)" />
                  </svg>

                  {/* 浮动选手标签 - 左上方：球球 (保持在左栏内) */}
                  <div className="absolute top-0 left-0 hidden lg:block z-10">
                    <DataBadge name="CHICHOO · 球球" tagline="最高的丘陵" variant="gold" delay={0.1} />
                  </div>
                  {/* 浮动选手标签 - 左中：康康 */}
                  <div className="absolute top-[130px] left-0 hidden lg:block z-10">
                    <DataBadge name="ZmjjKK · 康康" tagline="VCT CN 最强一突" variant="primary" delay={0.3} />
                  </div>
                  {/* 浮动选手标签 - 栏内右上：张钊 */}
                  <div className="absolute top-2 right-2 hidden lg:block z-10">
                    <DataBadge name="Smoggy · 张钊" tagline="御驾亲征" variant="green" delay={0.5} />
                  </div>
                  {/* 浮动选手标签 - 栏内右下：王森旭 */}
                  <div className="absolute top-[130px] right-2 hidden lg:block z-10">
                    <DataBadge name="nobody · 王森旭" tagline="电工钳最佳代言人" variant="gold" delay={0.7} />
                  </div>

                  {/* 品牌徽章 */}
                  <motion.div
                    className="relative inline-flex items-center gap-2 rounded-full border border-primary/20
                      bg-primary/[0.06] backdrop-blur-sm px-4 py-1.5 mb-6 z-10"
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

                  {/* 主标题 */}
                  <h1 className="relative text-[clamp(42px,6vw,64px)] font-black leading-none tracking-tighter z-10">
                    <span className="bg-gradient-to-b from-text-primary via-text-primary to-primary/50 bg-clip-text text-transparent">
                      EDG
                    </span>
                    <span className="text-primary mx-0.5">·</span>
                    <span className="bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent">
                      VCT London
                    </span>
                  </h1>

                  {/* 副标题 */}
                  <p className="relative mt-4 text-[clamp(15px,2vw,18px)] text-text-secondary max-w-lg lg:max-w-none leading-relaxed z-10">
                    EDward Gaming 出征伦敦大师赛 · 为 CN 荣耀而战
                  </p>

                  {/* 信息条 */}
                  <div className="relative mt-6 flex items-center justify-center lg:justify-start gap-4 md:gap-6 text-caption md:text-body-sm text-text-tertiary z-10">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      2026年6月12日 · 伦敦
                    </span>
                    <span className="w-px h-3 bg-white/[0.12]" />
                    <span>淘汰赛阶段</span>
                    <span className="w-px h-3 bg-white/[0.12]" />
                    <span>CN #1 Seed</span>
                  </div>

                  {/* 双 CTA */}
                  <div className="relative mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap z-10">
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

                  {/* 快捷导航 */}
                  <div className="relative mt-6 flex items-center justify-center lg:justify-start gap-2 flex-wrap z-10">
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

                  {/* 合作伙伴 */}
                  <div className="relative mt-10 md:mt-12 flex items-center justify-center lg:justify-start gap-6 md:gap-8 opacity-25 hover:opacity-40 transition-opacity duration-500 z-10">
                    <span className="text-caption text-text-tertiary tracking-widest uppercase">Partners</span>
                    <div className="hidden sm:block h-4 w-px bg-white/[0.15]" />
                    <div className="flex items-center gap-5 md:gap-8 flex-wrap justify-center lg:justify-start">
                      {SPONSORS.map((brand) => (
                        <span key={brand.name} className="text-xs md:text-sm font-bold text-text-tertiary uppercase tracking-wider hover:text-text-secondary transition-colors">
                          {brand.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ========== 右侧：应援寄语面板 — 从上往下填满 ========== */}
                <div className="hidden lg:block lg:w-[42%] lg:min-w-[320px] lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
                  <div
                    className="overflow-y-auto pr-1 lg:max-h-[calc(100vh-6rem)]
                      [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-5 md:p-6">
                      <h3 className="text-lg font-bold text-primary mb-1 tracking-wide">
                        {CHEER_MESSAGE.title}
                      </h3>
                      <p className="text-caption text-text-tertiary mb-5 leading-relaxed italic">
                        {CHEER_MESSAGE.intro}
                      </p>

                      <div className="mb-5 h-px bg-gradient-to-r from-primary/40 via-white/[0.08] to-transparent" />

                      <div className="space-y-5">
                        {CHEER_MESSAGE.players.map((player, i) => (
                          <motion.div
                            key={player.name}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="pl-4 border-l-2 border-primary/25 hover:border-primary/50 transition-colors duration-300"
                          >
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-body-sm font-bold text-text-primary">{player.name}</span>
                              <span className="text-[11px] text-primary/60 bg-primary/[0.06] px-1.5 py-0.5 rounded font-medium">
                                {player.tagline}
                              </span>
                            </div>
                            <p className="text-caption text-text-tertiary leading-relaxed">{player.message}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="my-5 h-px bg-gradient-to-r from-primary/40 via-white/[0.08] to-transparent" />

                      <p className="text-caption text-text-secondary leading-relaxed">
                        {CHEER_MESSAGE.teamMessage}
                      </p>

                      <p className="mt-5 text-body-sm font-bold text-primary text-center tracking-wide">
                        {CHEER_MESSAGE.closing}
                      </p>
                    </div>
                  </div>
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
