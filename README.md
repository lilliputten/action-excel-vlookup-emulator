<!--
 @since 2025.07.08, 14:43
 @changed 2025.07.15, 14:44
-->

# Excel VLOOKUP Function Trainer Application

[The VLOOKUP trainer applicaiton](https://action-excel-vlookup-emulator.vercel.app/?en) is implemented via React, Vite, TS, and Tailwind, and deployed to Vercel. Developed for Russian company [Action Academy](https://academy.action-mcfr.ru/) (it supports both English and Russian localizations).

The goal is to help to understand a Vertical Lookup or VLOOKUP ("вертикальный просмотр", ВПР, in Russian) function in Miscrosoft Excel.

![Application banner](public/opengraph-image.jpg "Application banner")

The application is a step-by-step simulator for practicing actions for comparing and searching for missing values in different columns of Excel tables.

## Build info (auto-generated)

- Project info: v.0.0.5 / 2025.07.15 00:06:35 +0300

## Resources

- Vercel deployed app: https://action-excel-vlookup-emulator.vercel.app/?en
- Repository: https://github.com/lilliputten/action-excel-vlookup-emulator/

## Workspace

Core resources:

- Client entry point (react app): [src/main.tsx](src/main.tsx).
- Client template: [index.html](index.html).
- Client-side core component: [src/components/ExcelEmulator/ExcelEmulatorScreen.tsx](src/components/ExcelEmulator/ExcelEmulatorScreen.tsx).
- "Excel table" root component: [src/components/ExcelEmulator/Table.tsx](src/components/ExcelEmulator/Table.tsx).

## Installation

Just run `pnpm install --frozen-lockfile` to install all the dependencies.

Set up local [environent variables](#environent-variables) (not required).

## Environent variables

The application environent variables could be provided by the environment (from github actions or vercel environment setup) or be set in the local `.env` file (see a template in [.env.SAMPLE](.env.SAMPLE));

- `VITE_NO_STRICT_MODE`: Disable react strict mode (causes double hooks' invocations).
- `VITE_FIREWORKS_DEBRIS_NUM`:  Set "congrulation firework" particles amount.
- `VITE_FIREWORKS_ROCKETS_NUM`: Set "congrulation firework" explosions count.

## Local development

Run local development server via a command:

```bash
pnpm dev
```

-- It will start server app locally, on port 5173.

## Maintenance tools

Run prettier and all the linters:

```bash
pnpm check-all
```

Run tests:

```bash
pnpm test
```

## See also

- [Changelog](CHANGELOG.md)
