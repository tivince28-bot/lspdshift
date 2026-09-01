import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.setDefaultTimeout(20000);
page.on("dialog", (d) => d.accept());

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "New" }).waitFor();
await page.waitForTimeout(600);

const crew = page.getByRole("button", { name: /Lightbox Crew/i }).first();
if (await crew.count()) {
  await crew.click();
  await page.waitForTimeout(400);
  const logo = page.getByRole("button", { name: /View larger: Lightbox Crew logo/i });
  if (await logo.count()) {
    await logo.click();
    await page.waitForTimeout(400);
    const img = page.locator("[role='dialog'] img").last();
    const box = await img.boundingBox();
    console.log("enlarged-logo", box);
    await page.screenshot({ path: "/workspace/screenshots/lightbox-final.png" });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  }
  const tagRow = page.getByRole("button", { name: /Alley throw-up/i });
  if (await tagRow.count()) {
    await tagRow.click();
    await page.waitForTimeout(400);
    const photo = page.getByRole("button", { name: /View larger: Photo/i }).first();
    if (await photo.count()) {
      await photo.click();
      await page.waitForTimeout(400);
      const pbox = await page.locator("[role='dialog'] img").last().boundingBox();
      console.log("enlarged-photo", pbox);
      await page.screenshot({ path: "/workspace/screenshots/lightbox-pin-final.png" });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForTimeout(600);
    await crew.click();
    await page.waitForTimeout(300);
  }
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(800);
}

const leftover = await page.getByText("Lightbox Crew").count();
console.log("leftover Lightbox Crew", leftover);

const pin = page.getByText("Alley throw-up");
if (await pin.count()) {
  console.log("orphan pin still present", await pin.count());
}

console.log("ERRORS", errors);
await browser.close();
if (errors.length) process.exit(1);
