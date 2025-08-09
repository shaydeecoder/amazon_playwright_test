import "expect-playwright";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveCountGreaterThan(expectedCount: number): Promise<R>;
    }
  }
}
