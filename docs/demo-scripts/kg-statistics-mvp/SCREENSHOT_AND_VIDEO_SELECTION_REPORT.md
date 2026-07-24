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

- Raw screenshot candidates: **38**
- Selected screenshots: **14**
- Candidate-to-selection ratio: **2.71×**
- Application language: English
- Capture size: 1600×1000
- Credentials or tokens visible: no
- Respondent rows visible: no

The selected set covers:

1. sign-in help;
2. project starting state;
3. project access;
4. questionnaire authoring;
5. questionnaire approval receipt;
6. collection preparation;
7. synchronization receipt;
8. cleaning receipt;
9. analysis input;
10. analysis receipt;
11. independent verification receipt;
12. publication approval receipt;
13. immutable official release inventory;
14. ten-stage in-application guide.

## English briefing

The 15-slide briefing is organized for the audience rather than the software
architecture:

1. briefing purpose;
2. complete survey-stage coverage;
3. controlled project and access;
4. questionnaire design;
5. independent questionnaire approval;
6. field preparation;
7. collection and synchronization;
8. cleaning review;
9. analysis;
10. independent verification;
11. publication governance;
12. official HTML/PDF/CSV/XLSX outputs;
13. in-application learning;
14. maintenance, updates, and SaaS support;
15. proposed pilot decision.

Generated review files:

- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-en.pptx`
- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-en.pdf`
- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-contact-sheet.png`
- `out/kg-statistics-mvp-demo/kg-statistics-nsc-briefing-pdf-contact-sheet.png`

## Video selection

Only actions that benefit materially from motion were recorded:

1. questionnaire submission;
2. accepted field-batch synchronization;
3. analysis and report production;
4. independent verification;
5. publication export request;
6. immutable release generation.

The six selected clips are real Playwright recordings of the authenticated
React operator application at 1920×1080. Authentication occurred in a separate
non-recorded context. The clips contain no password entry, token display, raw
respondent rows, role-switch simulation, or sample release fallback.

The clips are short review selects. They are intentionally kept separate from
the briefing master so the final presentation can use only the approved moments
and add English narration at the correct visual pace.

## Verification

| Check | Result |
| --- | --- |
| Application production build | PASS |
| Authenticated 10-stage workflow capture | PASS |
| Screenshot candidates | 38 |
| Selected screenshots | 14 |
| Candidate ratio | 2.71× |
| English PPTX pages | 15 |
| PowerPoint overflow test | PASS |
| English PDF pages | 15 |
| PDF page render inspection | PASS |
| Selected video clips | 6 |
| Video dimensions | 1920×1080 |
| Video codec | VP8/WebM |
| Visible secrets/respondent rows | none |

## Next editing action

Use the briefing deck as the explanatory spine. Insert the six selected clips
only after their corresponding static explanation. Add calm English narration,
concise English subtitles, and separate Kyrgyz subtitles after the screen and
clip selection is approved. Do not expand the video into a feature inventory.
