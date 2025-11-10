// spec: specs/basic-operations.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixtures';

/**
 * 用户登录测试套件
 * 
 * 根据测试计划 specs/basic-operations.md 生成
 * 使用种子测试 tests/seed.spec.ts 的配置和风格
 */
test.describe('用户登录', () => {
  
  test.beforeEach(async ({ page }) => {
    // 导航到登录页面
    await page.goto('https://tsso.com/login');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('1.1 使用有效凭证登录', async ({ page }) => {
    // 1. 切换账号密码登录
    const loginTrs = page.getByRole('button', { name: '账户密码/验证码登录' })
    if (await loginTrs.isVisible()) {
      await loginTrs.click();
    }
    // 1. 在用户名字段中输入 "xxxxx"
    const usernameInput = page.getByRole('textbox', { name: '手机号/邮箱/用户名' });
    if (await usernameInput.isVisible()) {
      await usernameInput.fill('xxxxx');
    }
    
    // 2. 在密码字段中输入 "xxxxx"
    const passwordInput = page.getByRole('textbox', { name: '登录密码' });
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('xxxxx');
    }
    
    // 3. 点击登录按钮
    const loginButton = page.getByRole('button', { name: '登录', exact: true });
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      // 等待页面导航或加载

      await page.waitForURL(url => !url.toString().includes('https://test.com/v2/exam/index'), { timeout: 30000 }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
    }
    
    // 预期结果：
    // - 登录成功（页面发生重定向或加载新内容）
    const currentUrl = page.url();
    expect(currentUrl).toContain('https://test.com/v2/exam/index');
  });

  test('1.2 登录失败处理', async ({ page }) => {
    // 输入错误的凭证
    const usernameInput = page.getByRole('textbox', { name: /用户名|账号|手机号|username|account/i }).first();
    const passwordInput = page.getByRole('textbox', { name: /密码|password/i });
    
    if (await usernameInput.isVisible()) {
      await usernameInput.fill('wronguser');
    }
    
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('wrongpassword');
    }
    
    // 点击登录按钮
    const loginButton = page.getByRole('button', { name: /登录|login/i });
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      // 等待响应
      await page.waitForTimeout(2000);
    }
    
    // 预期结果：
    // - 用户停留在登录页面（URL 仍然是登录页面）
    const currentUrl = page.url();
    expect(currentUrl).toContain('tsso.com/login');
  });
});
