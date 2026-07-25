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
- Questionnaire-designer candidates: **13**
- Total screenshot candidates: **51**
- Selected screenshots: **20**
- Candidate-to-selection ratio: **2.55×**
- Application language: English
- Capture size: 1600×1000
- Credentials or tokens visible: no
- Respondent rows visible: no

The selected set now covers:

1. direct spreadsheet-style questionnaire input;
2. selected-question form editing;
3. existing-survey import and Survey Bank;
4. KG household modules, code lists, and rule templates;
5. response conditions and routing;
6. questionnaire flow-map review;
7. sign-in help;
8. project starting state and access;
9. governed questionnaire submission;
10. questionnaire approval receipt;
11. collection preparation;
12. synchronization receipt;
13. cleaning receipt;
14. analysis input and receipt;
15. independent verification receipt;
16. publication approval receipt;
17. immutable official release inventory;
18. ten-stage in-application guide.

## English briefing

The 19-slide briefing is organized for the audience rather than the software
architecture:

1. briefing purpose;
2. complete survey-stage coverage;
3. controlled project and access;
4. direct questionnaire input;
5. import, Survey Bank, and reusable modules;
6. response conditions and routing;
7. questionnaire flow review;
8. governed questionnaire submission;
9. independent questionnaire approval;
10. field preparation;
11. collection and synchronization;
12. cleaning review;
13. analysis;
14. independent verification;
15. publication governance;
16. official HTML/PDF/CSV/XLSX outputs;
17. in-application learning;
18. maintenance, updates, and SaaS support;
19. proposed pilot decision.

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
| Screenshot candidates | 51 |
| Selected screenshots | 20 |
| Candidate ratio | 2.55× |
| English PPTX pages | 19 |
| PowerPoint overflow test | PASS |
| English PDF pages | 19 |
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
