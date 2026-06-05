# 给 Claude：Hero 右侧应援面板 — 完整实现方案

> 目标：用真挚的选手寄语填满大屏幕右侧空白，不破坏现有布局。

---

## 第一步：在 HomePage.tsx 的 Hero Section 外层改成 grid 布局

找到 `src/pages/HomePage.tsx`，把 Hero 的 `<motion.div>` 内部从居中布局改成左右分栏。

当前是：
```tsx
<Section id="hero" title="" className="pt-6 md:pt-10">
  <motion.div ... className="relative text-center py-12 md:py-16 lg:py-20">
    {/* 所有内容 */}
  </motion.div>
</Section>
```

改成：
```tsx
<Section id="hero" title="" className="pt-6 md:pt-10">
  <motion.div ... className="relative">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-12 md:py-16 lg:py-20">
      
      {/* ========== 左侧：Hero 主内容 (7列) ========== */}
      <div className="lg:col-span-7 text-center lg:text-left">
        {/* 品牌徽章、主标题、副标题、CTA按钮、导航标签、合作伙伴行 — 全部原样放这里 */}
      </div>

      {/* ========== 右侧：应援寄语面板 (5列) ========== */}
      <div className="hidden lg:block lg:col-span-5">
        {/* 应援卡片 — 见下方完整代码 */}
      </div>

    </div>
  </motion.div>
</Section>
```

## 第二步：在 HomePage.tsx 顶部添加应援数据（放在组件外面作为常量）

```tsx
const CHEER_MESSAGE = {
  title: "致 EDG 的每一位战士",
  intro: "从伊斯坦布尔的初出茅庐，到洛杉矶的漫天金雨，再到如今出征伦敦——这条路你们走了三年。三年里，质疑声从未断过，但你们用冠军奖杯堵住了所有嘴巴。",
  players: [
    {
      name: "ZmjjKK · 康康",
      tagline: "CN 第一狙，世界顶级决斗者",
      message: "康康，你让我想起一句话：天才只是入场券，热爱才是天花板。你的狙不是工具，是刻在骨子里的直觉——开镜、甩枪、击杀，一气呵成。那些把外网解说惊到失语的精彩操作，是你每天训练十几个小时换来的肌肉记忆。从被质疑"只会炸鱼"到站在世界之巅，你用了不到两年。伦敦大师赛，继续用你的狙告诉所有人：CN 决斗者，从来不比任何人差。康神，我们等你再唱一次兰花草。"
    },
    {
      name: "Smoggy · 张钊",
      tagline: "御驾亲征，EDG 最稳的底牌",
      message: "钊哥，你是那种不需要数据证明自己的选手——因为看过比赛的人都知道你有多强。残局一打三面不改色，封烟控图行云流水。你不是舞台上最亮的灯，但你是整个舞台的地基。每一个队友的高光时刻背后，都有你默默架枪、铺烟、拉扯空间的影子。你说过"御驾亲征"，这次伦敦，我们等着你再披龙袍。老将不死，只是愈发锋利。钊哥，伦敦见。"
    },
    {
      name: "CHICHOO · 球球",
      tagline: "最高的丘陵，永远坚韧",
      message: "球球，你的成长是所有淀粉最骄傲的事。从那个被弹幕调侃体重的"小胖子"，到捧起世界冠军奖杯的 CHICHOO，你用了多少汗水和自律只有你自己知道。你的信息位是世界级的，每一次技能释放都像提前读懂了对手的心思。你证明了努力和天赋可以同时存在，证明了"瘦下来"的不只是体重，还有那份面对强敌时的从容。伦敦，继续做那座让对手望而生畏的"丘陵"。球球，冲！"
    },
    {
      name: "Jieni7 · 杰尼龟",
      tagline: "超级进化水箭龟，新人的锋芒无人可挡",
      message: "杰尼，你可能是这支 EDG 里最被低估的一个——但真正懂比赛的人，都知道你的价值。从替补席到首发，从默默无闻到关键时刻站出来的英雄，你用一场又一场的稳定发挥证明了：你配得上这个位置。年轻不是短板，是你的武器。你敢打敢拼、不怯场的心态，是很多老将都羡慕的品质。"超级进化水箭龟"不只是梗，是你一次次突破自我的真实写照。杰尼，伦敦是你的新舞台，让世界记住你的 ID。"
    },
    {
      name: "nobody · 王森旭",
      tagline: "EDG 的大脑，CN 瓦最强 IGL",
      message: "王哥，如果说康康是 EDG 的尖刀，那你就是 EDG 的灵魂。指挥位是最容易被忽视的位置——镜头永远对准杀人的决斗者，很少有人能看到你在背后做了多少功课。每一张图的站位研究，每一个战术的反复推演，每一个残局的冷静调度——这些看不见的努力，才是 EDG 能走到今天的基石。从"电工钳"的玩笑到冠军指挥的蜕变，你经历了太多的压力和质疑，但你从没停下前进的脚步。王哥，伦敦的舞台上继续用你的指挥才华带领兄弟们冲锋。CN 瓦需要你这样的 IGL。"
    }
  ],
  teamMessage: "五个人，五种风格，一颗冠军的心。EDG 从来不是靠某一个人的个人能力赢比赛——你们赢在信任，赢在默契，赢在那个无论落后多少分都坚信能翻盘的信念。CN 瓦等了这么多年，等到的不只是一个冠军，等到的是属于我们自己的王朝。伦敦大师赛，我们不看衰，不毒奶，就安安静静守在屏幕前，看你们打每一场。",
  closing: "EDG，去伦敦把冠军再带回来一次。淀粉，永远在。"
}
```

## 第三步：右侧应援卡片完整 JSX

```tsx
{/* ---- 右侧：应援寄语面板 ---- */}
<div className="hidden lg:block lg:col-span-5">
  <div className="relative max-h-[520px] overflow-y-auto pr-1
    [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full">

    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-5 md:p-6">

      {/* 标题 */}
      <h3 className="text-lg font-bold text-primary mb-1 tracking-wide">
        {CHEER_MESSAGE.title}
      </h3>
      <p className="text-caption text-text-tertiary mb-5 leading-relaxed italic">
        {CHEER_MESSAGE.intro}
      </p>

      {/* 分隔线 */}
      <div className="mb-5 h-px bg-gradient-to-r from-primary/40 via-white/[0.08] to-transparent" />

      {/* 每位选手寄语 */}
      <div className="space-y-5">
        {CHEER_MESSAGE.players.map((player, i) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-4 border-l-2 border-primary/25 hover:border-primary/50 transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-body-sm font-bold text-text-primary">
                {player.name}
              </span>
              <span className="text-[11px] text-primary/60 bg-primary/[0.06] px-1.5 py-0.5 rounded font-medium">
                {player.tagline}
              </span>
            </div>
            <p className="text-caption text-text-tertiary leading-relaxed">
              {player.message}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 分隔线 */}
      <div className="my-5 h-px bg-gradient-to-r from-primary/40 via-white/[0.08] to-transparent" />

      {/* 团队感言 */}
      <p className="text-caption text-text-secondary leading-relaxed">
        {CHEER_MESSAGE.teamMessage}
      </p>

      {/* 结尾祝词 */}
      <p className="mt-5 text-body-sm font-bold text-primary text-center tracking-wide">
        {CHEER_MESSAGE.closing}
      </p>

    </div>
  </div>
</div>
```

## 第四步：关键提醒

1. **浮动标签不动** — Hero 中已有的 `DataBadge` 悬浮标签（球球、康康等）都保留在左侧区域
2. **背景光晕和 SVG 连线** — 保留在左侧 `motion.div` 内
3. **移动端** — `hidden lg:block` 确保手机不显示右侧面板，布局不变
4. **滚动条** — 用了 Tailwind 原生 `[&::-webkit-scrollbar]` 自定义样式，深色细滚动条，和主题一致
5. **动画** — 每位选手寄语用 `framer-motion` 依次从右侧滑入（项目已有依赖）

---

## 预期最终效果

```
桌面端 (lg+, ≥1024px)
┌─────────────────────────────────────────────────┐
│  Header (sticky glass)                          │
├──────────────────────┬──────────────────────────┤
│                      │                          │
│  Hero 主内容 (7列)    │  应援寄语卡片 (5列)        │
│  · 品牌徽章           │  ┌──────────────────┐    │
│  · EDG · VCT London  │  │ 致EDG每一位战士    │    │
│  · 副标题             │  │                  │    │
│  · 信息条             │  │ 康康寄语          │    │
│  · CTA 按钮           │  │ Smoggy寄语        │    │
│  · 导航标签           │  │ 球球寄语          │    │
│  · 合作伙伴 Logo行    │  │ 杰尼寄语          │    │
│  · 浮动选手标签       │  │ 王哥寄语          │    │
│                      │  │                  │    │
│                      │  │ 团队感言           │    │
│                      │  │ EDG加油！          │    │
│                      │  └──────────────────┘    │
│                      │        ↕ 可滚动          │
└──────────────────────┴──────────────────────────┘
```

移动端不变，保持现有居中布局。
