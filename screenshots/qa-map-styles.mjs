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
await page.waitForTimeout(2500);

async function shot(name) {
  await page.waitForTimeout(1800);
  const tiles = await page.locator("img.leaflet-tile-loaded").count();
  const btns = await page.locator("header button").allTextContents();
  console.log(name, "tiles", tiles, "header", btns.slice(0, 12));
  await page.screenshot({
    path: `/workspace/screenshots/map-${name}.png`,
    fullPage: false,
  });
}

await shot("atlas");

await page.getByRole("button", { name: "Satellite" }).click();
await shot("satellite");

await page.getByRole("button", { name: "Print" }).click();
await shot("print");

await page.getByRole("button", { name: "Atlas" }).click();
await page.getByRole("button", { name: "Labels" }).click();
await shot("atlas-labels");

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(2200);
await mobile.screenshot({ path: "/workspace/screenshots/map-atlas-mobile.png" });

console.log("ERRORS", errors);
await browser.close();
