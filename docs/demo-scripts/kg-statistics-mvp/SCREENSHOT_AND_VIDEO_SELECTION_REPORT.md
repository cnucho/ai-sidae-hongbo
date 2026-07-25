# KG Statistics Production System — NSC Briefing Production Report

## Purpose

Prepare an English, screen-led explanation for the Kyrgyz Republic National
Statistical Committee. The narrative follows the real survey-production
sequence first, then explains ease of use, internal help, updates, fault
response, and SaaS support.

## Source baseline

- Application repository: `cnucho/survey-workflow-orchestrator`
- Application branch: `codex/kg-mvp-internal-help`
- Application commit: `3bc7f25`
- Production repository: `cnucho/pr-studio`
- Production branch: `codex/kg-statistics-demo-production`
- Scenario: Household Living Conditions Survey 2026
- Data boundary: fictional aggregate demonstration data

## Screenshot funnel

The candidate set was captured from a new authenticated end-to-end workflow.
The process did not reuse the earlier project-hub scroll variants.

- Operator-workflow candidates: **38**
- Questionnaire-designer candidates: **15**
- Total screenshot candidates: **53**
- Selected screenshots: **21**
- Candidate-to-selection ratio: **2.52×**
- Application language: English
- Capture size: 1600×1000
- Credentials or tokens visible: no
- Respondent rows visible: no

The selected set now covers:

1. direct spreadsheet-style questionnaire input;
2. selected-question form editing;
3. a real ten-question household survey reopened from a saved project;
4. Survey Bank and supported import controls;
5. KG household modules, code lists, and rule templates;
6. response conditions and routing;
7. questionnaire flow-map review;
8. sign-in help;
9. project starting state and access;
10. governed questionnaire submission;
11. questionnaire approval receipt;
12. collection preparation;
13. synchronization receipt;
14. cleaning receipt;
15. analysis input and receipt;
16. independent verification receipt;
17. publication approval receipt;
18. immutable official release inventory;
19. ten-stage in-application guide.

## English briefing

The 20-slide briefing is organized for the audience rather than the software
architecture:

1. briefing purpose;
2. complete survey-stage coverage;
3. controlled project and access;
4. direct questionnaire input;
5. reopen a real existing household questionnaire;
6. Survey Bank and reusable modules;
7. response conditions and routing;
8. questionnaire flow review;
9. governed questionnaire submission;
10. independent questionnaire approval;
11. field preparation;
12. collection and synchronization;
13. cleaning review;
14. analysis;
15. independent verification;
16. publication governance;
17. official HTML/PDF/CSV/XLSX outputs;
18. in-application learning;
19. maintenance, updates, and SaaS support;
20. proposed pilot decision.

Generated review files:

- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-en.pptx`
- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-en.pdf`
- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-contact-sheet.png`
- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-pdf-contact-sheet.png`

## Video selection

Only actions that benefit materially from motion were recorded:

1. questionnaire authoring, Survey Bank, import, condition setting, and flow review;
2. questionnaire submission;
3. accepted field-batch synchronization;
4. analysis and report production;
5. independent verification;
6. publication export request;
7. immutable release generation.

The seven selected clips are real Playwright recordings of the questionnaire
designer and authenticated React operator application at 1920×1080.
Authentication occurred in a separate non-recorded context. The clips contain
no password entry, token display, raw respondent rows, role-switch simulation,
or sample release fallback.

The clips are short review selects. They are intentionally kept separate from
the briefing master so the final presentation can use only the approved moments
and add English narration at the correct visual pace.

## Confirmed questionnaire-import boundary

The current React designer visibly accepts saved project JSON and XLS/XLSX.
The wider repository also contains adapters and documentation for CSV, TSV,
QSF, and Markdown authoring inputs, but those formats are not all exposed by
the React designer's current file picker. The briefing therefore does not claim
that every documented adapter is available through this specific screen.

The demonstration import uses a real `question_input_project.v1` file containing
ten household-living-conditions questions, multilingual labels, choices,
validation, and employment-routing conditions. It does not use an empty dialog
or a fabricated success image.

## Verification

| Check | Result |
| --- | --- |
| Application production build | PASS |
| Authenticated 10-stage workflow capture | PASS |
| Screenshot candidates | 53 |
| Selected screenshots | 21 |
| Candidate ratio | 2.52× |
| English PPTX pages | 20 |
| PowerPoint overflow test | PASS |
| English PDF pages | 20 |
| PDF page render inspection | PASS |
| Selected video clips | 7 |
| Video dimensions | 1920×1080 |
| Video codec | VP8/WebM |
| Visible secrets/respondent rows | none |

## Next editing action

Use the briefing deck as the explanatory spine. Insert the six selected clips
only after their corresponding static explanation. Add calm English narration,
concise English subtitles, and separate Kyrgyz subtitles after the screen and
clip selection is approved. Do not expand the video into a feature inventory.
