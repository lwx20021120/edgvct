import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const PROJECT_REF = 'pninmmjwvxeksyuoqrze';
const DASHBOARD_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}`;
const SETTINGS_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api`;
const SQL_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

const profileDir = join(homedir(), '.playwright-supabase');

console.log('启动浏览器...');
const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  viewport: { width: 1280, height: 900 },
});

const page = await context.newPage();

// ====== Step 1: 登录检查 ======
console.log('[Step 1] 打开项目 Dashboard...');
await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(3000);

let url = page.url();
console.log('URL:', url);

if (url.includes('sign-in') || url.includes('login')) {
  console.log('🔐 请登录...');
  await page.waitForURL('**/dashboard/**', { timeout: 300000 });
  await page.waitForTimeout(3000);
  console.log('✅ 已登录');
  url = page.url();
  console.log('当前 URL:', url);
}

// 如果不在项目页面，尝试重新导航
if (!url.includes(PROJECT_REF)) {
  console.log('不在项目页，重新导航...');
  await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(5000);
  url = page.url();
  console.log('URL:', url);
}

// 截图当前状态
await page.screenshot({ path: 'scripts/s01-dashboard.png', fullPage: true });

// 检查是否在项目页面
const bodyText = await page.locator('body').innerText();
console.log('页面标题/前200字:', bodyText.slice(0, 200));

// 如果仍然不在项目页面，检查是否项目暂停
if (!url.includes(PROJECT_REF)) {
  // 尝试在组织页面点击项目
  const projectLink = page.locator(`a[href*="${PROJECT_REF}"], [data-testid*="${PROJECT_REF}"]`);
  if (await projectLink.count() > 0) {
    await projectLink.first().click();
    await page.waitForTimeout(5000);
  } else {
    // 尝试搜索项目
    console.log('在页面中查找项目入口...');
    // 点击可能的项目卡片
    const cards = page.locator('a[href*="project"]');
    const cardCount = await cards.count();
    console.log(`找到 ${cardCount} 个项目链接`);
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const href = await cards.nth(i).getAttribute('href');
      console.log(`  [${i}] ${href}`);
    }
    if (cardCount > 0) {
      await cards.first().click();
      await page.waitForTimeout(5000);
    }
  }
  url = page.url();
  console.log('导航后 URL:', url);
}

// ====== Step 2: 进入 API 设置 ======
console.log('\n[Step 2] 进入 API 设置页面...');
await page.goto(SETTINGS_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(5000);
url = page.url();
console.log('URL:', url);

await page.screenshot({ path: 'scripts/s02-settings.png', fullPage: true });

// 多次尝试提取 Anon Key
let anonKey = null;
const fullText = await page.locator('body').innerText();

// 找到所有的 JWT tokens
const jwts = [...fullText.matchAll(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g)].map(m => m[0]);
console.log(`找到 ${jwts.length} 个 JWT token`);

// 过滤出 anon key（通常是较长的，且不包含 service_role 相关内容）
for (const jwt of jwts) {
  if (jwt.length > 100) {
    // 检查上下文，确保不是 service_role key
    const idx = fullText.indexOf(jwt);
    const context = fullText.slice(Math.max(0, idx - 50), idx + 50).toLowerCase();
    if (!context.includes('service') && !context.includes('secret')) {
      anonKey = jwt;
      console.log('✅ 找到 Anon Key:', anonKey.slice(0, 60) + '...');
      break;
    }
  }
}

// 如果还没找到，尝试从页面元素中读取
if (!anonKey) {
  // 查找可能包含 key 的元素
  const possibleElements = [
    'input[readonly]',
    '[data-testid*="key"]',
    '[data-testid*="anon"]',
    'code',
    'pre',
    '.text-sm.font-mono',
  ];

  for (const selector of possibleElements) {
    const els = await page.locator(selector).all();
    for (const el of els) {
      try {
        const text = await el.innerText();
        const match = text.match(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/);
        if (match && match[0].length > 100) {
          anonKey = match[0];
          console.log(`✅ 从 "${selector}" 找到 Anon Key:`, anonKey.slice(0, 60) + '...');
          break;
        }
      } catch {}
    }
    if (anonKey) break;
  }
}

if (!anonKey) {
  console.log('\n❌ 自动提取失败。');
  console.log('页面关键文本片段:');
  // 显示包含 "key" 或 "anon" 的行
  const lines = fullText.split('\n');
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('key') || lower.includes('anon') || lower.includes('token') || lower.includes('jwt')) {
      console.log('  >', line.slice(0, 150));
    }
  }
} else {
  // 保存 key
  writeFileSync('scripts/anon-key.txt', anonKey);

  // 更新 .env
  let env = readFileSync('.env', 'utf-8');
  env = env.replace(/VITE_SUPABASE_ANON_KEY=.*/, `VITE_SUPABASE_ANON_KEY=${anonKey}`);
  writeFileSync('.env', env);
  console.log('✅ .env 已更新');

  // 更新 api.ts
  let api = readFileSync('src/config/api.ts', 'utf-8');
  api = api.replace(/\|\| 'sb_publishable_[^']*'/, `|| '${anonKey}'`);
  writeFileSync('src/config/api.ts', api);
  console.log('✅ api.ts 已更新');

  // 更新 vite.config.ts
  let vite = readFileSync('vite.config.ts', 'utf-8');
  vite = vite.replace(/\|\| 'sb_publishable_[^']*'/, `|| '${anonKey}'`);
  writeFileSync('vite.config.ts', vite);
  console.log('✅ vite.config.ts 已更新');
}

// ====== Step 3: SQL Editor ======
console.log('\n[Step 3] 打开 SQL Editor...');
await page.goto(SQL_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(5000);
url = page.url();
console.log('URL:', url);

await page.screenshot({ path: 'scripts/s03-sql-editor.png', fullPage: true });

const createTableSQL = `-- 应援墙留言表
CREATE TABLE IF NOT EXISTS wall_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_wall_created ON wall_messages (created_at DESC);

-- RLS 策略
ALTER TABLE wall_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_wall" ON wall_messages;
CREATE POLICY "anon_read_wall" ON wall_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "anon_insert_wall" ON wall_messages;
CREATE POLICY "anon_insert_wall" ON wall_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_wall" ON wall_messages;
CREATE POLICY "anon_update_wall" ON wall_messages FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_wall" ON wall_messages;
CREATE POLICY "anon_delete_wall" ON wall_messages FOR DELETE USING (true);`;

// 尝试多种方式找到 SQL 编辑器并输入
let sqlEntered = false;

// 方式1: Monaco Editor (通过键盘输入)
const monacoLines = page.locator('.monaco-editor .view-lines');
if (await monacoLines.count() > 0) {
  console.log('检测到 Monaco Editor');
  await monacoLines.first().click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+a');
  await page.waitForTimeout(100);
  await page.keyboard.insertText(createTableSQL);
  sqlEntered = true;
  console.log('✅ SQL 已写入 Monaco Editor');
}

// 方式2: 普通 textarea
if (!sqlEntered) {
  const textareas = await page.locator('textarea').all();
  if (textareas.length > 0) {
    await textareas[0].fill(createTableSQL);
    sqlEntered = true;
    console.log('✅ SQL 已写入 textarea');
  }
}

// 方式3: CodeMirror 或其他编辑器
if (!sqlEntered) {
  const editorArea = page.locator('[role="textbox"], [contenteditable="true"], .CodeMirror');
  if (await editorArea.count() > 0) {
    await editorArea.first().click();
    await page.waitForTimeout(300);
    await page.keyboard.press('Control+a');
    await page.waitForTimeout(100);
    await page.keyboard.insertText(createTableSQL);
    sqlEntered = true;
    console.log('✅ SQL 已写入编辑器');
  }
}

if (!sqlEntered) {
  console.log('⚠️  未能自动写入 SQL，请在浏览器中手动粘贴');
  console.log('SQL 内容已复制到剪贴板区域...');
}

await page.screenshot({ path: 'scripts/s04-sql-filled.png', fullPage: true });

// 点击 Run
const runSelectors = [
  'button:has-text("Run")',
  'button:has-text("RUN")',
  'button:has-text("执行")',
  '[data-testid="run-query"]',
  'button[aria-label*="run" i]',
  'button:has-text("▶")',
];

let runClicked = false;
for (const sel of runSelectors) {
  const btn = page.locator(sel);
  if (await btn.count() > 0) {
    await btn.first().click();
    runClicked = true;
    console.log(`✅ 点击了 Run (${sel})`);
    break;
  }
}

if (runClicked) {
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'scripts/s05-sql-result.png', fullPage: true });

  const resultText = await page.locator('body').innerText();
  if (resultText.includes('success') || resultText.includes('Success') || resultText.includes('Results')) {
    console.log('✅ SQL 执行成功');
  } else if (resultText.includes('error') || resultText.includes('Error')) {
    console.log('⚠️  SQL 可能有错误，请检查截图');
  }
} else {
  console.log('⚠️  未找到 Run 按钮，请手动点击执行');
}

console.log('\n========== 完成 ==========');
if (anonKey) {
  console.log('✅ Anon Key 已配置到 .env / api.ts / vite.config.ts');
} else {
  console.log('⚠️  Anon Key 未获取到，请查看截图 scripts/s02-settings.png');
}
console.log('浏览器保持打开 60 秒，可手动操作...');
await page.waitForTimeout(60000);
await context.close();
