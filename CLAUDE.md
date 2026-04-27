# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fork of [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) v5.7.0 — a Vue 3 + TypeScript + Vite monorepo for building admin dashboards. It has been extended with a custom `smart-boot` application and modular architecture.

**Tech stack:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Ant Design Vue (via `antdv-next`), TailwindCSS v4, Turbo (monorepo orchestration), pnpm (package management).

## Essential Commands

### Development

```bash
# Install dependencies
pnpm install

# Start dev server (interactive selection)
pnpm dev

# Start smart-boot dev server directly
pnpm dev:smart-boot

# Start other apps
pnpm dev:antd       # Ant Design variant
pnpm dev:ele        # Element Plus variant
pnpm dev:naive      # Naive UI variant
pnpm dev:tdesign    # TDesign variant
```

### Build

```bash
# Build all apps
pnpm build

# Build only smart-boot
pnpm build:smart-boot

# Build with bundle analysis
pnpm build:analyze
```

### Lint & Type Check

```bash
# Run all checks (type, circular deps, dependency, cspell)
pnpm check

# Run type checking only
pnpm check:type

# Lint (with oxfmt + oxlint + eslint + stylelint)
pnpm lint

# Auto-format
pnpm format
```

### Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests (Playwright)
pnpm test:e2e
```

### Other

```bash
# Clean build artifacts and lockfile
pnpm clean

# Reinstall from scratch
pnpm reinstall
```

## Monorepo Structure

```
apps/                    # Application entry points
  web-smart-boot/        # Custom smart-boot app (primary target)
  web-antd/              # Ant Design Vue demo app
  web-ele/               # Element Plus demo app
  web-naive/             # Naive UI demo app
  web-tdesign/           # TDesign demo app
  web-antdv-next/        # Antdv-next variant
  backend-mock/          # Nitro-based mock server

smart-boot/              # Custom smart-boot modules and shared code
  smart-common/          # Shared utilities (api, utils, types)
  smart-components/      # Shared UI components (smart-table, etc.)
  smart-wujie/           # Micro-frontend integration (wujie)
  smart-modules/         # Feature modules (pluggable)
    smart-module-system/ # System management module
    smart-module-file/   # File management module
    smart-module-message/# Message module
    smart-module-auth-server-manager/
    smart-module-sso-server-manager/
    smart-module-code/   # Code generation module

packages/                # Core shared libraries
  @core/                 # Base UI toolkit (base, composables, ui-kit, preferences)
  effects/               # UI effects (access, hooks, layouts, request, plugins)
  constants/, locales/, styles/, types/, utils/, stores/, icons/

internal/                # Internal build tooling
  vite-config/           # Shared Vite configuration
  tsconfig/              # Shared TypeScript configs
  tailwind-config/       # Shared Tailwind theme
  lint-configs/          # Shared lint configs (eslint, oxlint, stylelint)
  node-utils/            # Node utilities

scripts/                 # Build and deploy scripts
  turbo-run/             # Turbo run wrapper
  vsh/                   # CLI tool for lint, check, etc.

docs/                    # VitePress documentation
playground/              # Component playground
```

## Key Architecture Patterns

### Application Bootstrap

Each app follows a multi-phase initialization in `apps/<app>/src/`:

1. `main.ts` → Entry point, registers directives, stores, i18n, router, plugins
2. `bootstrap.ts` → App bootstrap, calls adapter init, configures pinia/i18n/access
3. `preferences.ts` → Override default Vben preferences for the app
4. `router/` → Route definitions + navigation guards (`guard.ts`)

### Adapter Pattern

The `adapter/` directory in each app bridges Vben core components with specific UI libraries:

- `adapter/component/` → Component adapter (registers global components)
- `adapter/form.ts` → Form component adapter
- `adapter/vxe-table.ts` → VXETable adapter
- `adapter/smart-table.ts` → Smart table adapter

### Smart Modules

Custom modules in `smart-boot/smart-modules/` are auto-aliased via Vite config. Each module has:

- `src/api/` → API service layer
- `src/views/` → Page views
- `src/constants/` → Module constants
- `src/index.ts` → Module entry point

Modules are imported via `@smart-module/<name>` alias (auto-resolved in `vite.config.mts`).

### Micro-Frontend (Wujie)

The project supports micro-frontend architecture via `wujie-vue3`:

- `@smart/wujie` package handles main app setup and micro-app hosting
- Check `isMicroApp()` in `main.ts` for micro-app vs standalone mode

### Styling

- TailwindCSS v4 with utility-first approach
- Shared theme defined in `internal/tailwind-config/src/theme.css`
- Ant Design Vue theme overrides in `@vben/styles/antd`
- CSS variables for design tokens

### Linting & Formatting

- **oxfmt** for formatting (primary formatter)
- **oxlint** for fast linting
- **eslint** for comprehensive linting (flat config via `eslint.config.mjs`)
- **stylelint** for CSS/SCSS/Vue style linting
- **commitlint** for commit message validation (Angular convention)
- **lefthook** for pre-commit hooks (runs all linters on staged files)

## Environment Variables

Apps use `.env` files:

- `.env` — Base defaults
- `.env.development` — Dev overrides
- `.env.production` — Production overrides
- `.env.cloud` — Cloud deployment mode
- `.env.analyze` — Bundle analysis mode

Key variables: `VITE_APP_NAMESPACE`, `VITE_APP_VERSION`, `VITE_BASE`, `VITE_BASE_API_URL`, `VITE_ROUTER_HISTORY`.

## Commit Convention

Follows [Angular commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular):

```
<type>(<scope>): <subject>

feat: add new feature
fix: fix a bug
style: code style changes (no logic change)
perf: performance optimization
refactor: code refactoring
revert: revert a commit
test: test-related changes
docs: documentation updates
chore: dependency updates, config changes
ci: CI/CD changes
types: TypeScript type definition changes
```

## VS Code Configuration

The project ships `.vscode/settings.json` with:

- oxc (oxlint/oxfmt) as default formatter
- Auto-fix on save for eslint, oxc, stylelint
- TailwindCSS experimental config pointed to `internal/tailwind-config/src/theme.css`
- i18n-ally configured for translation support
