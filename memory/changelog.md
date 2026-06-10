# Changelog

- chore: refactor530 iskelesi kuruldu — TanStack Start + React 19 + Tailwind v4, Lovable bağımlılıkları çıkarıldı. Sebep: temiz/SOLID temel. package.json, vite/ts/eslint config
- feat: tasarım tokenları tek kaynağa taşındı. Sebep: DRY, modül-modül tasarım dili. src/ui/design-system/tokens.css + src/styles.css
- feat: app shell (router, __root, index, playground). Sebep: çalışan SSR temeli. src/router.tsx, src/routes/*
- chore: kalite kapıları — eslint-plugin-boundaries (katman zorlaması, warn), prettier, vitest. Sebep: mimari kuralla korunmalı. eslint.config.js
