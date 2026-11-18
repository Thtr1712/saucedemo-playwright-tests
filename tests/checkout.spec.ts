import { test, expect } from '@playwright/test';

test.use({
  storageState: '.auth/user.json'
});

test.beforeEach(async({page})=>{
  await page.goto('https://www.saucedemo.com/inventory.html');
})

test('เข้าสู่หน้า product', async ({ page }) => {
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('ทดสอบเรียงลำดับสินค้า จากชื่อ (A to Z)', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption('az');
  //เก็บข้อมูล
  const product = await page.locator('.inventory_item_name').allTextContents();

  expect(product).toEqual([...product].sort());
});

test('ทดสอบเรียงลำดับสินค้า จากชื่อ (Z to A)', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption('za');
  //เก็บข้อมูล
  const product = await page.locator('.inventory_item_name').allTextContents();

  expect(product).toEqual([...product].sort().reverse());
});


test('ทดสอบเรียงลำดับสินค้า จากราคา (low to high)', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  //เก็บข้อมูล
  const price = await page.locator('.inventory_item_price').allTextContents();
  const number = price.map(price => Number(price.replace('$','')))
  expect(number).toEqual([...number].sort((a,b)=>a-b));
});

test('ทดสอบเรียงลำดับสินค้า จากราคา (high to low)', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
  //เก็บข้อมูล
  const price = await page.locator('.inventory_item_price').allTextContents();
  const number = price.map(price => Number(price.replace('$','')))
  expect(number).toEqual([...number].sort((a,b)=>b-a));
});

test('ทดสอบกดดูรายละเอียดสินค้า',async({page}) => {
  await page.locator('[data-test="item-4-title-link"]').click();


  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toHaveClass(/large_size/);
  //เช็คคำอธิบาย
  //เช็คราคา
  
})

test('ทดสอบกดปุ่ม add to cart ',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  //ปุ่มเปลี่ยน
  await expect(page.locator('[remove-sauce-labs-backpack"]')).toBeVisible
  //ตัวเลขขึ้น
  await expect(page.locator('[shopping_cart_badge]')).toBeVisible
  
})

test('ทดสอบกดปุ่ม remove',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  //ปุ่มเปลี่ยน
  await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible
  //ตัวเลขขึ้น
  await expect(page.locator('[shopping_cart_badge]')).toBeHidden()
  
})

test('ทดสอบกด Icon Shopping cart โดยที่มีสินค้าใน cart',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart')

  await expect(page.locator('.cart_item')).toHaveCount(3);

  await expect(page.locator('.cart_item .inventory_item_name')).toHaveText([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Fleece Jacket'
  ])
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')
   
})

/*test('ทดสอบกด Icon Shopping cart โดยที่ไม่มีสินค้าใน cart',async({page}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart')

  await expect(page.locator('[data-test=shopping-cart-badge]')).toBeHidden()
  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.locator('[data-test=checkout]')).toBeDisabled()
    
}) */


test('ทดสอบกดปุ่ม continue shopping',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="continue-shopping"]').click();


  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')
})

test('ทดสอบกดดูรายละเอียดสินค้าใน Your cart',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="item-4-title-link"]').click();

  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toHaveClass(/large_size/);
})

test('ทดสอบกด remove ในหน้ารายละเอียดสินค้า',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="item-4-title-link"]').click();
  await page.locator('[data-test="remove"]').click();

  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('2')
  await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible
  
})

test('ทดสอบกด add to cart ในหน้ารายละเอียดสินค้า',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="item-4-title-link"]').click();
  await page.locator('[data-test="remove"]').click();
  await page.locator('[data-test="add-to-cart"]').click();

  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')
  await expect(page.locator('[remove-sauce-labs-backpack"]')).toBeVisible
  
})

test('ทดสอบกดปุ่ม back to product ในหน้ารายละเอียดสินค้า',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="item-4-title-link"]').click();
  await page.locator('[data-test="back-to-products"]').click();

  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')
})

test('ทดสอบกดปุ่ม remove สินค้าในหน้า your cart',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();


  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('2')
  await expect(page.locator('[data-test="item-0-title-link"]')).toBeHidden

})

test('กด check out',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();


  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(page.locator('[data-test=title]')).toHaveText('Checkout: Your Information')
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')

  await expect(page.locator('[data-test=firstName]')).toBeVisible
  await expect(page.locator('[data-test=firstName]')).toBeEditable
  await expect(page.locator('[data-test=firstName]')).toHaveAttribute('placeholder','First Name')

  await expect(page.locator('[data-test=lastName]')).toBeVisible
  await expect(page.locator('[data-test=lastName]')).toBeEditable
  await expect(page.locator('[data-test=lastName]')).toHaveAttribute('placeholder','Last Name')

  await expect(page.locator('[data-test=postalCode]')).toBeVisible
  await expect(page.locator('[data-test=postalCode]')).toBeEditable
  await expect(page.locator('[data-test=postalCode]')).toHaveAttribute('placeholder','Zip/Postal Code')

  await expect(page.locator('[data-test=continue]')).toBeVisible
  await expect(page.locator('[data-test=continue]')).toBeEnabled

  await expect(page.locator('[data-test=cancel]')).toBeVisible
  await expect(page.locator('[data-test=cancel]')).toBeEnabled

})

test('ทดสอบกดปุ่ม Cancel ในหน้า Checkout: Your Information',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="cancel"]').click();


  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('[data-test=title]')).toHaveText('Your Cart')
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')
})

test('ทดสอบกดปุ่ม Continue หลังจากกรอกข้อมูลครบถ้วน',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  


  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('[data-test=title]')).toHaveText('Checkout: Overview')
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')

  //มีรายการสินค้า
  //มี Payment Information
   await expect(page.locator('[data-test=payment-info-label]')).toBeVisible
   await expect(page.locator('[data-test=payment-info-value]')).toBeVisible
  //มี Shipping Information
   await expect(page.locator('[data-test=shipping-info-label]')).toBeVisible
   await expect(page.locator('[data-test=shipping-info-value]')).toBeVisible
  //มี Price Total
  await expect(page.locator('[data-test=total-info-label]')).toBeVisible
  await expect(page.locator('[data-test=subtotal-label]')).toBeVisible
  //คำนวน Tax
  await expect(page.locator('[data-test=tax-label]')).toBeVisible
  await expect(page.locator('[data-test=total-label]')).toBeVisible

  const prices = await page.locator('.inventory_item_price').allTextContents();

  const number = prices.map(price => Number(price.replace('$','')))

  const total = number.reduce((sum,price) => sum + price,0)

  const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent();
  

  const subtotal = Number(subtotalText!.replace('Item total: $', ''));

  expect(subtotal).toBeCloseTo(total, 2);

  const tax = subtotal * 0.08

  const taxFromWebText = await page.locator('[data-test=tax-label]').textContent();

  const taxFromWeb = Number(taxFromWebText!.replace('Tax: $',''));

  expect(tax).toBeCloseTo(taxFromWeb,2)

  const totalPrice = subtotal+tax

  const totalFromWebText = await page.locator('[data-test=total-label]').textContent();

  const totalFromWeb = Number(totalFromWebText!.replace('Total: $',''));

  expect (totalPrice).toBeCloseTo(totalFromWeb,2)

  await expect(page.locator('[data-test=cancel]')).toBeVisible
  await expect(page.locator('[data-test=cancel]')).toBeEnabled

  await expect(page.locator('[data-test=finish]')).toBeVisible
  await expect(page.locator('[data-test=finish]')).toBeEnabled
}) 

test('กด continue โดยที่ไม่กรอกอะไรเลย',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible
  await expect(page.locator('[data-test="error"]')).toHaveText("Error: First Name is required")

})

test('กด continue โดยที่ไม่กรอก Last Name',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible
  await expect(page.locator('[data-test="error"]')).toHaveText("Error: Last Name is required")

})

test('กด continue โดยที่ไม่กรอก Zip/Postal code',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="continue"]').click();
  
  await expect(page.locator('[data-test="error"]')).toBeVisible
  await expect(page.locator('[data-test="error"]')).toHaveText("Error: Postal Code is required")

})

test('ทดสอบกดปุ่ม Cancel ในหน้า Checkout: Overview',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="cancel"]').click();
  
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('[data-test=title]')).toHaveText('Your Cart')
  await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('3')

})

test('ทดสอบกดปุ่ม Finish ในหน้า Checkout: Overview',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();


  await expect(page).toHaveURL(/checkout-complete/);
  await expect(page.locator('[data-test=title]')).toHaveText('Checkout: Complete!')
  await expect(page.locator('[data-test=shopping-cart-badge]')).toBeHidden()

  await expect(page).toHaveScreenshot({
        fullPage: true,
    });
})

test('ทดสอบกดปุ่ม Back home ในหน้า Checkout: Complete!',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="back-to-products"]').click();

 await expect(page).toHaveURL(/inventory/)
 await expect(page.locator('[data-test=shopping-cart-badge]')).toBeHidden()
})

test('ทดสอบกด Generate PDF order ในหน้า Checkout: Complete!',async({page}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();

  const downloadPromise = page.waitForEvent('download')
  await page.locator('[data-test="generate-pdf-order"]').click();
  const download = await downloadPromise

 await expect(page).toHaveURL(/checkout-complete/)
 await expect(page.locator('[data-test=shopping-cart-badge]')).toBeHidden()
 expect(download).toBeTruthy
 expect(await download.failure()).toBeNull();
})