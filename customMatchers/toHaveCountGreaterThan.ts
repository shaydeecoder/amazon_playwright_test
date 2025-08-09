import { expect } from "@playwright/test";

export function extendExpectWithToHaveCountGreaterThan() {
  expect.extend({
    async toHaveCountGreaterThan(locator, expectedCount: number) {
      const actualCount = await locator.count();
      const pass = actualCount > expectedCount;

      return {
        message: () =>
          `Expected locator to have count greater than ${expectedCount}, but got ${actualCount}`,
        pass,
      };
    },
  });
}
