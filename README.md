# Clock Logistics Client

A logistics management interface built with Vue 3 + Vite. The system displays inventory reports, forward-looking risks, and quick actions (Purchase Order / Override / Inventory), simulating procurement and inventory management scenarios.

## Current Features

- **Daily Dashboard**: Risk60d, critical items and Dead Stock, with business explanations and an actions drawer for each item.
- **Reorder Recommendations**: Recommendations table with "show only items with positive order recommendation" filter, days until ROP, Pack size / minimum order, suggested arrival date based on lead time, and inline actions.
- **Purchase Order Management**: View existing Purchase Orders and their statuses.
- **Item Actions Drawer**: Three forms (Purchase Order, Override, Inventory) with context-based default values, tab navigation, and Esc shortcut to close.
- **Data Integration**: Centralized API layer + TanStack Query for cache/loading/error management, and JSON validation using Zod.

## Architecture and Navigation

- **Router**: Main work screens: `/dashboard`, `/reorder`, `/purchase-orders` (redirect from `/` to default screen).
- **Folder Structure**: The logistics module under `src/logistics` is divided into `features`, `queries`, `mutations`, `domain`, `api`. General UI components under `src/shared`.

## Technology and Setup

- **Stack**: Vue 3 + TypeScript, Vite, Pinia, `@tanstack/vue-query`, Zod.

### Installation and Running

```sh
npm install
npm run dev    # Development server (hot reload)
npm run build  # Production build (includes type-check via vue-tsc)
```

## Planned Features

Based on the full user stories defined:

- **Sales Manager**: Focused inventory suggestions for store owners with budget limits (up to 15% of store budget), handling new stores via a "best sellers" list, and filtering duplicates to avoid suggesting items purchased in the last 30 days.
- **Marketing Manager**: Weekly report to identify brand gaps (gaps exceeding 30% compared to regional average) with automatic demographic reasoning and contact export capability for campaign management.
- **Logistics Manager**: Smart stockout prediction with seasonality factor and lead time consideration, dead stock alerts (40–60% decrease in sales rate), and at-risk product list.
- **Store Owner**: Personal area to view inventory suggestions, approve or reject and edit quantities; real-time dynamic cart calculation, mandatory rejection reason collection, and credit limit check blocking exceptional approvals.
