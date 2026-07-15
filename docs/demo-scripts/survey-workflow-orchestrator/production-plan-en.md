# Survey Workflow Orchestrator — English Product Demo

## Production decision

- Target app: Survey Workflow Orchestrator
- Live URL: `https://survey-workflow-orchestrator-production.up.railway.app/`
- Audience: survey managers, questionnaire designers, and review teams
- Language: English
- Format: product demo with tutorial-level clarity
- Target length: about 75–90 seconds
- Narration provider: reuse the existing `OPENAI_API_KEY` through OpenAI TTS
- Credential rule: record only the provider decision; never write the key value to this repo or generated reports

## Product promise

Turn a multi-stage survey lifecycle into a visible, guided workflow—from an official template to questionnaire review and downstream fieldwork stages.

## Must-show workflow

1. Open the English-first workspace.
2. Start a new survey.
3. Choose an official survey template.
4. Confirm the generated project and its six-stage progress map.
5. Open the review workspace.
6. Show the real Survey Input Editor and its authoring, flow, metadata, review, and export tools.

## Production rules

- Capture the real Railway app, not mock screens.
- Show one meaningful action per beat.
- Keep subtitles shorter than narration.
- Pause on the progress map and the authoring workspace so viewers can scan them.
- Use cursor movement and a click ripple for actions.
- Keep credentials and generated media outside Git.
- Verify the rendered MP4 with `ffprobe`, sample frames, and a render report.

## Cue sheet

| Beat | Screen | Action or focus | Narration purpose | Subtitle | Density |
| --- | --- | --- | --- | --- | --- |
| 01 | Opening title | Product promise | Frame the workflow problem | One guided survey workflow | low |
| 02 | Home | Start a new survey | Show English-first entry point | Start from one clear next action | medium |
| 03 | Templates | Choose Labor survey | Show reuse of official standards | Begin with an official template | medium |
| 04 | Project | Progress and next action | Show lifecycle visibility | Every stage stays visible | high |
| 05 | Review transition | Open review workspace | Move from management to authoring | Open the real review workspace | medium |
| 06 | Survey Input Editor | Authoring and QA tools | Show the operational workspace | Author, validate, review, and export | high |

## Run

```powershell
npm run render:survey-workflow-demo
```

Outputs are written to the ignored folder:

```text
out/survey-workflow-orchestrator-demo/survey-workflow-orchestrator-demo.mp4
out/survey-workflow-orchestrator-demo/render-report.json
out/survey-workflow-orchestrator-demo/sample-frame.png
```
