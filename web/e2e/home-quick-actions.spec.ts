import { expect, test } from "@playwright/test";



test.describe("Home — blank surface", () => {

  test("renders a full white canvas", async ({ page }) => {

    await page.goto("/");

    await expect(page.getByTestId("blank-white-screen")).toBeVisible();

  });

});

