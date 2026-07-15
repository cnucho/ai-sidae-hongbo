import fs from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const appUrl = process.env.SURVEY_WORKFLOW_DEMO_URL ??
  "https://survey-workflow-orchestrator-production.up.railway.app/";
const tutorialMode = process.argv.includes("--tutorial");
const artifactSlug = tutorialMode
  ? "survey-workflow-orchestrator-tutorial"
  : "survey-workflow-orchestrator-demo";
const manifestPath = path.join(
  root,
  "docs",
  "demo-scripts",
  "survey-workflow-orchestrator",
  tutorialMode ? "tutorial-beats-en.json" : "beats-en.json",
);
const outRoot = path.join(root, "out", artifactSlug);
const rawRoot = path.join(outRoot, "screens", "raw");
const slideRoot = path.join(outRoot, "screens", "slides");
const narrationRoot = path.join(outRoot, "narration");
const audioRoot = path.join(outRoot, "audio");
const clipRoot = path.join(outRoot, "clips");
const finalPath = path.join(outRoot, `${artifactSlug}.mp4`);
const concatPath = path.join(outRoot, "concat.txt");
const reportPath = path.join(outRoot, "render-report.json");
const sampleFramePath = path.join(outRoot, "sample-frame.png");
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const playwrightCandidates = [
  path.join(root, "node_modules", "playwright"),
  "C:/git-app/CI Plan Builder/node_modules/playwright",
  "C:/git-app/AcademicResearchCopilot/node_modules/playwright",
];

function resolvePlaywright() {
  for (const candidate of playwrightCandidates) {
    try { return require(candidate); } catch { /* try next */ }
  }
  throw new Error("Playwright was not found in the configured workspaces.");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    ...options,
  });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
}

function capture(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", shell: false });
  if (result.status !== 0) throw new Error(result.stderr || `${command} failed`);
  return result.stdout.trim();
}

function probeDuration(file) {
  return Number(capture("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file,
  ]));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function imageDataUrl(file) {
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
}

async function ensureDirs() {
  await Promise.all([rawRoot, slideRoot, narrationRoot, audioRoot, clipRoot]
    .map((dir) => mkdir(dir, { recursive: true })));
}

async function waitForText(page, text, timeout = 20_000) {
  await page.getByText(text, { exact: true }).waitFor({ state: "visible", timeout });
}

async function clickWithCursor(page, locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Could not locate the demo click target.");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y, { steps: 22 });
  await page.evaluate(([px, py]) => window.__demoRipple?.(px, py), [x, y]);
  await page.waitForTimeout(180);
  await locator.click();
}

const cursorInit = `(() => {
  const cursor = document.createElement('div');
  cursor.id = '__demo_cursor';
  Object.assign(cursor.style, {position:'fixed', width:'22px', height:'22px', borderRadius:'50%',
    border:'3px solid #2563eb', background:'rgba(37,99,235,.18)', left:'18px', top:'18px',
    transform:'translate(-50%,-50%)', pointerEvents:'none', zIndex:'2147483647',
    boxShadow:'0 0 0 5px rgba(37,99,235,.12)'});
  document.documentElement.appendChild(cursor);
  addEventListener('mousemove', e => { cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; });
  window.__demoRipple = (x,y) => { const r=document.createElement('div');
    Object.assign(r.style,{position:'fixed',left:x+'px',top:y+'px',width:'14px',height:'14px',
      borderRadius:'50%',border:'3px solid #2563eb',transform:'translate(-50%,-50%)',
      pointerEvents:'none',zIndex:'2147483646'}); document.body.appendChild(r);
    r.animate([{width:'14px',height:'14px',opacity:1},{width:'76px',height:'76px',opacity:0}],
      {duration:600,easing:'ease-out'}).onfinish=()=>r.remove(); };
})();`;

async function captureLiveScreens(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(cursorInit);
  const page = await context.newPage();
  await page.goto(appUrl, { waitUntil: "networkidle", timeout: 30_000 });
  await waitForText(page, "Continue your latest work");
  await page.screenshot({ path: path.join(rawRoot, "home.png") });

  const newSurvey = page.locator("main").getByRole("button", { name: "New survey", exact: true });
  await clickWithCursor(page, newSurvey);
  await waitForText(page, "Choose an official template");
  await page.screenshot({ path: path.join(rawRoot, "templates.png") });

  const laborCard = page.locator("article").filter({ has: page.getByRole("heading", { name: "Labor survey", exact: true }) });
  const laborStart = laborCard.getByRole("button", { name: "Start a new survey", exact: true });
  await clickWithCursor(page, laborStart);
  await waitForText(page, "Labor Survey 2027");
  await page.screenshot({ path: path.join(rawRoot, "project.png") });

  const openReview = page.getByRole("button", { name: "Open review workspace", exact: true });
  await clickWithCursor(page, openReview);
  await waitForText(page, "Survey Input Editor", 25_000);
  await page.screenshot({ path: path.join(rawRoot, "editor.png") });

  if (tutorialMode) {
    await page.screenshot({ path: path.join(rawRoot, "author.png") });
    const tabs = {
      flow: "Flow — View and edit question flow, conditions, routes, and relations.",
      metadata: "Metadata — View extracted variables, routes, codebook, and analysis specs.",
      review: "Review — Preview responses and check validation issues.",
      define: "Define — Edit one question's fields, wording, and metadata.",
      bank: "Bank — Load template or library questions.",
      export: "Export — Download draft JSON package.",
    };
    const openTab = async (name, output) => {
      await clickWithCursor(page, page.getByRole("button", { name: tabs[name], exact: true }));
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(rawRoot, `${output}.png`) });
    };

    await openTab("flow", "flow");
    await openTab("metadata", "metadata");
    await openTab("define", "define");
    await openTab("bank", "bank");
    await openTab("export", "export");

    await clickWithCursor(page, page.getByRole("button", { name: tabs.define, exact: true }));
    await page.getByRole("textbox", { name: "Question text", exact: true })
      .fill("What is your current employment status?");
    await page.getByRole("textbox", { name: "One choice per line. Use label only or code=label.", exact: true })
      .fill("1=Employed\n2=Unemployed\n3=Not in the labor force");
    await clickWithCursor(page, page.getByRole("button", { name: "Save", exact: true }));
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(rawRoot, "define-complete.png") });
    await openTab("flow", "flow-after");
    await openTab("metadata", "metadata-after");
    await openTab("review", "review-after");
  }
  await context.close();
}

function slideHtml(beat, rawPath, totalBeats) {
  const titleOnly = beat.screen === "title";
  const background = titleOnly
    ? "linear-gradient(135deg,#07182f 0%,#0b3760 56%,#126b75 100%)"
    : `linear-gradient(rgba(5,15,30,.08),rgba(5,15,30,.22)),url('${imageDataUrl(rawPath)}') center/cover no-repeat`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;width:1440px;height:900px;overflow:hidden;background:${background};
    font-family:Inter,Segoe UI,Arial,sans-serif;color:white}.brand{position:absolute;left:58px;top:44px;
    font-size:18px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-shadow:0 2px 8px #0008}
    .title{position:absolute;left:100px;top:250px;width:1120px;font-size:68px;line-height:1.08;font-weight:780}
    .promise{position:absolute;left:105px;top:430px;width:950px;font-size:30px;line-height:1.45;color:#d8efff}
    .shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(3,12,25,.88) 100%)}
    .caption{position:absolute;left:58px;bottom:42px;max-width:1050px;padding:17px 24px;border-left:6px solid #49d7c4;
    background:rgba(4,18,34,.88);font-size:34px;font-weight:720;line-height:1.15;border-radius:0 12px 12px 0;
    box-shadow:0 12px 35px #0007}.beat{position:absolute;right:58px;bottom:50px;font-size:18px;color:#cde8ff}
  </style></head><body>${titleOnly ? `
    <div class="brand">Survey Workflow Orchestrator</div><div class="title">${escapeHtml(beat.title ?? "From questionnaire to fieldwork.")}</div>
    <div class="promise">${escapeHtml(beat.promise ?? "A visible, guided workflow for the full survey lifecycle.")}</div>` : `
    <div class="shade"></div><div class="brand">Survey Workflow Orchestrator</div>`}
    <div class="caption">${escapeHtml(beat.subtitle)}</div><div class="beat">${escapeHtml(beat.id.slice(0,2))} / ${String(totalBeats).padStart(2, "0")}</div>
  </body></html>`;
}

async function buildSlides(browser, beats) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const beat of beats) {
    const rawPath = beat.screen === "title" ? undefined : path.join(rawRoot, `${beat.screen}.png`);
    await page.setContent(slideHtml(beat, rawPath, beats.length), { waitUntil: "load" });
    await page.screenshot({ path: path.join(slideRoot, `${beat.id}.png`) });
  }
  await page.close();
}

async function renderBeat(beat) {
  const textPath = path.join(narrationRoot, `${beat.id}.txt`);
  const audioPath = path.join(audioRoot, `${beat.id}.wav`);
  const clipPath = path.join(clipRoot, `${beat.id}.mp4`);
  const slidePath = path.join(slideRoot, `${beat.id}.png`);
  await writeFile(textPath, `${beat.narration}\n`, "utf8");
  run("node", ["scripts/synthesize-speech.mjs", "--input", textPath, "--output", audioPath], {
    env: { ...process.env, PR_STUDIO_TTS_PROVIDER_EN: "openai", PR_STUDIO_TTS_LANGUAGE: "en" },
  });
  const audioDuration = probeDuration(audioPath);
  const duration = Math.max(audioDuration + beat.postPauseMs / 1000, beat.minHoldMs / 1000);
  run("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-i", slidePath, "-i", audioPath,
    "-filter_complex", `[1:a]apad=pad_dur=${duration.toFixed(3)}[a]`, "-map", "0:v", "-map", "[a]",
    "-t", duration.toFixed(3), "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", clipPath]);
  return { ...beat, audioDuration, renderedDuration: probeDuration(clipPath) };
}

await ensureDirs();
if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required for the approved English narration workflow.");
const beats = JSON.parse(await readFile(manifestPath, "utf8"));
const { chromium } = resolvePlaywright();
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
try {
  await captureLiveScreens(browser);
  await buildSlides(browser, beats);
} finally {
  await browser.close();
}

const rendered = [];
for (const beat of beats) rendered.push(await renderBeat(beat));
await writeFile(concatPath, rendered.map((beat) =>
  `file '${path.join(clipRoot, `${beat.id}.mp4`).replaceAll("'", "'\\''").replaceAll("\\", "/")}'`).join("\n") + "\n");
run("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", concatPath,
  "-c", "copy", "-movflags", "+faststart", finalPath]);
const finalDuration = probeDuration(finalPath);
run("ffmpeg", ["-y", "-loglevel", "error", "-ss", (finalDuration * 0.72).toFixed(3), "-i", finalPath,
  "-frames:v", "1", sampleFramePath]);
const report = {
  generatedAt: new Date().toISOString(), appUrl, language: "en",
  tutorialMode,
  narrationProvider: "openai", credentialDecision: "reuse-existing-environment-key",
  credentialValueStored: false, width: 1440, height: 900, fps: 30,
  finalPath, finalDuration, fileSize: fs.statSync(finalPath).size,
  sampleFramePath, beats: rendered,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
