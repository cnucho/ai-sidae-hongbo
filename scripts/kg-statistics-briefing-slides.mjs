import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ensureDirs, outDir, workDir } from "./kg-statistics-demo-common.mjs";

await ensureDirs();
const runtime = process.env.ARTIFACT_TOOL_ROOT ??
  path.join(process.env.USERPROFILE ?? "", ".cache", "codex-runtimes", "codex-primary-runtime",
    "dependencies", "node", "node_modules", "@oai", "artifact-tool");
const { Presentation, PresentationFile } = await import(
  pathToFileURL(path.join(path.resolve(runtime), "dist", "artifact_tool.mjs"))
);

const candidates = path.join(outDir, "screenshot-candidates");
const designerCandidates = path.join(outDir, "questionnaire-designer-candidates");
const slidesDir = path.join(workDir, "briefing-slides");
await mkdir(slidesDir, { recursive: true });
const sourceCommit = "3bc7f25";
const colors = {
  bg: "#F4F7F6", ink: "#102A2A", teal: "#0E625F", tealDark: "#0A4745",
  navy: "#19324D", gray: "#60706E", line: "#CAD8D5", white: "#FFFFFF", gold: "#D89B3C"
};

const deck = Presentation.create({ slideSize: { width: 1920, height: 1080 } });

function shape(slide, geometry, position, fill, line = "none", radius = undefined) {
  return slide.shapes.add({
    geometry, position, fill, borderRadius: radius,
    line: { fill: line, width: line === "none" ? 0 : 2 }
  });
}

function addText(slide, value, position, style = {}) {
  const item = shape(slide, "textbox", position, "none");
  item.text = value;
  item.text.style = {
    fontFamily: "Aptos", color: colors.ink, fontSize: 24, lineSpacing: 1.08, ...style
  };
  return item;
}

async function addScreenshot(slide, file, alt, position = { left: 660, top: 205, width: 1160, height: 680 }) {
  const sourceDir = file.startsWith("designer:") ? designerCandidates : candidates;
  const sourceFile = file.replace(/^designer:/, "");
  const bytes = await readFile(path.join(sourceDir, sourceFile));
  shape(slide, "roundRect",
    { left: position.left - 12, top: position.top - 12, width: position.width + 24, height: position.height + 24 },
    colors.white, colors.line, 18);
  slide.images.add({
    blob: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    contentType: "image/png",
    alt,
    fit: "contain",
    position,
    geometry: "roundRect",
    borderRadius: "rounded-xl"
  });
}

function addChrome(slide, section, number, title, takeaway) {
  slide.background.fill = colors.bg;
  shape(slide, "rect", { left: 0, top: 0, width: 28, height: 1080 }, colors.teal);
  addText(slide, section.toUpperCase(), { left: 92, top: 58, width: 760, height: 30 },
    { fontSize: 18, bold: true, color: colors.teal, letterSpacing: 1.4 });
  addText(slide, number, { left: 1710, top: 52, width: 110, height: 48 },
    { fontSize: 30, bold: true, color: colors.gold, textAlign: "right" });
  addText(slide, title, { left: 92, top: 112, width: 1610, height: 90 },
    { fontSize: 42, bold: true, color: colors.ink });
  addText(slide, takeaway, { left: 92, top: 920, width: 1650, height: 58 },
    { fontSize: 23, bold: true, color: colors.tealDark });
  addText(slide, "Household Living Conditions Survey 2026 · fictional aggregate demonstration",
    { left: 92, top: 1012, width: 1050, height: 28 }, { fontSize: 15, color: colors.gray });
}

function addBullets(slide, items, heading = "What this proves") {
  addText(slide, heading, { left: 92, top: 248, width: 470, height: 42 },
    { fontSize: 25, bold: true, color: colors.navy });
  items.forEach((item, index) => {
    shape(slide, "ellipse", { left: 94, top: 326 + index * 130, width: 34, height: 34 },
      index === 0 ? colors.gold : colors.teal);
    addText(slide, String(index + 1), { left: 94, top: 331 + index * 130, width: 34, height: 22 },
      { fontSize: 15, bold: true, color: colors.white, textAlign: "center" });
    addText(slide, item, { left: 150, top: 315 + index * 130, width: 425, height: 92 },
      { fontSize: 23, bold: index === 0, color: colors.ink });
  });
}

function addNotes(slide, narration, screenshot = "") {
  slide.speakerNotes.textFrame.setText([
    narration,
    "",
    "[Sources]",
    `- Authenticated KG Statistics operator application, cnucho/survey-workflow-orchestrator, branch codex/kg-mvp-internal-help, commit ${sourceCommit}.`,
    screenshot ? `- Screenshot evidence: ${screenshot}.` : ""
  ].filter(Boolean).join("\n"));
}

const title = deck.slides.add();
title.background.fill = colors.tealDark;
addText(title, "KG STATISTICS PRODUCTION SYSTEM", { left: 120, top: 105, width: 900, height: 34 },
  { fontSize: 20, bold: true, color: "#B9D8D2", letterSpacing: 1.8 });
addText(title, "A complete survey workflow,\nshown through real operator screens",
  { left: 120, top: 245, width: 1120, height: 250 },
  { fontSize: 62, bold: true, color: colors.white });
addText(title, "English briefing for the Kyrgyz Republic National Statistical Committee",
  { left: 120, top: 565, width: 1080, height: 70 }, { fontSize: 28, color: "#DDEBE8" });
shape(title, "roundRect", { left: 1320, top: 200, width: 430, height: 560 }, "#0E625F", "none", 28);
addText(title, "1", { left: 1390, top: 275, width: 80, height: 80 }, { fontSize: 58, bold: true, color: colors.gold });
addText(title, "Complete coverage\nof survey stages", { left: 1390, top: 375, width: 300, height: 110 },
  { fontSize: 30, bold: true, color: colors.white });
addText(title, "2", { left: 1390, top: 540, width: 80, height: 80 }, { fontSize: 58, bold: true, color: colors.gold });
addText(title, "Easy to learn,\noperate, and support", { left: 1390, top: 640, width: 300, height: 100 },
  { fontSize: 28, bold: true, color: colors.white });
addNotes(title, "We will first follow the actual survey sequence. We will then show how operators learn the system and how the service is maintained.");

const overview = deck.slides.add();
addChrome(overview, "Survey coverage", "02", "One controlled path covers the full survey lifecycle",
  "The first decision is whether every required survey stage is supported without a disconnected hand-off.");
addBullets(overview, [
  "Ten visible stages from project creation to official release",
  "The server exposes only the next action allowed for the signed-in user",
  "Every accepted stage leaves active evidence and a receipt"
], "Start with the survey—not the software modules");
await addScreenshot(overview, "06-project-workflow-start.png", "New project workflow showing ten survey stages");
addNotes(overview, "The interface is organized around the operational sequence of a survey. The operator sees the current revision, current evidence, and the next permitted action.", "06-project-workflow-start.png");

const slideSpecs = [
  ["Project setup", "03", "Projects begin with controlled access and clear responsibility",
    ["A project has an authoritative identity and objective", "Membership determines which projects a person can see", "Role and membership work together; ownership does not bypass duties"],
    "07-project-access.png", "Project access screen with active memberships",
    "The survey manager creates the controlled workspace and assigns staff before production begins."],
  ["Questionnaire authoring", "04", "Questionnaires can be entered directly at scale",
    ["Spreadsheet input supports rapid work across many questions", "The selected-question editor exposes wording, response type, choices, and metadata", "English, Kyrgyz, and Russian labels remain part of one design"],
    "designer:01-author-sheet.png", "Spreadsheet-style questionnaire input",
    "This is the survey-production workspace: staff can enter and edit the actual questionnaire, not only approve it."],
  ["Existing questionnaire", "05", "A saved household survey opens as a fully editable questionnaire",
    ["The project contains real household, employment, water, electricity, and sanitation questions", "English, Russian, and Kyrgyz labels are preserved", "Imported questions, choices, validation, and conditions remain editable"],
    "designer:13-imported-questionnaire-editor.png", "Imported Household Living Conditions questionnaire",
    "This is a real saved questionnaire reopened for continued work—not an empty import dialog."],
  ["Survey Bank", "06", "Standard surveys and modules do not need to be rebuilt",
    ["Open a saved project JSON or supported XLSX workbook", "Survey Bank stores reusable questionnaires", "The KG household library provides common questions, code lists, and rule templates"],
    "designer:09-survey-bank.png", "Survey Bank with import and reusable survey controls",
    "Teams can begin from an existing survey, a standard module, or a validated external file."],
  ["Conditions and routing", "07", "Response conditions are configured as readable rules",
    ["Choose the condition effect, source question, operator, value, and target", "Build Show-if, skip, and required-if rules without writing code", "The generated condition remains inspectable before it is applied"],
    "designer:06-condition-card.png", "Readable response-condition card",
    "Complex questionnaires can express who sees each question and where the interview proceeds next."],
  ["Flow review", "08", "The complete questionnaire flow can be inspected before fieldwork",
    ["Question order and branches appear in one flow map", "Applied and pending routes remain distinguishable", "Reviewers can inspect logic without reading a spreadsheet formula"],
    "designer:07-flow-map.png", "Questionnaire flow map with branches",
    "Routing is visible and reviewable before the collection package is prepared."],
  ["Governed submission", "09", "The completed questionnaire enters the controlled workflow",
    ["The designer submits domain content through the operator workflow", "Artifact ID, version, producer, and hash are server-controlled", "Submission creates a reviewable questionnaire artifact"],
    "09-questionnaire-input.png", "Questionnaire submission form in the controlled workflow",
    "Authoring and governance are connected: trusted identity is created when the questionnaire is submitted."],
  ["Independent review", "10", "A different reviewer approves the exact questionnaire version",
    ["The decision is bound to one artifact identity and SHA-256", "The reviewer records an explicit audit reason", "The accepted receipt advances the workflow revision"],
    "14-questionnaire-approval-receipt.png", "Accepted questionnaire approval receipt",
    "Approval cannot silently transfer to a later questionnaire version."],
  ["Field preparation", "11", "Collection is prepared from approved questionnaire evidence",
    ["Mode, field dates, and device profile are explicit", "The collection package is versioned and traceable", "Offline work begins only from the accepted package"],
    "15-collection-input.png", "Prepare collection form",
    "The system connects questionnaire approval to practical field preparation."],
  ["Collection and synchronization", "12", "Offline responses return through an accepted server batch",
    ["Field identity and batch ownership are checked", "Received, accepted, duplicate, and rejected counts come from server evidence", "Respondent rows are not exposed in the publication workflow"],
    "20-synchronization-receipt.png", "Response synchronization receipt and active evidence",
    "This is the controlled boundary between field capture and statistical production."],
  ["Cleaning review", "13", "Cleaning decisions remain linked to synchronized responses",
    ["Cleaning methods and quality flags are recorded", "A separate reviewer accepts or rejects the cleaned result", "Historical evidence remains available when later work is superseded"],
    "23-cleaning-receipt.png", "Accepted cleaning review receipt",
    "The system records not only a clean dataset, but also who reviewed it and why."],
  ["Analysis", "14", "Analysts produce publishable indicators and tables from approved data",
    ["Report metadata, locale, template, and version are explicit", "Indicators contain units, precision, and uncertainty", "The report package preserves upstream lineage"],
    "24-analysis-input.png", "Analysis and report production form",
    "Operators work with aggregate statistical results rather than raw respondent records."],
  ["Independent verification", "15", "Verification is a distinct, reproducible decision",
    ["PASSED, FAILED, and INCOMPLETE remain explicit outcomes", "Methods, tables, cells, discrepancies, and report hash are recorded", "The report producer cannot verify their own output"],
    "29-verification-receipt.png", "Independent verification receipt",
    "Only PASSED verification bound to the exact report can continue."],
  ["Publication governance", "16", "Publication approval is separate from technical verification",
    ["The approver reviews the verified report", "The decision is bound to the same active report evidence", "Publisher authority cannot manufacture missing approval"],
    "32-publication-approval-receipt.png", "Publication approval receipt",
    "Governance remains visible: verification, approval, and release are different authorities."],
  ["Official outputs", "17", "One immutable release delivers every official format",
    ["Standalone HTML and publication-quality PDF", "Formatted XLSX plus table and cell-lineage CSV", "Every file has persisted identity, size, MIME type, and SHA-256"],
    "37-release-inventory.png", "Immutable release inventory with HTML PDF CSV and XLSX",
    "The audience can see real downloadable publication files—not a JSON promise or screen-only report."]
];

for (const [section, number, titleText, bullets, image, alt, takeaway] of slideSpecs) {
  const slide = deck.slides.add();
  addChrome(slide, section, number, titleText, takeaway);
  addBullets(slide, bullets);
  await addScreenshot(slide, image, alt);
  addNotes(slide, takeaway, image);
}

const learning = deck.slides.add();
addChrome(learning, "Ease of use", "18", "Help is available where the operator needs it—without cluttering the screen",
  "Operators can learn the system in context, while the normal workspace stays focused.");
addBullets(learning, [
  "Screen and action guidance opens only after pressing Help",
  "Short field explanations appear only on hover or keyboard focus",
  "The survey guide follows the same ten-stage operational sequence"
], "Learning is part of the application");
await addScreenshot(learning, "08-support-survey-guide.png", "In-application ten-stage help and user guide");
addNotes(learning, "The Help area is an internal manual organized by the real survey sequence. Contextual help is hidden until requested.", "08-support-survey-guide.png");

const service = deck.slides.add();
addChrome(service, "Maintenance", "19", "Operations are supported as a service, not left to each survey team",
  "The operating model combines an in-application manual, controlled updates, and remote SaaS support.");
const serviceItems = [
  ["MANUAL", "In-application guidance now; illustrated downloadable manuals can use the same verified content."],
  ["UPDATES", "Security and library updates are checked through the internet, compatibility-tested, and released under change control."],
  ["FAULTS", "SaaS support provides remote diagnosis, recovery guidance, and verified fixes without requesting passwords or respondent rows."]
];
serviceItems.forEach(([label, body], index) => {
  const top = 270 + index * 205;
  addText(service, label, { left: 150, top, width: 250, height: 50 },
    { fontSize: 24, bold: true, color: index === 1 ? colors.gold : colors.teal });
  addText(service, body, { left: 430, top: top - 8, width: 1240, height: 105 },
    { fontSize: 27, color: colors.ink });
  if (index < 2) shape(service, "rect", { left: 150, top: top + 135, width: 1520, height: 2 }, colors.line);
});
addNotes(service, "Maintenance is explained honestly. Updates are tested and controlled; they are not blindly applied during an active survey. Problems are supported remotely as a SaaS service.");

const close = deck.slides.add();
close.background.fill = colors.tealDark;
addText(close, "THE DECISION", { left: 120, top: 105, width: 500, height: 34 },
  { fontSize: 20, bold: true, color: "#B9D8D2", letterSpacing: 1.8 });
addText(close, "Use one pilot survey to validate\npeople, process, and deployment",
  { left: 120, top: 225, width: 1100, height: 210 }, { fontSize: 58, bold: true, color: colors.white });
addText(close, "The MVP already demonstrates the complete production path. A national pilot should now confirm local governance, infrastructure, training, and operating procedures.",
  { left: 120, top: 505, width: 1090, height: 145 }, { fontSize: 29, color: "#DDEBE8" });
shape(close, "roundRect", { left: 1325, top: 205, width: 420, height: 560 }, "#0E625F", "none", 28);
addText(close, "Pilot focus", { left: 1390, top: 275, width: 260, height: 45 },
  { fontSize: 28, bold: true, color: colors.gold });
addText(close, "• Local roles and approvals\n\n• Hosting and identity\n\n• Training and manuals\n\n• Support and update procedures",
  { left: 1390, top: 365, width: 290, height: 330 }, { fontSize: 25, color: colors.white });
addNotes(close, "The recommended next step is a controlled pilot survey. It should validate local organization and deployment without expanding the MVP unnecessarily.");

for (const [index, slide] of deck.slides.items.entries()) {
  const stem = `briefing-slide-${String(index + 1).padStart(2, "0")}`;
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await writeFile(path.join(slidesDir, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
  await writeFile(path.join(slidesDir, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
}
const montage = await deck.export({ format: "png", montage: true, scale: 0.22 });
await writeFile(path.join(outDir, "kg-statistics-nsc-briefing-contact-sheet.png"), new Uint8Array(await montage.arrayBuffer()));
const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(path.join(outDir, "kg-statistics-nsc-briefing-en.pptx"));
console.log(`Rendered ${deck.slides.items.length} screenshot-led English briefing slides.`);
