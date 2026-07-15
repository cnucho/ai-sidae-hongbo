# National Survey Workflow Stage Tutorial Series

## Evidence rule

Every screen and output shown in this series must come from the running application.
PR Studio may record, narrate, subtitle, highlight, and chapter the footage, but it
must not manufacture survey artifacts or substitute hand-written result screens.
If an app action fails, production stops until the application is fixed and the
same action passes its browser regression check.

## Episodes

| Episode | Scope | Target duration |
| --- | --- | --- |
| 00 | End-to-end system overview | 5-10 minutes |
| 01 | Questionnaire authoring and questionnaire quality | 5-10 minutes |
| 02 | Collection package, field assignment, and deployment | 5-10 minutes |
| 03 | Response intake, internal validation, and cleaning | 5-10 minutes |
| 04 | Metadata, aggregation tables, and analysis | 5-10 minutes |
| 05 | Independent verification, reporting, publication, and monitoring | 5-10 minutes |

## Application-owned stage artifacts

The recording follows the project worker rail. The app, not the video renderer,
must attach these artifacts to the stage receipts:

- Questionnaire: `questionnaire_draft_package.v1`, question library and rule packages
- Deployment: `survey_runtime_package.v1`, `quality_review_receipt.v1`
- Response intake: `offline_response_batch.v1`, `raw_response_dataset.v1`, `response_sync_receipt.v1`
- Internal validation: `cleaning_receipt.v1`, `cleaned_dataset.v1`, `metadata_output_package.v1`
- Aggregation: `analysis_task_package.v1`, `table_chart_dsl_package.v1`, `python_verification_receipt.v1`
- Reporting and publication: `interpretation_receipt.v1`, `report_package.v1`, `monitor_panel_manifest.v1`

## Reusable production commands

```powershell
npm run capture:national-survey-stages
npm run render:national-survey-series
```

Capture writes application screenshots and an observed-state manifest under
`out/national-survey-stage-series/capture/`. Rendering refuses to start unless
the observed run reaches `Published` without browser errors. Generated evidence,
audio, clips, and final videos remain ignored by Git.

The capture uses a new isolated database on every run. It waits for the visible
next action to change after each real worker operation, and reopens Official Output
after confirmation to prove that the current project artifacts are loaded from the
platform API.
