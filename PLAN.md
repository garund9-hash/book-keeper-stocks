# PLAN.md — 주식 가계부 SPA

## Summary of Changes

React 18 + Recharts + Vite 기반의 주식 포트폴리오 관리 SPA를 단일 JSX 파일로 구현.
Gemini API 연동 AI 상담 기능 포함.

---

## Implementation Checklist

### 프로젝트 초기 설정
- [x] `package.json` 생성 (React 18, Recharts 2, Vite 5)
- [x] `vite.config.js` 생성 (`@vitejs/plugin-react`)
- [x] `index.html` 생성 (Vite HTML 엔트리)
- [x] `src/main.jsx` 생성 (ReactDOM 마운트)

### 핵심 구현 — `src/stock-ledger.jsx`
- [x] 상수 & 헬퍼: `SECTORS`, `SECTOR_COLORS`, `formatKRW()`, `genId()`
- [x] `SectorBadge` 컴포넌트 — 분야별 색상 pill 뱃지
- [x] `DeleteModal` 컴포넌트 — 삭제 확인 오버레이 모달
- [x] `PortfolioTab` 컴포넌트 — 분야 필터 + 종목 테이블
- [x] `AddStockTab` 컴포넌트 — 종목 추가/수정 폼
- [x] `ChartTab` 컴포넌트 — PieChart + BarChart + 요약 카드
- [x] `AIChatTab` 컴포넌트 — Gemini API 채팅 UI
- [x] `App` (default export) — 전체 상태 관리, 탭 라우팅

### 기능 구현
- [x] localStorage 동기화 (stocks, apiKey)
- [x] 분야 필터링 (포트폴리오 탭)
- [x] 종목 CRUD (추가/수정/삭제)
- [x] 예상 투자금 실시간 계산
- [x] PieChart 비중 시각화 (Recharts)
- [x] BarChart 총투자금 시각화 (Recharts)
- [x] Gemini AI 상담 (gemini-2.5-flash 모델)
- [x] API Key 토글 입력 UI (헤더 우측)

### 보완
- [x] Gemini 모델 ID 수정 (preview → 2.5-flash 안정 버전)

### 문서화
- [x] `PLAN.md` 작성
- [x] `README.md` 작성

---

## Potential Side Effects

| 항목 | 내용 |
|------|------|
| **API Key 노출** | Gemini API Key가 클라이언트 localStorage에 저장됨. CLAUDE.md 정책상 `.env.local` 관리가 원칙이나, 이 앱은 사용자 개인 키를 런타임에 입력받는 구조이므로 서버 없이 클라이언트에서만 사용됨. 배포 시 HTTPS 환경 필수. |
| **bundle 크기** | Recharts 포함으로 번들이 약 559KB (gzip 160KB). 필요 시 dynamic import로 분할 가능. |
| **localStorage 용량** | 종목 수가 매우 많아지면 localStorage 5MB 한도에 근접할 수 있음. |
| **CORS** | Gemini API는 브라우저 직접 호출을 허용하므로 별도 프록시 불필요. |
