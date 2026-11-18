import {test, expect} from '@playwright/test'

test('เข้าสู่หน้า login',async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    await expect(page).toHaveTitle(/Swag Labs/);
});

test('ทดสอบกรอก username',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');

    const username = page.locator('[data-test="username"]');
    await username.fill('testuser')

    await expect(username).toHaveValue('testuser');
})

test('ทดสอบกรอก password',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');

    const username = page.locator('[data-test="password"]');
    await username.fill('password')

    await expect(username).toHaveValue('password');
})

test('login ด้วย username และ password ที่ถูกต้อง',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveScreenshot({
        fullPage: true,
    });
})

test('กด login โดยที่ไม่กรอก username และ password',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible
})

test('login โดยที่ไม่กรอก username',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible;
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible
})

test('login โดยกรอก username ที่ไม่ได้สมัคร',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('NonexistentUsername');
        await page.locator('[data-test="password"]').fill('NonexistentPassword');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible;
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible
})

test('login โดยที่ไม่กรอก password',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible;
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible
})

test('login โดยกรอก password ผิด',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrongPassword');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible;
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible
})

test('log out ออกจากระบบ',async ({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
})