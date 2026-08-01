# Survey Platform tutorial — code and UX observations

Date: 2026-08-01
Status: recording in progress; fix only after tutorial rendering is complete

## Recording policy

This file records defects and improvement opportunities observed while producing the six tutorial videos. Video production and application correction are deliberately separated: first preserve reproducible visual evidence, then prioritize and fix the source applications after all chapters are rendered and reviewed.

## Observations

### OBS-001 — authoring screen shows mixed language state

- Surface: Question Input Workbench
- Evidence: the global language selector displays English while the preview language control is set to RU; the browser file control is localized by the Windows environment.
- Viewer impact: a first-time user may interpret the Russian preview as an unintended global-language mismatch.
- Recommended follow-up: label the preview language control explicitly as independent from the workbench UI language, or synchronize the initial state when a project is loaded.
- Fix status: deferred until video production completes.

### OBS-002 — authoring workspace is too dense for a first-time 1080p walkthrough

- Surface: Question Input Workbench
- Evidence: library, sheet, form, preview, relation graph, checks, and contract panels are visible simultaneously; lower content is partially outside the first viewport.
- Viewer impact: important controls compete for attention and require deliberate zoom/focus in tutorials.
- Recommended follow-up: add a tutorial/focus mode or collapsible secondary panels, preserving the existing full workspace for expert users.
- Fix status: deferred until video production completes.

### OBS-003 — tutorial stage handoff is explained in guidance but not presented as a prominent workflow action

- Surface: Question Input Workbench and downstream workbenches
- Evidence: guidance correctly says not to publish from authoring and to export a draft, but the next validated stage is not a visually dominant action.
- Viewer impact: new users may save/export without understanding where to continue.
- Recommended follow-up: add explicit “Continue to validation/distribution/cleaning/analysis/reporting” handoff actions that preserve the generated contract.
- Fix status: deferred until video production completes.

### OBS-004 — distribution preview opens without a usable respondent token

- Surface: Distribution Workbench respondent preview.
- Evidence: after loading the sample runtime package and building the distribution package, the preview panel displays `respondent token is missing` and explains that a valid link requires `/?token=...`.
- Viewer impact: the workbench appears to have built a package successfully, but it does not prove that a respondent can actually enter the survey.
- Recommended follow-up: have the sample/build flow mint or attach a short-lived preview token, or disable the preview action until a valid tokenized URL exists. The UI should distinguish package generation success from respondent-access success.
- Fix status: deferred until video production completes.

### OBS-005 — single-chapter renders overwrite the generated render manifest

- Surface: PR Studio `record-survey-platform-tutorial.mjs`.
- Evidence: sequential single-chapter invocations left `render-manifest.json` containing only the final chapter.
- Viewer impact: the videos are intact, but machine-readable production evidence is incomplete.
- Correction: merge results by chapter ID when updating the generated manifest.
- Fix status: corrected after all six chapter videos were rendered.

## Post-production correction procedure

1. Complete and watch all six tutorial chapters.
2. Add further observations with chapter/time evidence.
3. Separate PR Studio recorder defects from Survey Workflow Orchestrator product defects.
4. Prioritize by user-blocking impact, not visual preference alone.
5. Fix each target repository independently with focused tests and live read-back.
