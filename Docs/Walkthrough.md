# Refactoring Walkthrough

The monolithic `stock-ledger.jsx` file has been successfully refactored into a scalable and modular architecture based on the proposed design patterns. 

## Architectural Improvements

1. **Separation of Concerns:** Distinct directories logic were created (`api`, `components`, `hooks`, `repository`, `utils`).
2. **Domain Encapsulation:** Inline components and helper functions were extracted to make testing and feature addition easier.
3. **Repository Pattern:** `localStorage` dependencies are hidden within `StockRepository`.
4. **Facade Pattern:** Complex API integration with Gemini is isolated inside `GeminiService`.

## Security Remediation

1. **Mitigated Prompt Injection:** The Gemini API call in `geminiService.js` was refactored to use the `systemInstruction` field, strictly isolating the AI's base persona from user-provided inputs.
2. **Reduced API Key Exposure:** The application now uses `sessionStorage` instead of `localStorage` for storing the Gemini API Key. This ensures the credentials do not persist on the user's disk after the browser session completes.

## QA & Testing Improvements

1. **Test Infrastructure:** Added `vitest` to the project for fast, native modern JS testing. Hooked up an `npm run test` script in `package.json`.
2. **Testable Extractions:** Moved mathematical logic out of the `usePortfolio.js` hook into a pure JS `portfolioCalculations.js` util block so it can run fully headless without Mocking React logic.
3. **Unit Tests Created:**
   - `formatters.test.js`: Validates formatting KRW handling 0, negative numbers, undefined/null, or invalid strings successfully avoiding `NaN`.
   - `portfolioCalculations.test.js`: Validates empty portfolio logic, string coercions during UI data-entry, and correctness of percent aggregations and totals. 

All unit tests currently pass.

## Performance Optimizations

1. **Memoization:** Added `useMemo` to the `PortfolioTab` to prevent O(N) array filtering and recalculations on unused component renders. `ChartTab` pie data calculations were also memoized.
2. **Hook Stability:** Replaced all function initializations in `usePortfolio` with `useCallback` to prevent memory allocation leaks and unneeded downstream re-renders. 
3. **Debounced I/O:** The `localStorage.setItem` call inside `usePortfolio.js` has been debounced by 500ms to prevent synchronous blocking of the main thread when typing or rapidly modifying stock data.

## New Directory Structure

```text
src/
├── api/
│   └── geminiService.js     // Facade for AI logic
├── repository/
│   └── stockRepository.js   // Encapsulated data access
├── hooks/
│   └── usePortfolio.js      // Core business logic & state
├── components/
│   ├── ui/
│   │   ├── SectorBadge.jsx
│   │   ├── DeleteModal.jsx
│   │   └── Header.jsx       // Extracted layout component
│   ├── tabs/
│   │   ├── PortfolioTab.jsx // Refactored for Readability
│   │   ├── AddStockTab.jsx
│   │   ├── ChartTab.jsx     // Refactored for Readability
│   │   └── AIChatTab.jsx
│   └── App.jsx              // Main entry component
├── utils/
│   ├── constants.js         // Configuration, styling, and constants
│   └── formatters.js        // Helper functions
└── main.jsx                 // Application bootstrap
```

A production build (`npm run build`) was successfully executed to verify all import paths and React component syntax are correct.
