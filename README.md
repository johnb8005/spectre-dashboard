# SPECTRE // Geo-Intelligence Dashboard

[![Deploy to GitHub Pages](https://github.com/johnb8005/spectre-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/johnb8005/spectre-dashboard/actions/workflows/deploy.yml)

A James Bond-inspired geo-intelligence command & control dashboard. Frontend-only, built with React, Tailwind CSS, and shadcn/ui.

**[Live Demo](https://johnb8005.github.io/spectre-dashboard/)**

## Features

- Interactive world map with real country boundaries (react-simple-maps)
- Zoomable/pannable map with animated satellite tracks and data streams
- Field agent tracking with real-time status (active, compromised, extraction, dark, standby)
- Mission zone overlays - click a mission to project its operational zone onto the map with intel markers
- Agent dossier panel with vitals, cover identity, and action buttons
- Live threat feed with severity levels and geolocation
- Active missions briefing with classification levels
- Crypto terminal with simulated encrypted comms
- Proximity radar widget
- Satellite pass scheduling
- CRT scanline effects and animated UI throughout

## Tech Stack

- **React** + TypeScript
- **Tailwind CSS** v4 + shadcn/ui primitives
- **Vite** (bundler)
- **Bun** (runtime & package manager)
- **react-simple-maps** (world map)
- **Lucide React** (icons)

## Getting Started

```bash
bun install
bun dev
```

## Build

```bash
bun run build
```
