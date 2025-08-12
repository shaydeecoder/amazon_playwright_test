import { test, expect, Page } from "@playwright/test";

const WEBSITE_URL = "https://www.jumia.com.ng";
const SEARCH_VALUE = "Chair";

test.describe("Home Page", () => {
  test("should have correct page title", async ({ page }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Assert that the page title is correct
    await expect(page).toHaveTitle(
      "Jumia Nigeria | Online Shopping for Electronics, Fashion, Home, Beauty & Sport"
    );
  });

  test("should have a cart", async ({ page }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Check if cart button is visible
    const navCartButton = page.getByRole("link", { name: "Cart", exact: true });

    // Wait for the cart button to be visible
    await navCartButton.waitFor({ state: "visible" });

    // Assert that the cart button is visible
    await expect(navCartButton).toBeVisible();
  });

  test("should have a search field and allow me to fill the search field", async ({
    page,
  }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Check if search field is visible
    const searchField = page.getByRole("textbox", { name: "Search" });
    await expect(searchField).toBeVisible();

    // Fill the search field with a value
    await searchField.pressSequentially(SEARCH_VALUE);
    await expect(searchField).toHaveValue(SEARCH_VALUE);
  });

  test("should search product and display results", async ({ page }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Search for a product
    const searchField = page.getByRole("textbox", { name: "Search" });
    await searchField.pressSequentially(SEARCH_VALUE);
    await searchField.press("Enter");

    // Wait for products to load
    const productList = page.locator("article.prd");
    await expect(productList.first()).toBeVisible();
  });
});

test.describe("Cart Page", () => {
  test("should add a product to cart and update cart count", async ({
    page,
  }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Add item to cart
    await addProductToCart(page);

    // Locate cart button and badge
    const navCartButton = page.getByRole("link", { name: "Cart", exact: true });
    const cartBadge = navCartButton.locator("[id='ci']");

    // Wait until cart count attribute updates to something other than "0"
    await expect(cartBadge).not.toHaveAttribute("data-bbl", "0");
  });

  // test("should view cart and see added products", async ({ page }) => {
  // test.slow();

  // await page.goto(WEBSITE_URL);

  //   await page.locator("#nav-button-cart").waitFor({ state: "visible" });

  //   await page.locator("#nav-button-cart").click();

  //   const cartItems = page.locator(".sc-list-item");

  //   await expect(cartItems.first()).toBeVisible();
  // });

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

async function addProductToCart(page: Page) {
  // Search for a product
  const searchField = page.getByRole("textbox", { name: "Search" });
  await searchField.pressSequentially(SEARCH_VALUE);

  // Wait for navigation triggered by search
  await Promise.all([
    page.waitForURL(/catalog\/\?q=/, { waitUntil: "domcontentloaded" }),
    searchField.press("Enter"),
  ]);

  // Wait for products to load
  const products = page.locator("article.prd");
  await expect(products.first()).toBeVisible();
  const firstProduct = products.first();
  await firstProduct.hover();

  // Add first product to cart
  firstProduct
    .getByRole("button", {
      name: "Add to cart",
    })
    .waitFor({ state: "visible" });

  await firstProduct
    .getByRole("button", {
      name: "Add to cart",
    })
    .click();
}
