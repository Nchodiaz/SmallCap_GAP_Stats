# Small-Cap Gap Statistics Dashboard

A React and TypeScript analytics prototype for exploring how a stock behaves after positive or negative opening gaps.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-data%20visualization-22b5bf)

## Analytical question

Given a ticker and a minimum gap threshold, what usually happens next: continuation, fade, a new high, or a red close?

## What the dashboard calculates

- positive and negative opening-gap filters;
- average, highest and lowest qualifying gap;
- pre-market and regular-session volume summaries;
- high-of-day, low-of-day and pre-market timing distributions;
- high/low excursions, ranges and close behavior;
- interactive price and statistical views for the selected ticker.

## Data behavior

The prototype attempts to load market history through the Yahoo Finance adapter. If that request is unavailable in the browser, it falls back to clearly identifiable generated data so the interface remains testable. Results based on fallback data are demonstrations, not investment evidence.

## Run locally

```bash
npm ci
npm run dev
```

Build the production bundle with:

```bash
npm run build
```

## Stack

- React, TypeScript and Vite;
- Recharts for visualization;
- Tailwind CSS and Radix UI for the interface;
- modular data adapters with a deterministic fallback dataset.

## Current limitations

- This is an exploratory front-end prototype, not a trading system.
- Browser access to third-party market-data endpoints may be restricted by CORS or rate limits.
- The data layer does not yet persist a reproducible research snapshot.
- Export and settings controls are interface placeholders.
- Statistical outputs are descriptive and do not account for multiple testing or transaction costs.

## Next analytical steps

- replace the browser adapter with a small server-side ingestion service;
- persist raw observations and calculation metadata;
- add sample size and confidence intervals to every result;
- add unit tests for gap classification and statistic calculations;
- separate real and demonstration data visually in every chart.

> Educational project only. Nothing in this repository is financial advice.
