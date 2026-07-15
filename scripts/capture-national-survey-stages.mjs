import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const targetRepo = "C:/git-app/survey-workflow-orchestrator";
const outRoot = path.join(root, "out", "national-survey-stage-series", "capture");
const screenRoot = path.join(outRoot, "screens");
const appRoot = path.join(outRoot, "apps");
const manifestPath = path.join(outRoot, "observed-progress.json");
const captureDbPath = path.join(outRoot, `national-survey-capture-${Date.now()}.db`);
const serverPort = Number(process.env.NATIONAL_SURVEY_CAPTURE_PORT || 4310);
const baseUrl = `http://127.0.0.1:${serverPort}`;
const require = createRequire(import.meta.url);

function playwrightModule() {
  for (const candidate of [
    path.join(root, "node_modules", "playwright"),
    path.join(targetRepo, "node_modules", "playwright"),
  ]) {
    try { return require(candidate); } catch { /* next */ }
  }
  throw new Error("Playwright is not installed in PR Studio or Survey Workflow Orchestrator.");
}

async function waitForServer(url) {
  const deadline = Date.now() + 25_000;
  let lastError = "";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (response.ok) return;
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  throw new Error(`National survey platform did not start: ${lastError}`);
}

async function screenshot(page, file) {
  const target = path.join(screenRoot, file);
  await page.screenshot({ path: target, fullPage: false });
  return target;
}

async function observeProject(page) {
  return page.evaluate(() => ({
    projectId: window.location.search,
    title: document.querySelector("#projectTitleView")?.textContent?.trim() || "",
    state: document.querySelector("#projectStateBadge")?.textContent?.trim() || "",
    quality: document.querySelector("#qualityBadge")?.textContent?.trim() || "",
    nextAction: document.querySelector("#nextActionCard")?.innerText?.trim() || "",
    workerSummary: document.querySelector("#workerSummary")?.innerText?.trim() || "",
    stageFocus: document.querySelector("#stageFocus")?.innerText?.trim() || "",
    doneStages: document.querySelectorAll("#taskRail li.done").length,
    currentStages: document.querySelectorAll("#taskRail li.current").length,
    currentAppLabel: document.querySelector("#recommendedApp strong")?.textContent?.trim() || "",
    currentAppUrl: document.querySelector("#recommendedApp [data-action='open-app']")?.getAttribute("data-url") || "",
    runWorkerAvailable: Boolean(document.querySelector("#nextActionCard [data-action='run-worker']")),
    publishAvailable: Boolean(document.querySelector("#nextActionCard [data-action='publish']")),
  }));
}

async function captureCurrentApp(page, index, state) {
  const openButton = page.locator("#nextActionCard [data-action='open-app']");
  if (!(await openButton.count())) return null;
  const popupPromise = page.context().waitForEvent("page", { timeout: 10_000 }).catch(() => null);
  await openButton.click();
  const popup = await popupPromise;
  if (!popup) return null;
  await popup.waitForLoadState("domcontentloaded", { timeout: 20_000 }).catch(() => {});
  await popup.waitForTimeout(700);
  const file = path.join(appRoot, `${String(index).padStart(2, "0")}-${safeName(state.currentAppLabel || "app")}.png`);
  await popup.screenshot({ path: file, fullPage: false });
  const result = { title: await popup.title(), url: popup.url(), screenshot: file };
  await popup.close();
  return result;
}

function safeName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55) || "stage";
}

await mkdir(screenRoot, { recursive: true });
await mkdir(appRoot, { recursive: true });

const server = spawn("node", ["scripts/serve-kyrgyzstan-system-workbench.mjs"], {
  cwd: targetRepo,
  env: { ...process.env, PORT: String(serverPort), NSC_PLATFORM_DB: captureDbPath },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});
let serverLog = "";
server.stdout.on("data", (chunk) => { serverLog += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverLog += chunk.toString(); });

const observed = {
  generatedAt: new Date().toISOString(),
  sourceApp: baseUrl,
  sourceRepo: targetRepo,
  evidencePolicy: "application-generated-state-only",
  project: {},
  stages: [],
  captureErrors: [],
};

const { chromium } = playwrightModule();
let browser;
try {
  await waitForServer(baseUrl);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem("kgNspUiLocale", "en");
    sessionStorage.clear();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => observed.captureErrors.push({ type: "pageerror", message: error.message }));
  page.on("console", (message) => {
    if (message.type() === "error") observed.captureErrors.push({ type: "console", message: message.text() });
  });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  observed.homeScreenshot = await screenshot(page, "00-home.png");

  await page.click("#newProjectBtn");
  observed.setupScreenshot = await screenshot(page, "01-project-setup.png");
  await page.click("[data-preset='international']");
  await page.fill("#projectTitle", "National household survey tutorial");
  await page.fill("#projectObjective", "Produce reviewed household indicators through the complete national survey workflow.");
  await page.selectOption("#inputSource", "excel");
  await page.click("#createProjectBtn");
  await page.waitForFunction(() => !document.querySelector("#projectView")?.hidden, null, { timeout: 45_000 });

  for (let index = 0; index < 14; index += 1) {
    const state = await observeProject(page);
    const stageScreenshot = await screenshot(page, `${String(index + 2).padStart(2, "0")}-${safeName(state.nextAction.split("\n")[1] || "stage")}.png`);
    const app = await captureCurrentApp(page, index, state).catch((error) => {
      observed.captureErrors.push({ index, type: "app-capture", message: error.message });
      return null;
    });
    observed.stages.push({ index, ...state, stageScreenshot, app });
    const freshState = await observeProject(page);
    if (freshState.nextAction !== state.nextAction) {
      continue;
    }
    if (state.publishAvailable) {
      const publishResponsePromise = page.waitForResponse((response) => response.url().includes("/publish") && response.request().method() === "POST", { timeout: 20_000 });
      await page.locator("#nextActionCard [data-action='publish']").click();
      const publishResponse = await publishResponsePromise;
      if (!publishResponse.ok()) {
        throw new Error(`Publish failed with ${publishResponse.status()}: ${await publishResponse.text()}`);
      }
      const projectId = app?.url ? new URL(app.url).searchParams.get("projectId") : null;
      if (!projectId) throw new Error("Could not resolve the application project id after publish.");
      await publishResponse.finished();
      await page.waitForTimeout(1000);
      const visibleState = (await page.locator("#projectStateBadge").textContent())?.trim() || "";
      const storedProject = await page.evaluate(async (id) => {
        const response = await fetch(`/api/projects/${encodeURIComponent(id)}`);
        return response.json();
      }, projectId);
      observed.publishResponse = { projectId, visibleState, completedStageIndex: storedProject.completedStageIndex };
      if (visibleState !== "Published" || storedProject.completedStageIndex !== 7) {
        throw new Error(`Publish did not persist: response index ${storedProject.completedStageIndex}, visible state ${visibleState}`);
      }
      const finalState = await observeProject(page);
      observed.stages.push({
        index: index + 1,
        ...finalState,
        stageScreenshot: await screenshot(page, "99-published.png"),
        app: null,
      });
      break;
    }
    if (!state.runWorkerAvailable) break;

    const button = page.locator("#nextActionCard [data-action='run-worker']");
    if ((await button.count()) !== 1) continue;
    await button.click();
    await page.waitForFunction((previousAction) => {
      const card = document.querySelector("#nextActionCard");
      const currentAction = card?.innerText?.trim() || "";
      const stateBadge = document.querySelector("#projectStateBadge")?.textContent?.trim() || "";
      return stateBadge === "Published" || currentAction !== previousAction;
    }, state.nextAction, { timeout: 30_000 });
    await page.waitForTimeout(300);
    if (app?.url?.includes("/official-output-workbench/")) {
      const outputPage = await context.newPage();
      await outputPage.goto(app.url, { waitUntil: "networkidle" });
      await outputPage.waitForFunction(() => {
        const status = document.querySelector("#outputStatus")?.textContent || "";
        return status.includes("ready for release review");
      }, null, { timeout: 20_000 });
      await outputPage.waitForTimeout(800);
      const postActionScreenshot = path.join(appRoot, `${String(index).padStart(2, "0")}-${safeName(state.currentAppLabel || "app")}-completed.png`);
      await outputPage.screenshot({ path: postActionScreenshot, fullPage: false });
      observed.stages.at(-1).app.postActionScreenshot = postActionScreenshot;
      observed.stages.at(-1).app.postActionStatus = await outputPage.locator("#outputStatus").textContent();
      observed.stages.at(-1).app.postActionArtifacts = JSON.parse(await outputPage.locator("#artifactJson").textContent());
      await outputPage.close();
    }
    if ((await observeProject(page)).state === "Published") {
      const finalState = await observeProject(page);
      observed.stages.push({
        index: index + 1,
        ...finalState,
        stageScreenshot: await screenshot(page, "99-published.png"),
        app: null,
      });
      break;
    }
  }

  const projectUrl = page.url();
  observed.project = { url: projectUrl, title: "National household survey tutorial" };
  await page.click("#homeLink");
  await page.click("#resultsBtn");
  observed.resultsScreenshot = await screenshot(page, "100-results-catalog.png");
  await context.close();
} finally {
  if (browser) await browser.close();
  server.kill();
  observed.serverLog = serverLog.trim();
  await writeFile(manifestPath, `${JSON.stringify(observed, null, 2)}\n`, "utf8");
}

if (observed.captureErrors.length) {
  throw new Error(`Application capture had ${observed.captureErrors.length} errors. See ${manifestPath}`);
}
if (!observed.stages.some((stage) => stage.state === "Published")) {
  throw new Error(`Application did not reach Published. See ${manifestPath}`);
}
console.log(JSON.stringify({ ok: true, manifestPath, stages: observed.stages.map((stage) => ({
  index: stage.index, state: stage.state, nextAction: stage.nextAction, app: stage.app?.title || null,
})) }, null, 2));
