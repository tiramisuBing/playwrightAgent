import { test, expect } from './fixtures';

test.describe('用户登录', () => {
  test('使用有效凭证登录', async ({ page }) => {
    // 1. 导航到登录页面
    await page.goto('https://tsso.com/login');
    
    // 验证登录表单已加载
    const loginForm = page.locator('form, [class*="login"], [id*="login"]');
    await expect(loginForm).toBeVisible();

    // 2. 在用户名字段输入账号
    const usernameInput = page.getByRole('textbox', { name: '手机号/邮箱/用户名' });
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('xxxxx');

    // 3. 在密码字段输入密码
    const passwordInput = page.getByRole('textbox', { name: '登录密码' });
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('xxxxx');

    // 4. 点击登录按钮
    const loginButton = page.getByRole('button', { name: '登录', exact: true });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();

    // 5. 验证登录成功并重定向到应用首页
    await expect(page).toHaveURL(/https:\/\/test\.com/);
  });
});