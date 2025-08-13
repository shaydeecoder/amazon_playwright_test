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
  test("should add product to cart and update cart count", async ({ page }) => {
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

  test("should view cart and see added products", async ({ page }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Add product to cart
    await addProductToCart(page);

    // Wait for cart badge to change
    const navCartButton = page.getByRole("link", { name: "Cart" });
    await expect(navCartButton.locator("#ci")).not.toHaveAttribute(
      "data-bbl",
      "0"
    );

    // Navigate to cart page
    await navCartButton.click();
    await expect(page).toHaveURL(/.*\/cart.*/);

    // Verify that the product is in the cart
    const cartItems = page.locator(".prd");
    await expect(cartItems.first()).toBeVisible();
  });

  test("should display cart summary that shows subtotal and checkout button", async ({
    page,
  }) => {
    test.slow();

    await page.goto(WEBSITE_URL);

    // Add product to cart
    await addProductToCart(page);

    // Wait for cart badge to change
    const navCartButton = page.getByRole("link", { name: "Cart" });
    await expect(navCartButton.locator("#ci")).not.toHaveAttribute(
      "data-bbl",
      "0"
    );

    // Navigate to cart page
    await navCartButton.click();
    await expect(page).toHaveURL(/.*\/cart.*/);

    // Cart summary should be visible
    await expect(page.getByText("CART SUMMARY")).toBeVisible();

    // Subtotal should be visible
    await expect(page.getByText("Subtotal", { exact: false })).toBeVisible();

    // Checkout button should be visible
    const checkoutButton = page.getByRole("link", { name: /^Checkout/ });
    await expect(checkoutButton).toBeVisible();
  });
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

  // Ensure the product is in view before hovering
  await firstProduct.scrollIntoViewIfNeeded();

  // Hover over the first product to reveal the "Add to cart" button
  await firstProduct.hover();
  await page.waitForTimeout(300);

  // Now find the add-to-cart button *inside* that hovered card
  const addToCartBtn = firstProduct.locator("footer .add.btn", {
    hasText: "Add to cart",
  });

  // Wait until add-to-cart button is visible and then click it
  await addToCartBtn.waitFor({ state: "visible" });
  await addToCartBtn.click();
}
