# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Japanese compound interest calculator PWA (複利計算機). It runs entirely in the browser — no build step, no package manager, no server. Open `compound-interest.html` directly in a browser or serve it with any static file server.

## Files

- `compound-interest.html` — the canonical app (self-contained: HTML + CSS + JS in one file)
- `compound-interest-1.html` through `compound-interest-6.html` — iteration snapshots; not served by the PWA
- `manifest.json` — PWA manifest (name, icons, theme color)
- `sw.js` — Service Worker: network-first for HTML, cache-first for JS/icons; cache key is `fukuri-v2`
- `icon.svg` — app icon

## Architecture

Everything lives in `compound-interest.html`. There is no framework or bundler.

**Slider logic:** Principal and monthly contribution use a piecewise log scale (`sliderToPrincipal`, `sliderToAdditional`) so the slider covers a wide range (¥10K–¥100M and ¥1K–¥500K respectively) with intuitive feel. Rate and years use a linear scale directly from the `<input type="range">` value.

**State:** Slider positions (not computed values) are persisted to `localStorage` under the key `fukuri`. On load, saved state is restored; if none exists, `DEFAULTS` are applied via `resetAll()`.

**Rendering:** `calculate()` runs on every slider change. It computes year-by-year balances, updates the summary cards, rebuilds the table rows, and destroys/recreates the Chart.js stacked bar chart.

**Chart.js** is loaded from CDN (`cdn.jsdelivr.net/npm/chart.js@4`) and also cached by the service worker. The chart is rendered into `<canvas id="chart">`.

## Service Worker cache

The SW cache is named `fukuri-v2`. To bust the cache after changes, increment this version string in `sw.js` and update the `ASSETS` array if new files are added.

## Running locally

```sh
python3 -m http.server 8080
# then open http://localhost:8080/compound-interest.html
```

Service Workers require a server (won't register on `file://`).
