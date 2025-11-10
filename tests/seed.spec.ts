import { test, expect } from './fixtures';

/**
 * 种子测试
 * 
 * 作用：
 * 1. 提供测试环境初始化
 * 2. 执行全局设置和项目依赖初始化
 * 3. 设置自定义 fixtures 和 hooks
 * 4. 作为生成测试的代码风格模板
 * 
 * Planner 代理将运行此测试来：
 * - 执行必要的初始化
 * - 使用此测试作为所有生成测试的示例
 */

test.describe('Seed Test - 登录功能', () => {
  test('seed - 环境初始化', async ({ page }) => {
    // 导航到登录页面
    await page.goto('https://tsso.com/login');
    
    // 验证页面加载成功
    await page.waitForLoadState('networkidle');
    
    // 验证登录表单存在
    const loginForm = page.locator('form, [class*="login"], [id*="login"]');
    await expect(loginForm).toBeVisible();
    
    console.log('✓ 种子测试：登录页面初始化成功');
  });

  test('seed - 登录功能测试', async ({ page }) => {
    // 导航到登录页面
    await page.goto('https://tsso.com/login');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 填写用户名
    const usernameInput = page.getByRole('textbox', { name: /用户名|账号|手机号|username|account/i }).first();
    if (await usernameInput.isVisible()) {
      await usernameInput.fill('xxxxx');
    }
    
    // 填写密码
    const passwordInput = page.getByRole('textbox', { name: /密码|password/i });
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('xxxxx');
    }
    
    // 点击登录按钮
    const loginButton = page.getByRole('button', { name: /登录|login/i });
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      // 等待重定向
      await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
      
      console.log('✓ 种子测试：登录操作完成，当前URL:', (page as any).url());
    }
    
    console.log('✓ 种子测试：登录功能测试完成');
  });
});

/**
 * 使用说明：
 * 
 * 1. 基础使用
 *    - 直接运行：npx playwright test seed.spec.ts
 *    - 此测试应该能够独立运行
 * 
 * 2. 作为 Planner 的输入
 *    - 在 AI 工具中提示："使用 tests/seed.spec.ts 生成登录功能的测试计划"
 *    - Planner 会运行此测试以初始化环境
 * 
 * 3. 自定义配置
 *    - 登录URL: https://tsso.com/login?service=...
 *    - 用户名：xxxxx
 *    - 密码：xxxxx
 * 
 * 4. 最佳实践
 *    - 保持种子测试简单和稳定
 *    - 使用可靠的选择器
 *    - 包含必要的等待策略
 *    - 验证环境就绪状态
 */
