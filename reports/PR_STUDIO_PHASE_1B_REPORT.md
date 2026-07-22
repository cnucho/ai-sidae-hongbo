# PR Studio Phase 1B Operational Evidence Report

## Final verdict

`PHASE_1_BLOCKED_SUPABASE_STAGING`

The starting status was `PHASE_1_FOUNDATION_VERIFIED_PHASE_1B_BLOCKED`. Code-level closure advanced materially, but the mandatory real staging run cannot begin because the Railway staging service does not contain Supabase client/server credentials. Creatomate is also not usable until its API key is present. No live gate is represented as complete.

## Identity

- Repository: `https://github.com/cnucho/pr-studio.git`
- Branch: `agent/phase1-video-production`
- Starting local and remote commit: `9937c2a63ddc039b6b4af61460e93abc88c3b5f4`
- Ending implementation commit: `ee42d75` (`Close Phase 1B code-level operational gates`)
- Draft PR: [#3](https://github.com/cnucho/pr-studio/pull/3)
- Starting stashes: none
- Preserved unrelated local file: `scripts/record-live-demo.mjs`

### Migration checksums before Phase 1B closure changes

| Migration | SHA-256 |
|---|---|
| `202607220001_video_agent_queue.sql` | `2BF46F30C4B5528A9A866C5918C4112B6CA818BD1F668C8C2661D71B2A036AB9` |
| `202607220002_video_production_phase1.sql` | `D4041655C3DA2B07ADE3278B8D286C6034BA34924E6DD4B4510D1689751B1BCF` |
| `202607220003_phase1b_closure.sql` | `596E7E1FC5E87D802B385CB631C386B44962E6BF7E447626716090CF84DC39A7` |

The third migration is new in this closure and has not been applied to staging.

## Environment

- Supabase staging project: `pr-studio-staging`, project reference ending `...adgzj`, Sydney region
- Creatomate staging template: ID ending `...07d21`; dynamic fields observed: `Video.source`, `Text-1.text`, `Text-2.text`
- Railway project: `pr-studio`
- Railway environment: `staging` (`5546a096-fd0a-4997-bec9-a1174df6f506`)
- Railway service: `pr-studio-staging` (`40caf20a-50bf-463b-ad05-cab69af271ca`)
- Callback base URL: `https://pr-studio-staging-staging.up.railway.app`
- Staging deployment: stopped; no credential-incomplete deployment was promoted

### Required variable presence

| Variable | Status |
|---|---|
| `SUPABASE_URL` | PRESENT |
| `SUPABASE_ANON_KEY` | MISSING |
| `SUPABASE_SECRET_KEY` | MISSING |
| `SUPABASE_SERVICE_ROLE_KEY` | MISSING |
| `CREATOMATE_API_KEY` | MISSING |
| `CREATOMATE_TEMPLATE_ID` | PRESENT |
| `CREATOMATE_WEBHOOK_SECRET` | PRESENT; generated and stored in Railway |
| `WEBHOOK_BASE_URL` | PRESENT |

No secret value was printed, committed, or returned by an API.

## Implemented code closure

### Authentication and ownership

- Added Supabase bearer-token authentication using the publishable/anonymous key.
- Added server-only repository operations using `SUPABASE_SECRET_KEY` or the legacy service-role fallback.
- Project reads and writes require an authenticated owner.
- Render submission, status, attempts, validation, review, and download resolve ownership server-side.
- UUID or Storage-path knowledge does not grant access.
- Added minimal authenticated APIs for project, revision, render, attempts, validation, review, and private download operations.

### RLS model

Model A is selected: **service-role-only trusted operator boundary**.

- Browsers do not query production video tables directly.
- All supported operations pass through authenticated server routes.
- Ordinary `anon` and `authenticated` table privileges remain revoked.
- No broad permissive RLS policies were added.
- Server secret credentials remain confined to server modules.

### Database integrity

The new closure migration adds:

- required project ownership;
- explicit project/render lifecycle constraints;
- progress and nonnegative-cost constraints;
- immutable revision update/delete triggers;
- append-only approval-history update/delete triggers;
- one-decision-per-render uniqueness;
- owner, attempt, and validation indexes; and
- enforced private output bucket status.

These statements passed static regression checks but were **not applied to staging** because database credentials are missing. Therefore `MIGRATION_APPLY_FROM_EMPTY`, foreign-key execution, queue claims, stale-lock recovery, and database-backed immutability remain unverified.

### Rendering and provider adapter

- Creatomate requires a nonempty template ID before submission.
- Documented provider states are mapped deterministically.
- Missing IDs and unknown states are rejected.
- Webhook processing stores an initially unprocessed event, updates a known matching render first, and marks the event processed afterward.
- Duplicate payload hashes return duplicate success without reprocessing.
- Unknown provider jobs return a conflict rather than false success.
- Callback terminology: **secret-protected callback with authoritative provider API re-query**.

No provider job was created because `CREATOMATE_API_KEY` is missing. Provider states, output, cost, usage, callback delivery, replay, failure, and timeout evidence remain blocked.

### FFprobe validation

- Added machine-readable normalization for file size, container, video/audio codecs, stream counts, dimensions, frame rate, duration, decodability, SHA-256 checksum, timestamp, validator version, individual checks, and overall result.
- Added timeout and malformed-output errors to the real FFprobe runner.
- Tests cover valid evidence, missing audio, wrong dimensions, corrupt/no-video media, and duration outside tolerance.

No real cloud or canonical durable local output was persisted, so the real-output gate remains open.

### Retry, fallback, and approval

- Added bounded exponential retry delay: 15 seconds doubling to a 300-second cap.
- Only `transient_provider` failures are retryable.
- Local fallback is allowed only after transient cloud attempts are exhausted.
- Fallback is prohibited for provider authentication, invalid project, missing template, asset license, output validation, uncertain completion, and local failure categories.
- Only `awaiting_approval` renders may be approved or rejected.
- Rejection requires a reason.
- Approval requires a passing persisted validation result.
- Approval history stores actor, render, project, revision, decision, reason, and timestamp and is database-constrained append-only.

These policies are unit verified. Durable retry/fallback and approval evidence remains blocked on staging execution.

### Private media

- Storage paths must match the authorized project and render IDs and may not contain traversal.
- Download filenames are sanitized.
- Authenticated owner resolution occurs before Storage download.
- Responses use private no-store caching, actual byte length, and media MIME type.

Real owner/cross-user/unauthenticated Storage delivery remains blocked on staging authentication and persistence.

## Automated verification

| Category | Exact automated count | Result |
|---|---:|---|
| Domain schema | 4 | PASS |
| Migration static checks | 2 | PASS |
| Persistence integration | 0 | BLOCKED on staging |
| Queue integration | 0 | BLOCKED on staging |
| Authorization policy | 7 | PASS |
| Renderer adapter | 5 | PASS |
| Orchestration lifecycle | 3 | PASS |
| Webhook integration | 0 | BLOCKED on provider/staging |
| FFprobe validation | 5 | PASS |
| Metadata validation regression | 3 | PASS |
| Retry | 4 | PASS |
| Fallback | 9 | PASS |
| Approval | 3 | PASS |
| Media delivery policy | 4 | PASS |
| **Total** | **49** | **PASS** |

Commands:

```text
npm test
Result: 2 test files passed; 49 tests passed

npm run lint
Result: passed

npm run build
Result: passed; production compilation and TypeScript validation completed; 15 application routes emitted

npm audit --json
Result: 5 findings; 1 moderate, 4 high, 0 critical
```

## Dependency audit

| Package | Path and scope | Severity | Runtime relevance | Fixed version | Major change required | Recommendation |
|---|---|---|---|---|---|---|
| `brace-expansion` | ESLint/minimatch; development | High | Not production-runtime reachable | `1.1.16` and `5.0.7` for affected ranges | No framework major | Upgrade through compatible lint dependency refresh; do not force globally across majors |
| `js-yaml` | ESLint configuration; development | High | Not production-runtime reachable | `4.3.0` | No | Upgrade when ESLint accepts the fixed release |
| `postcss` | Nested under Next.js | Moderate | Build/style processing; not directly invoked by application input | `8.5.10` | Audit currently proposes an unsuitable Next downgrade | Track a supported Next patch containing fixed nested PostCSS |
| `sharp` | Optional Next.js image pipeline; production dependency | High | Potentially reachable if Next image optimization processes untrusted images | `0.35.0` | Supported Next release required | Avoid untrusted remote image processing and upgrade with a supported Next release |
| `next` | Direct production framework; aggregate of nested PostCSS/Sharp advisories | High | Production framework | No suitable fix identified by current audit | Audit proposes unsuitable `9.3.3` downgrade | Do not force; test and adopt an official supported patched Next release |

No forced major downgrade or unsafe automatic audit fix was run.

## Operational gate status

| Gate | Status | Reason |
|---|---|---|
| A — Staging database | BLOCKED | Supabase server credentials missing from Railway staging |
| B — Revision immutability | CODE READY; BLOCKED LIVE | Migration not applied; no real revisions persisted |
| C — Access control | CODE READY; BLOCKED LIVE | Publishable and secret keys missing; users A/B not created |
| D — Real Creatomate lifecycle | BLOCKED | Creatomate API key missing |
| E — Live webhook lifecycle | CODE READY; BLOCKED LIVE | No provider job or deployed callback |
| F — Real output validation | CODE READY; BLOCKED LIVE | No real cloud/canonical local outputs persisted |
| G — Local renderer | INCOMPLETE LIVE | Existing in-memory adapter is not durable evidence |
| H — Retry and fallback | POLICY VERIFIED; BLOCKED LIVE | No durable attempts or forced staging failures |
| I — Approval | CODE READY; BLOCKED LIVE | No awaiting-approval render in staging |
| J — Private media | CODE READY; BLOCKED LIVE | No authenticated users or stored output |
| K — Build and regression | PASS | 49 tests, lint, and production build pass |

## Remaining limitations

- The current Creatomate Quick Promo template exposes one video field and two text fields; it has not yet evidenced the required two-scene, narration/audio, and transition test project.
- The local renderer adapter still uses process memory for status and lacks durable cancellation/restart recovery.
- Range requests for private media are not implemented; the current preview path downloads the complete object.
- No staging migrations, real provider render, real callback, real FFprobe persistence, or two-user authorization run was possible.
- Provider actual cost remains unavailable.
- Operator UI remains minimal; the closure APIs exist but a general timeline editor is intentionally out of scope.
- ElevenLabs remains unimplemented.
- YouTube OAuth and publishing remain disabled and were not expanded.
- Five dependency audit findings remain documented; no unsafe forced remediation was applied.

## Git evidence

- Only reviewed Phase 1B files are intended for staging and commit.
- `scripts/record-live-demo.mjs` remains modified, unstaged, and excluded.
- Existing stashes remain preserved; none existed at baseline.
- No credential, generated audio, generated video, or provider output is included.
- Final commit, push result, remote HEAD, and clean scoped diff are reported in the task handoff after Git operations complete.
