/**
 * Supabase 数据库初始化 — 半自动脚本
 * 脚本负责导航，用户负责点击操作。
 * 用法: npx tsx scripts/supabase-setup.ts
 */

import { chromium } from 'playwright'
import path from 'path'
import * as readline from 'readline'

const PROJECT_ID = 'pninmmjwvxeksyuoqrze'
const DASHBOARD = `https://supabase.com/dashboard/project/${PROJECT_ID}`
const SCREENSHOTS_DIR = path.join(process.cwd(), 'scripts', 'screenshots')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function waitForEnter(msg: string): Promise<void> {
  return new Promise((resolve) => {
    rl.question(`\n⏳ ${msg} (按 Enter 继续)`, () => resolve())
  })
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

const ALL_SQL = `
-- 1. 视频表
CREATE TABLE IF NOT EXISTS fan_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  bvid text,
  video_url text,
  thumbnail_url text,
  type text DEFAULT 'upload',
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 2. 管理员表
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- 3. wall_messages 补充字段
ALTER TABLE IF EXISTS wall_messages
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;

-- 4. RLS — fan_videos
ALTER TABLE fan_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "允许所有人读取" ON fan_videos;
CREATE POLICY "允许所有人读取" ON fan_videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "允许所有人写入" ON fan_videos;
CREATE POLICY "允许所有人写入" ON fan_videos FOR INSERT WITH CHECK (true);

-- 5. RLS — admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "任何人可读admin_users" ON admin_users;
CREATE POLICY "任何人可读admin_users" ON admin_users FOR SELECT USING (true);
`.trim()

async function main() {
  console.log('🚀 启动浏览器...\n')
  const browser = await chromium.launch({ headless: false })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  try {
    // ═══════════════ Step 1: SQL ═══════════════
    console.log('='.repeat(60))
    console.log('📋 STEP 1: 执行建表 SQL')
    console.log('='.repeat(60))
    console.log('\n👉 正在打开 SQL Editor...\n')
    await page.goto(`${DASHBOARD}/sql/new`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await sleep(3000)

    // 检测登录
    let url = page.url()
    if (url.includes('login') || url.includes('sign-in')) {
      console.log('⚠️  需要登录。请在浏览器中登录 Supabase...')
      for (let i = 0; i < 40; i++) {
        await sleep(3000)
        url = page.url()
        if (!url.includes('login') && !url.includes('sign-in')) break
      }
      await page.goto(`${DASHBOARD}/sql/new`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
      await sleep(2000)
    }

    // 把 SQL 打印到控制台，用户复制粘贴
    console.log('📝 请将以下 SQL 复制粘贴到 Supabase SQL Editor，然后点击 Run：')
    console.log('─'.repeat(60))
    console.log(ALL_SQL)
    console.log('─'.repeat(60))
    console.log('\n   （你也可以从上方直接复制 SQL 文本）')

    await waitForEnter('粘贴 SQL 并点击 Run 后')

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-sql-done.png'), fullPage: false })
    console.log('   ✅ 截图: 01-sql-done.png')

    // ═══════════════ Step 2: Storage ═══════════════
    console.log('\n' + '='.repeat(60))
    console.log('📋 STEP 2: 创建 Storage Bucket')
    console.log('='.repeat(60))
    console.log('\n👉 正在打开 Storage 页面...\n')
    await page.goto(`${DASHBOARD}/storage/buckets`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await sleep(2000)

    console.log('🖱️  请手动操作：')
    console.log('   1. 点击 "New Bucket" 按钮')
    console.log('   2. 名称填写: fan_videos')
    console.log('   3. ✅ 勾选 "Public bucket"')
    console.log('   4. 点击 "Create bucket" / "Save"')

    await waitForEnter('创建完 Bucket 后')

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-bucket-done.png'), fullPage: false })
    console.log('   ✅ 截图: 02-bucket-done.png')

    // ═══════════════ Step 3: RLS ═══════════════
    console.log('\n' + '='.repeat(60))
    console.log('📋 STEP 3: 验证 RLS Policies')
    console.log('='.repeat(60))
    console.log('\n👉 正在打开 Authentication → Policies...\n')
    await page.goto(`${DASHBOARD}/auth/policies`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await sleep(2000)

    console.log('🖱️  请确认以下表已启用 RLS：')
    console.log('   • fan_videos — SELECT + INSERT policies')
    console.log('   • admin_users — SELECT policy')

    await waitForEnter('确认完成后')

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-policies-done.png'), fullPage: false })
    console.log('   ✅ 截图: 03-policies-done.png')

    // ═══════════════ 完成 ═══════════════
    console.log('\n' + '='.repeat(60))
    console.log('✅ 全部完成！')
    console.log(`   截图保存在: ${SCREENSHOTS_DIR}`)
    console.log('='.repeat(60))

  } finally {
    await sleep(2000)
    await browser.close()
    rl.close()
  }
}

main().catch((e) => {
  console.error(e)
  rl.close()
  process.exit(1)
})
