import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.setDefaultTimeout(25000);

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "New" }).waitFor({ timeout: 20000 });
await page.waitForTimeout(800);

await page.getByRole("button", { name: "New" }).click();
await page.getByRole("heading", { name: "New gang" }).waitFor();
await page.getByPlaceholder("Ballas").fill("Lightbox Crew");

const dialog = page.getByRole("dialog");
const fileInput = dialog.locator('input[type="file"]');
await fileInput.setInputFiles("/workspace/public/og.jpg");
await page.waitForTimeout(1500);
await page.screenshot({ path: "/workspace/screenshots/lightbox-after-upload.png" });
console.log("dialog html snippet", (await dialog.innerHTML()).slice(0, 1500));

const formThumb = dialog.getByRole("button", { name: /View larger/i });
await formThumb.waitFor({ state: "visible" });
const thumbBox = await formThumb.boundingBox();
await formThumb.click();
await page.waitForTimeout(400);

const lightboxImg = page.locator('[role="dialog"] img').last();
await lightboxImg.waitFor({ state: "visible" });
const lightBox = await lightboxImg.boundingBox();
await page.screenshot({ path: "/workspace/screenshots/lightbox-form.png" });

const thumbArea = (thumbBox?.width ?? 0) * (thumbBox?.height ?? 0);
const lightArea = (lightBox?.width ?? 0) * (lightBox?.height ?? 0);
console.log("form-thumb", thumbBox, "lightbox", lightBox, { thumbArea, lightArea });

if (lightArea <= thumbArea * 2) {
  errors.push(`lightbox not larger than thumb: ${lightArea} vs ${thumbArea}`);
}

await page.keyboard.press("Escape");
await page.waitForTimeout(300);
const stillOpen = await page.locator('[role="dialog"] img').last().isVisible().catch(() => false);
console.log("after-escape-form-dialog-still-open", stillOpen);

await page.getByRole("button", { name: "Save gang" }).click();
await page.waitForTimeout(1200);

await page.getByText("Lightbox Crew").first().click();
await page.waitForTimeout(600);
const inspectorThumb = page.getByRole("button", { name: /View larger: Lightbox Crew logo/i });
await inspectorThumb.waitFor({ state: "visible" });
await inspectorThumb.click();
await page.waitForTimeout(400);
const inspectorLight = page.locator('[role="dialog"] img').last();
await inspectorLight.waitFor({ state: "visible" });
const inspectorBox = await inspectorLight.boundingBox();
console.log("inspector-lightbox", inspectorBox);
await page.screenshot({ path: "/workspace/screenshots/lightbox-inspector-gang.png" });

await page.getByRole("button", { name: "Close" }).last().click();
await page.waitForTimeout(300);

await page.getByRole("button", { name: "Tag", exact: true }).click();
const map = page.locator(".leaflet-container");
const mapBox = await map.boundingBox();
if (!mapBox) throw new Error("no map");
await page.mouse.click(mapBox.x + mapBox.width * 0.55, mapBox.y + mapBox.height * 0.45);
await page.getByRole("heading", { name: "New gang tag" }).waitFor();
await page.getByPlaceholder("Davis alley throw-up").fill("Alley throw-up");
const pinDialog = page.getByRole("dialog");
const pinFile = pinDialog.locator('input[type="file"]');
await pinFile.setInputFiles("/workspace/public/og.jpg");
await page.waitForTimeout(1200);
const pinThumb = pinDialog.getByRole("button", { name: /View larger: Photo/i });
await pinThumb.waitFor({ state: "visible" });
await pinThumb.click();
await page.waitForTimeout(400);
await page.locator('[role="dialog"] img').last().waitFor({ state: "visible" });
await page.screenshot({ path: "/workspace/screenshots/lightbox-pin-form.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Save tag" }).click();
await page.waitForTimeout(1200);

const pinHero = page.getByRole("button", { name: /View larger: Photo/i }).first();
await pinHero.waitFor({ state: "visible" });
const heroBox = await pinHero.boundingBox();
await pinHero.click();
await page.waitForTimeout(400);
const pinLight = page.locator('[role="dialog"] img').last();
await pinLight.waitFor({ state: "visible" });
const pinLightBox = await pinLight.boundingBox();
console.log("pin-hero", heroBox, "pin-lightbox", pinLightBox);
await page.screenshot({ path: "/workspace/screenshots/lightbox-inspector-pin.png" });
await page.keyboard.press("Escape");

console.log("ERRORS", errors);
await browser.close();
if (errors.length) process.exit(1);
