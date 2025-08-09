import { test, expect } from "@playwright/test";

const WEBSITE_URL = "https://www.amazon.com";
const SEARCH_VALUE = "Chair";

// test.slow();

// test.beforeEach(async ({ page }) => {
//   await page.goto(WEBSITE_URL);
// });

test.describe("Home Page", () => {
  test("should have correct page title", async ({ page }) => {
    test.slow();
    await page.goto(WEBSITE_URL);

    await expect(page).toHaveTitle(/Amazon.com/i);
  });

  test("should have a cart", async ({ page }) => {
    test.slow();
    await page.goto(WEBSITE_URL);

    await page.locator('[id="nav-button-cart"]').waitFor({ state: "visible" });

    await expect(page.locator('[id="nav-button-cart"]')).toBeVisible();
  });

  test("should have a search field and allow me to fill the search field", async ({
    page,
  }) => {
    test.slow();
    await page.goto(WEBSITE_URL);

    await page
      .locator(".nav-search-field .nav-input")
      .waitFor({ state: "visible" });

    const searchField = page.locator(".nav-search-field .nav-input");

    await expect(searchField).toBeVisible();

    await searchField.fill(SEARCH_VALUE);

    await expect(searchField).toHaveValue(SEARCH_VALUE);
  });

  test("should search product and display results", async ({ page }) => {
    test.slow();
    await page.goto(WEBSITE_URL);

    const searchField = page.locator(".nav-search-field .nav-input");

    await searchField.fill(SEARCH_VALUE);

    await searchField.press("Enter");

    const productList = page.locator('[data-component-type="s-search-result"]');

    await expect(productList.first()).toBeVisible();
  });
});

test.describe("Cart Page", () => {
  test("should add a product to cart and update cart count", async ({
    page,
  }) => {
    test.slow();
    await page.goto(WEBSITE_URL);

    // Search for a product
    const searchField = page.locator(".nav-search-field .nav-input");

    await searchField.fill(SEARCH_VALUE);

    await searchField.press("Enter");

    // Add product to cart
    const productsWithAddToCart = page
      .locator('[data-component-type="s-search-result"]')
      .filter({
        has: page.locator('input[name="submit.addToCart"]'),
      });

    const firstProduct = productsWithAddToCart.first();

    await firstProduct.locator('[name="submit.addToCart"]').click();

    await page.waitForTimeout(3000);

    const cartCount = page.locator('[id="nav-cart-count"]');

    await expect(cartCount).not.toHaveText("0");
  });

  test("should view cart and see added products", async ({ page }) => {
    test.slow();
    await page.goto(WEBSITE_URL);

    await page.locator("#nav-button-cart").waitFor({ state: "visible" });

    await page.locator("#nav-button-cart").click();

    const cartItems = page.locator(".sc-list-item");

    await expect(cartItems.first()).toBeVisible();
  });

  // test("should display product prices and cart subtotal", async ({ page }) => {
  //   await page.locator("#nav-button-cart").click();

  //   const price = page.locator(".sc-product-price");
  //   const subtotal = page.locator("#sc-subtotal-amount-activecart");

  //   await expect(price.first()).toBeVisible();
  //   await expect(subtotal).toBeVisible();
  // });

  // test("should remove item from cart and update cart count", async ({
  //   page,
  // }) => {
  //   await page.goto("https://www.amazon.com/gp/cart/view.html");
  //   const deleteBtn = page.locator('[value="Delete"]');
  //   const initialCount = await page.locator("#nav-cart-count").textContent();

  //   if ((await deleteBtn.count()) > 0) {
  //     await deleteBtn.first().click();
  //     await page.waitForTimeout(2000); // give time for DOM update
  //     const newCount = await page.locator("#nav-cart-count").textContent();
  //     expect(Number(newCount)).toBeLessThan(Number(initialCount));
  //   }
  // });

  // test("should proceed to checkout", async ({ page }) => {
  //   await page.goto("https://www.amazon.com/gp/cart/view.html");
  //   const checkoutButton = page.locator(
  //     'input[name="proceedToRetailCheckout"]'
  //   );
  //   if (await checkoutButton.isVisible()) {
  //     await checkoutButton.click();
  //     await expect(page).toHaveURL(/.*\/gp\/buy\/.*|.*\/signin.*/);
  //   } else {
  //     // test.skip('No items in cart to proceed to checkout');
  //     test.skip();
  //   }
  // });
});
