import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE", msg.text());
});
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);

const atlasBtn = page.getByRole("button", { name: "Atlas", exact: true });
const satBtn = page.getByRole("button", { name: "Satellite", exact: true });
const printBtn = page.getByRole("button", { name: "Print", exact: true });
console.log("buttons", await atlasBtn.count(), await satBtn.count(), await printBtn.count());
console.log("davis", await page.getByText("Davis", { exact: true }).count());
console.log("gsf", await page.getByText("Grove Street Families").count());

await page.screenshot({ path: "/workspace/screenshots/map-atlas.png" });

await satBtn.click();
await page.waitForTimeout(1600);
await page.screenshot({ path: "/workspace/screenshots/map-satellite.png" });

await printBtn.click();
await page.waitForTimeout(1600);
await page.screenshot({ path: "/workspace/screenshots/map-print.png" });

await atlasBtn.click();
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Grove Street Families GSF" }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "/workspace/screenshots/map-atlas-turf.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(1500);
console.log("mobile atlas", await mobile.getByRole("button", { name: "Atlas", exact: true }).count());
await mobile.screenshot({ path: "/workspace/screenshots/map-atlas-mobile.png" });

console.log("done");
await browser.close();
