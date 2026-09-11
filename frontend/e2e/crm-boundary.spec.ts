import { expect, test } from "@playwright/test";

test("redirects the root route to the CRM", async ({ request }) => {
  const response = await request.get("/", { maxRedirects: 0 });

  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe("/crm");
});

test("keeps robots disallowed", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain("Disallow: /");
});
