# Survey Workflow Orchestrator — English Usage Tutorial

## Format

This is a longer, task-oriented usage tutorial in two parts.

1. Menu tour: explain the workspace map before asking the viewer to work.
2. Guided workflow: create a survey, enter a question, save it, inspect flow and metadata, preview it, and prepare export.

Target length: 4–6 minutes. Language: English. Narration: OpenAI TTS using the approved existing environment key. The key value must never be stored.

## Part 1 — Menu tour

- Main workspace: Home, New survey, Projects, and language controls.
- Editor header: Open, Save, Main view, templates, JSON, XLSForm, collection package export, and command bar.
- Author: spreadsheet-style entry and question ordering.
- Flow: question order, conditions, branches, and routes.
- Metadata: variables, routes, validation rules, codebook, and analysis specifications.
- Review: respondent preview, validation issues, and question QA.
- Define: detailed question wording, choices, structure, validation, and routing.
- Bank: reusable template and library questions.
- Export: machine-readable handoff packages.

## Part 2 — Guided workflow

1. Start a new survey from Home.
2. Select the official Labor survey template.
3. Confirm the lifecycle stages and current next action.
4. Open the review workspace.
5. Define an employment-status question and coded choices.
6. Save and confirm the issue count improves.
7. Inspect the question in Flow and Metadata.
8. Preview the respondent-facing result in Review.
9. Finish at Export and explain the handoff options.

## Run

```powershell
npm run render:survey-workflow-tutorial
```

Output:

```text
out/survey-workflow-orchestrator-tutorial/survey-workflow-orchestrator-tutorial.mp4
out/survey-workflow-orchestrator-tutorial/render-report.json
out/survey-workflow-orchestrator-tutorial/sample-frame.png
```
