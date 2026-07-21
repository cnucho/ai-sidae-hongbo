# PR Studio Phase 1 작업보고서

## 작업 정보

- 작업일: 2026-07-22
- 저장소: `cnucho/pr-studio`
- 기준 커밋: `1aa21dae72d65c6f6749757f38c76dd657f96c17`
- 목적: 기존 영상 제작 흐름을 보존하면서 Supabase 기반 작업 큐와 버전형 영상 제작 도메인, Creatomate 클라우드 렌더링 기반을 추가한다.

## 구현 내용

### Supabase 영상 작업 큐

- 파일시스템 작업 큐를 Supabase Postgres 기반 영속 큐로 전환했다.
- `FOR UPDATE SKIP LOCKED` 기반 원자적 작업 선점, 다중 worker, 재시도, 지수 백오프, 중단 작업 재선점을 지원한다.
- 완성 영상은 비공개 Supabase Storage 버킷에 저장하고 서버 API를 통해 내려받는다.
- 작업 ID와 서버 전용 Supabase secret key를 안전하게 처리한다.

### 버전형 영상 제작 모델

- Zod 런타임 검증을 사용하는 `VideoProject` 스키마 버전 1을 추가했다.
- 프로젝트 신원, 영상 규격, 장면 타임라인, 내레이션, 캡션, 브랜드, 자산 출처와 라이선스, 썸네일, 향후 YouTube 메타데이터를 표현한다.
- 장면 순서와 겹침을 검증하고 지원하지 않는 미래 스키마 버전을 거부한다.
- 승인된 산출물의 재현성을 위해 프로젝트 revision 중심의 Supabase 테이블을 추가했다.

### 렌더링 및 검증 기반

- provider-neutral renderer 계약을 추가했다.
- Creatomate 요청 변환, 생성·조회·상태 정규화 및 비용 추정 기반을 구현했다.
- 기존 로컬 FFmpeg 렌더러를 같은 인터페이스로 감쌌다.
- provider-neutral narration 계약을 추가해 Google TTS를 유지하고 향후 ElevenLabs를 연결할 수 있게 했다.
- 크기, 해상도, 길이, 오디오, 디코딩 여부에 대한 기계 판독형 출력 검증을 추가했다.

### Webhook 보안

- Creatomate webhook endpoint에 서버 비밀값 검증, raw payload 해시 기반 중복 방지, payload 검사와 감사 저장을 추가했다.
- Creatomate가 별도의 서명 헤더를 문서화하지 않으므로 callback payload만 신뢰하지 않고 Creatomate API에서 provider job을 다시 조회해 상태를 확인한다.
- 브라우저에는 Creatomate나 Supabase 관리 키를 노출하지 않는다.

### 배포 및 기존 기능

- Railway용 Dockerfile, Chromium/FFmpeg 호환성, 영상 worker 실행 명령을 추가했다.
- 기존 영상 생성과 premium academy demo renderer를 보존했다.
- 환경변수 예제를 추가했으며 YouTube 자동 게시 기능은 비활성 상태로 남겼다.

## 데이터베이스 마이그레이션

- `202607220001_video_agent_queue.sql`: 영상 작업 큐와 비공개 Storage 버킷
- `202607220002_video_production_phase1.sql`: 프로젝트, revision, 자산, 내레이션, render, attempt, 사용량·비용, webhook, 검증, 승인, 향후 게시 기록

실제 운영 Supabase 적용은 수행하지 않았다. 배포 전 staging 프로젝트에서 두 migration을 순서대로 적용하고 검증해야 한다.

## 검증 결과

- `npm test`: 9개 테스트 통과
- `npm run lint`: 통과
- TypeScript 검사: Next.js production build 과정에서 통과
- `npm run build`: 통과
- worker 구문 검사: 통과
- Git conflict/whitespace 검사: 통과

테스트 범위는 VideoProject 유효/미래버전/장면겹침/라이선스 기본값, Creatomate mapping과 상태 정규화, 정상·오디오누락·해상도오류·0 byte 출력 검증을 포함한다.

## 미완료 및 운영 전 필수 사항

- 프로젝트/revision CRUD API와 최소 운영 UI
- render 상태 전이 및 승인 API의 완전한 orchestration
- 실제 FFprobe 기반 독립 산출물 검사 연결
- Supabase 격리 환경 migration 및 persistence 통합 테스트
- 실제 Creatomate credential을 사용한 cloud render와 webhook end-to-end 검증
- local fallback lifecycle, retry, approval history에 대한 확대 테스트
- ElevenLabs 실제 연동
- YouTube OAuth와 게시 기능(Phase 1에서 명시적으로 제외)

따라서 이번 변경은 Phase 1의 기반 구현이며, 첨부 요구사항 전체가 운영 완료된 것으로 선언하지 않는다.

## 보안 및 백업

- 실제 credential을 저장소에 추가하지 않았다.
- 생성 영상과 음성은 ignore 대상이며 커밋하지 않는다.
- 원본 미커밋 작업은 로컬 Git stash `codex-reconcile-local-video-worker-2026-07-22`로 복구 가능하다.
- 소스와 보고서는 GitHub branch와 draft PR에 백업되므로 별도 Dropbox 복제는 필요하지 않다고 판단했다.
