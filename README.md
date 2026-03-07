# 주식 가계부

React 18 + Recharts 기반 주식 포트폴리오 관리 SPA.
Gemini AI 상담 기능 내장.

---

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

---

## 기능

### 포트폴리오 탭
- 11개 분야 필터 버튼으로 종목 필터링
- 종목 테이블: 분야 | 종목명 | 매수일 | 단가 | 수량 | 총투자금 | 메모
- 수정 / 삭제 (삭제 확인 모달)

### 종목 추가/수정 탭
- 분야, 종목명, 매수일, 단가, 수량, 메모 입력
- 예상 투자금 실시간 계산

### 차트 탭
- 분야별 비중 PieChart
- 분야별 총투자금 BarChart
- 분야별 요약 카드 (종목 수, 총투자금, 비중%)

### AI 상담 탭
- 현재 포트폴리오 기반 Gemini AI 투자 조언
- Enter 전송 / Shift+Enter 줄바꿈

---

## Gemini API Key 설정

헤더 우측 **🔑 API Key** 버튼 클릭 → API Key 입력 → 저장.
키는 브라우저 sessionStorage에만 보관되며 창을 닫으면 초기화됩니다. 외부로 전송되지 않습니다.

Gemini API Key 발급: https://aistudio.google.com/app/apikey

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| React | 18 |
| Recharts | 2 |
| Vite | 5 |
| Gemini 모델 | gemini-2.5-flash |

---

## 프로젝트 구조

```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── stock-ledger.jsx   # 전체 구현 (컴포넌트 + 앱 로직)
```
