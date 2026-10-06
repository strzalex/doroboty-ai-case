import { spawn, spawnSync } from "node:child_process";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "playwright";

const port = 3110;
const origin = `http://127.0.0.1:${port}`;
const build = spawnSync("npm", ["run", "build"], { stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const server = spawn(
  "npm",
  ["run", "start", "--", "--hostname", "127.0.0.1", "--port", String(port)],
  {
    stdio: "ignore",
    detached: process.platform !== "win32",
  },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      if ((await fetch(origin)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Production server did not become ready.");
}

const minimums = { performance: 0.9, accessibility: 0.95, "best-practices": 0.95, seo: 0.95 };
let chrome;
try {
  await waitForServer();
  chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  for (const path of ["/", "/oferty", "/oferty/ai-product-manager"]) {
    const samples = [];
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await lighthouse(`${origin}${path}`, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: Object.keys(minimums),
      });
      if (!result) throw new Error(`Lighthouse produced no result for ${path}`);
      samples.push(
        Object.fromEntries(
          Object.keys(minimums).map((key) => [key, result.lhr.categories[key].score ?? 0]),
        ),
      );
    }
    const scores = Object.fromEntries(
      Object.keys(minimums).map((key) => [
        key,
        samples.map((sample) => sample[key]).sort((left, right) => left - right)[
          Math.floor(samples.length / 2)
        ],
      ]),
    );
    console.log(path, { median: scores, samples });
    for (const [category, minimum] of Object.entries(minimums)) {
      if (scores[category] < minimum)
        throw new Error(`${path}: ${category} ${scores[category]} is below ${minimum}`);
    }
  }
} finally {
  if (chrome) await chrome.kill();
  if (server.pid) {
    try {
      process.kill(process.platform === "win32" ? server.pid : -server.pid, "SIGTERM");
    } catch {}
  }
}
