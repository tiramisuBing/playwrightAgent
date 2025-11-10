import { test, expect } from './fixtures';

test.describe('用户登录', () => {
  test('登录失败处理', async ({ page }) => {
    // 1. 导航到登录页面
    await page.goto('https://tsso.com/login');
    
    // 2. 在用户名字段输入无效账号
    const usernameInput = page.getByRole('textbox', { name: '手机号/邮箱/用户名' });
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('invalid_user');

    // 3. 在密码字段输入无效密码
    const passwordInput = page.getByRole('textbox', { name: '登录密码' });
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('wrong_password');

    // 4. 点击登录按钮
    const loginButton = page.getByRole('button', { name: '登录', exact: true });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();

    // 5. 验证错误提示信息显示
    const errorMessage = page.getByText('Invalid credentials.');
    await expect(errorMessage).toBeVisible();

    // 6. 验证用户仍在登录页面
    await expect(page).toHaveURL(/.*login.*/);

    // 7. 验证密码字段已被清空
    await expect(passwordInput).toHaveValue('');
  });
});