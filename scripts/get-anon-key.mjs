import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const PROJECT_REF = 'pninmmjwvxeksyuoqrze';
const SETTINGS_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api`;
const SQL_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;

// 用 Chrome 用户数据目录启动持久化上下文（复用已有登录状态）
const userDataDir = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data');

console.log('启动浏览器（使用 Chrome 用户数据）...');

let context;
try {
  // 尝试用默认 Chrome Profile
  context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    channel: 'chrome',  // 使用系统安装的 Chrome
    args: ['--profile-directory=Default'],
  });
} catch (e) {
  console.log('无法使用系统 Chrome（可能正在运行），回退到 Playwright Chromium...');
  context = await chromium.launchPersistentContext(
    join(homedir(), '.playwright-supabase-profile'),
    { headless: false }
  );
}

const page = await context.newPage();

// 导航到 API 设置页
console.log('导航到 Supabase API 设置...');
await page.goto(SETTINGS_URL, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

// 检查是否需要登录
let currentUrl = page.url();
console.log('当前 URL:', currentUrl);

if (currentUrl.includes('login') || currentUrl.includes('sign-in')) {
  console.log('\n⚠️  需要登录！请在浏览器窗口中手动登录 Supabase。');
  console.log('登录完成后按 Enter 继续...');
  // 等待手动登录
  await page.waitForURL('**/dashboard/project/**', { timeout: 300000 });
  console.log('✅ 登录成功！');
  await page.goto(SETTINGS_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
}

// 等待页面加载完成
await page.waitForTimeout(2000);

// 截图
await page.screenshot({ path: 'scripts/supabase-settings.png', fullPage: true });
console.log('📸 截图保存: scripts/supabase-settings.png');

// 从页面提取 Anon Key
const pageContent = await page.content();
const bodyText = await page.locator('body').innerText();

// 查找 JWT 格式的 key (eyJ...)
const jwtRegex = /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
const matches = bodyText.match(jwtRegex);

let anonKey = null;
if (matches && matches.length > 0) {
  // 取第一个（通常是 anon key）
  anonKey = matches[0];
  console.log('✅ 找到 Anon Key (JWT):', anonKey.slice(0, 50) + '...');
} else {
  // 可能在 input 里
  const inputs = await page.locator('input[readonly], input[type="text"], textarea').all();
  for (const input of inputs) {
    const val = await input.inputValue();
    if (val.startsWith('eyJ')) {
      anonKey = val;
      console.log('✅ 从 input 找到 Anon Key:', anonKey.slice(0, 50) + '...');
      break;
    }
  }
}

if (anonKey) {
  writeFileSync('scripts/anon-key.txt', anonKey);
  console.log('✅ Anon Key 已保存到 scripts/anon-key.txt');

  // 更新 .env 文件
  let envContent = readFileSync('.env', 'utf-8');
  envContent = envContent.replace(
    /VITE_SUPABASE_ANON_KEY=.*/,
    `VITE_SUPABASE_ANON_KEY=${anonKey}`
  );
  writeFileSync('.env', envContent);
  console.log('✅ .env 文件已更新');

  // 同时更新 api.ts
  let apiContent = readFileSync('src/config/api.ts', 'utf-8');
  apiContent = apiContent.replace(
    /\|\| 'sb_publishable_[^']*'/,
    `|| '${anonKey}'`
  );
  writeFileSync('src/config/api.ts', apiContent);
  console.log('✅ src/config/api.ts fallback key 已更新');

  // 更新 vite.config.ts
  let viteContent = readFileSync('vite.config.ts', 'utf-8');
  viteContent = viteContent.replace(
    /\|\| 'sb_publishable_[^']*'/,
    `|| '${anonKey}'`
  );
  writeFileSync('vite.config.ts', viteContent);
  console.log('✅ vite.config.ts fallback key 已更新');
} else {
  console.log('❌ 未能找到 Anon Key');
  console.log('页面文本前 1000 字符:\n', bodyText.slice(0, 1000));
}

await context.close();
