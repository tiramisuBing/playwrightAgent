import { test as base, expect } from '@playwright/test';

/**
 * 自定义 Fixtures
 * 扩展 Playwright Test 的功能，提供可复用的测试上下文
 */

// 定义自定义 fixture 类型
type CustomFixtures = {
  // 已登录的页面上下文
  authenticatedPage: any;
  // 测试数据生成器
  testData: TestDataGenerator;
  // API 客户端
  apiClient: ApiClient;
};

// 测试数据生成器
class TestDataGenerator {
  /**
   * 生成登录凭证
   */
  generateLoginCredentials() {
    return {
      username: 'xxxxx',
      password: 'xxxxx',
    };
  }

  /**
   * 生成随机用户数据
   */
  generateUser() {
    const timestamp = Date.now();
    return {
      username: `user_${timestamp}`,
      email: `user_${timestamp}@example.com`,
      password: 'Test123456!',
      firstName: 'Test',
      lastName: 'User',
    };
  }

  /**
   * 生成唯一 ID
   */
  generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// API 客户端
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 发送 GET 请求
   */
  async get(endpoint: string, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...((options as any).headers || {}),
      },
    });
    return response.json();
  }

  /**
   * 发送 POST 请求
   */
  async post(endpoint: string, data: any, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...((options as any).headers || {}),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * 创建测试用户
   */
  async createTestUser(userData: any) {
    return this.post('/api/users', userData);
  }

  /**
   * 清理测试数据
   */
  async cleanupTestData(userId: string) {
    const response = await fetch(`${this.baseUrl}/api/users/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}

// 扩展 test 对象
export const test = base.extend<CustomFixtures>({
  /**
   * 已认证的页面 fixture
   * 自动登录并返回已认证的页面对象
   */
  authenticatedPage: async ({ page }, use) => {
    // 导航到登录页面
    await page.goto('https://tsso.com/login');
    
    // 执行登录逻辑
    const usernameInput = page.getByRole('textbox', { name: /用户名|账号|手机号|username|account/i }).first();
    const passwordInput = page.getByRole('textbox', { name: /密码|password/i });
    const loginButton = page.getByRole('button', { name: /登录|login/i });
    
    if (await usernameInput.isVisible()) {
      await usernameInput.fill('xxxxx');
    }
    
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('xxxxx');
    }
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
      // 等待登录成功
      await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
    }
    
    // 提供已认证的页面给测试
    await use(page);
  },

  /**
   * 测试数据生成器 fixture
   */
  testData: async ({}, use) => {
    const generator = new TestDataGenerator();
    await use(generator);
  },

  /**
   * API 客户端 fixture
   */
  apiClient: async ({}, use) => {
    const baseUrl = process.env.BASE_URL || 'https://test.com';
    const client = new ApiClient(baseUrl);
    await use(client);
  },
});

// 导出 expect 以便统一使用
export { expect };

// 导出自定义断言（可选）
export const customExpect = {
  /**
   * 验证元素可见且可交互
   */
  async toBeInteractive(locator: any) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
  },

  /**
   * 验证列表包含指定数量的项
   */
  async toHaveCount(locator: any, count: number) {
    await expect(locator).toHaveCount(count);
  },
};
