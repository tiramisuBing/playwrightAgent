import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Agent Framework 配置文件
 * 参考文档：https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试文件目录
  testDir: './tests',
  
  // 全局测试超时时间（30秒）
  timeout: 30 * 1000,
  
  // 全局断言超时时间（5秒）
  expect: {
    timeout: 5000
  },
  
  // 并行执行配置
  fullyParallel: true,
  
  // 禁止提交测试代码到版本库
  forbidOnly: !!process.env.CI,
  
  // CI 环境重试配置
  retries: process.env.CI ? 2 : 0,
  
  // 并行工作进程数
  workers: process.env.CI ? 1 : undefined,
  
  // 测试报告配置
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  // 全局使用配置
  use: {
    // 基础 URL，简化导航代码
    baseURL: 'https://test.com',
    
    // 失败时记录追踪信息，便于 Healer 分析
    trace: 'on-first-retry',
    
    // 失败时截图
    screenshot: 'only-on-failure',
    
    // 失败时录制视频
    video: 'retain-on-failure',
    
    // 浏览器上下文选项
    viewport: { width: 1280, height: 720 },
    
    // 忽略 HTTPS 错误（开发环境）
    ignoreHTTPSErrors: true,
  },

  // 项目配置 - 多浏览器测试
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // 移动端浏览器
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web Server 配置（可选）
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
