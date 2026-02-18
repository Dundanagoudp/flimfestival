import { test, expect } from "@playwright/test";

const LOCK_MESSAGE =
  "Too many failed login attempts. This IP is locked for 5 minutes. Try again later.";
const INCORRECT_CREDENTIALS_MESSAGE = "Incorrect email or password";

test.describe("Login rate limit (IP lock)", () => {
  test("5 wrong logins return 401 with credentials error; 6th returns 429 and shows lock message", async ({
    page,
  }) => {
    let loginAttempts = 0;

    await page.route("**/auth/login", async (route) => {
      const request = route.request();
      if (request.method() !== "POST") return route.continue();
      loginAttempts += 1;
      if (loginAttempts <= 5) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: "Unauthorized",
          }),
        });
      } else {
        await route.fulfill({
          status: 429,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: LOCK_MESSAGE,
          }),
        });
      }
    });

    await page.goto("/login");

    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole("button", { name: /^login$/i });

    async function setAltchaPayload() {
      await page.evaluate(() => {
        const form = document.querySelector("form");
        if (!form) return;
        let inp = form.querySelector('input[name="altcha"]');
        if (!inp) {
          inp = document.createElement("input");
          inp.setAttribute("name", "altcha");
          inp.setAttribute("type", "hidden");
          form.appendChild(inp);
        }
        inp.value = "e2e-payload";
      });
    }

    for (let i = 0; i < 5; i++) {
      await emailInput.fill("wrong@example.com");
      await passwordInput.fill("wrongpassword");
      await setAltchaPayload();
      await submitButton.click();

      await expect(page.getByTestId("login-error")).toHaveText(INCORRECT_CREDENTIALS_MESSAGE, {
        timeout: 10000,
      });
    }

    await emailInput.fill("wrong@example.com");
    await passwordInput.fill("wrongpassword");
    await setAltchaPayload();
    await submitButton.click();

    const lockMessage = page.getByTestId("login-lock-message");
    await expect(lockMessage).toBeVisible({ timeout: 10000 });
    await expect(lockMessage).toContainText("Too many failed login attempts");
    await expect(lockMessage).toContainText("locked for 5 minutes");
    await expect(lockMessage).toContainText("Try again later");
  });
});
