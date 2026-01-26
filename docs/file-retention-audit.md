# File Retention Audit

이 문서는 Personal Knowledge Vault MVP 기능(웹 UI, API, 파일 기반 저장, i18n 메시지)을 기준으로 유지/삭제 필요 여부를 판단한 목록입니다. 실제 삭제는 포함하지 않았고, 필요 시 이 경로를 참고해 복구/재검토할 수 있습니다.

## Keep (core: 기능 구현에 직접 필요)

- turbo.json
- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml
- tsconfig.json
- README.md
- docs/pkv-diagrams.md
- docs/pkv-sequence-diagrams.md
- apps/web/package.json
- apps/web/tsconfig.json
- apps/web/next.config.js
- apps/web/app/layout.tsx
- apps/web/app/page.tsx
- apps/web/app/page.module.css
- apps/web/app/globals.css
- apps/web/app/i18n.ts
- apps/web/app/actions.ts
- apps/web/app/components/language-select.tsx
- apps/web/app/fonts/GeistVF.woff
- apps/web/app/fonts/GeistMonoVF.woff
- apps/web/app/favicon.ico
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/tsconfig.build.json
- apps/api/nest-cli.json
- apps/api/eslint.config.mjs
- apps/api/src/main.ts
- apps/api/src/app.module.ts
- apps/api/src/app.controller.ts
- apps/api/src/app.service.ts
- apps/api/src/i18n.ts
- apps/api/src/common/interceptors/response-envelope.interceptor.ts
- apps/api/src/common/filters/http-exception.filter.ts
- apps/api/src/common/middleware/request-id.middleware.ts
- apps/api/src/links/links.module.ts
- apps/api/src/links/links.controller.ts
- apps/api/src/links/links.service.ts
- apps/api/src/links/dto/create-link.dto.ts
- apps/api/src/links/dto/update-link.dto.ts
- apps/api/src/links/entities/link.entity.ts
- apps/api/src/types/express.d.ts
- packages/api/package.json
- packages/api/tsconfig.json
- packages/api/eslint.config.mjs
- packages/api/src/entry.ts
- packages/messages/package.json
- packages/messages/tsconfig.json
- packages/messages/src/index.ts
- packages/messages/src/messages.json
- packages/messages/src/messages.md
- packages/ui/package.json
- packages/ui/tsconfig.json
- packages/ui/eslint.config.mjs
- packages/ui/src/button.tsx
- packages/ui/src/card.tsx
- packages/ui/src/code.tsx
- packages/eslint-config/package.json
- packages/eslint-config/README.md
- packages/eslint-config/base.js
- packages/eslint-config/next.js
- packages/eslint-config/nest.js
- packages/eslint-config/library.js
- packages/eslint-config/react-internal.js
- packages/eslint-config/prettier-base.js
- packages/typescript-config/package.json
- packages/typescript-config/base.json
- packages/typescript-config/nextjs.json
- packages/typescript-config/nestjs.json
- packages/typescript-config/react-library.json
- packages/jest-config/package.json
- packages/jest-config/tsconfig.json
- packages/jest-config/src/entry.ts
- packages/jest-config/src/base.ts
- packages/jest-config/src/nest.ts
- packages/jest-config/src/next.ts

## Optional (템플릿/브랜딩 자산, 기능과 직접 연관 없음)

- apps/web/public/next.svg (UI 재디자인 시 교체 가능)
- apps/web/public/turborepo-dark.svg (UI 재디자인 시 교체 가능)
- apps/web/public/turborepo-light.svg (UI 재디자인 시 교체 가능)
- apps/web/public/vercel.svg (UI 재디자인 시 교체 가능)
- apps/web/public/globe.svg (UI 재디자인 시 교체 가능)
- apps/web/public/window.svg (UI 재디자인 시 교체 가능)
- apps/web/public/file-text.svg (UI 재디자인 시 교체 가능)

## Review / Delete Candidates (비핵심 문서/테스트/임시 파일)

- docs/pkv-architecture-prompt.md (프롬프트 보관용. 필요 시 재생성 가능)
- apps/api/README.md (예시 문서 수준이면 제거 가능)
- apps/web/README.md (예시 문서 수준이면 제거 가능)
- apps/api/test/app.e2e-spec.ts (E2E 테스트 사용하지 않으면 제거 후보)
- apps/api/test/jest-e2e.json (E2E 테스트 사용하지 않으면 제거 후보)
- apps/api/src/app.controller.spec.ts (유닛 테스트 미사용 시 제거 후보)
- apps/api/src/links/links.controller.spec.ts (유닛 테스트 미사용 시 제거 후보)
- apps/api/src/links/links.service.spec.ts (유닛 테스트 미사용 시 제거 후보)
- _tmp_7017_a2f70195dc0ad956ee90a804d9403093 (임시 파일)
- _tmp_6309_f7005763f38133a5a2ea236ce7740524 (임시 파일)

## Notes

- 위 목록은 토큰 절약용 경량화를 염두에 둔 분류입니다. 실제 삭제 전에는 필요도를 다시 확인하세요.
- 테스트 파일은 CI/품질 기준에 따라 Keep으로 전환될 수 있습니다.
