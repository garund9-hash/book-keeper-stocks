# Architecture Decision Records (ADR)

## ADR 1: Layered Architecture and Modularization
**Status:** Accepted

**Context:** The application originated as a monolithic single-file React component (`stock-ledger.jsx`). This led to mixed concerns (UI, business logic, data persistence, network requests) all in one place, making the app difficult to test, maintain, and scale.

**Decision:** We adopted a Layered Architecture separating concerns into `components` (UI), `hooks` (business logic), `api` (external integrations), and `repository` (data persistence). We also extracted specific UI tabs into their own files.

**Consequences:**
* **Easier Testing:** Business logic and external API integrations can be unit tested in isolation.
* **Better Readability:** Component files are smaller and focus strictly on rendering UI.
* **Increased Complexity:** More files to navigate and manage.

## ADR 2: Hooks for Business Logic and State Management (usePortfolio)
**Status:** Accepted

**Context:** Form handling, calculations, and local storage synchronization were tightly coupled with the React view layer, violating the Single Responsibility Principle.

**Decision:** We extracted the state and core business logic (e.g., adding/updating stocks, memoized calculations, debounced saving) into a custom hook `usePortfolio`.

**Consequences:**
* View layers only care about presentation and calling actions.
* Business logic can be reused across different views or components.

## ADR 3: In-Browser Storage Security Patch
**Status:** Accepted

**Context:** The Gemini API Key was being persisted in `localStorage`, which exposed the key indefinitely across browser sessions, resulting in a potential security vulnerability (XSS to extraction).

**Decision:** We migrated the API key storage to `sessionStorage`.

**Consequences:**
* **Increased Security:** Keys are cleared when the browser tab closes.
* **Minor UX Friction:** Users need to re-enter the API key if they close the tab and return later.
