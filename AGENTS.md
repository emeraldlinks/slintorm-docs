# SlintORM Docs — Agent Guide

## Project Overview

This is the SlintORM documentation site — a Next.js app that serves developer docs for the [SlintORM](https://github.com/emeraldlinks/slintorm) ORM library. It's deployed at [slintorm.vercel.app](https://slintorm.vercel.app).

## Tech Stack

- **Next.js 16** (breaking changes — read `node_modules/next/dist/docs/` before writing code)
- **React 19**
- **TypeScript** strict mode
- **Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`)
- **Custom components** (no shadcn/ui)
- **Fonts**: IBM Plex Sans (body), JetBrains Mono (code) — loaded from Google Fonts

## Key Files

| Path | Purpose |
|---|---|
| `src/lib/config.ts` | Central config — `VERSION`, `SITE_URL`, `GITHUB_URL`, `NPM_URL` |
| `src/app/layout.tsx` | Root layout — metadata, fonts, Topbar |
| `src/app/page.tsx` | Landing page |
| `src/app/docs/` | All documentation pages (each is a directory with `page.tsx`) |
| `src/components/` | Reusable UI components |
| `public/llms.txt` | Plain-text AI reference — **must stay in sync with main repo's llms.txt** |
| `next.config.ts` | Minimal — no special config |
| `package.json` | Dependencies and scripts |

## How Docs Pages Work

Each doc page:
1. Lives in `src/app/docs/<section-name>/page.tsx`
2. Exports `metadata` with `title` and `description`
3. Exports a default React component wrapped in `<DocLayout>`
4. Uses `<CodeBlock code={...} filename="..." />` for code snippets
5. Sidebar navigation is defined in `src/components/Sidebar.tsx`

### Page template

```typescript
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Page Title — SlintORM',
  description: 'SEO description',
  alternates: { canonical: '/docs/page-path' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1>Heading</h1>
      <p>Content...</p>
      <CodeBlock code={codeString} filename="src/example.ts" />
    </DocLayout>
  );
}
```

## Version Management

- Version is in `src/lib/config.ts` as `VERSION = process.env.NEXT_PUBLIC_VERSION ?? '1.5.1'`
- Set `NEXT_PUBLIC_VERSION` in `.env` or Vercel env vars to change the displayed version
- `public/llms.txt` has a hardcoded version string (line 11 and footer) — update both when bumping
- The sidebar shows the version badge automatically from `VERSION` config

## llms.txt

`public/llms.txt` is a plain-text AI reference served at `/llms.txt`. It must be manually kept in sync with the main repo's `llms.txt` (`/root/slintorm/llms.txt`). The main repo `llms.txt` is the authoritative source — copy relevant changes to `public/llms.txt` when the API changes.

Key things to sync:
- Version number (line 11 and footer)
- Shipped annotations table
- Upcoming annotations section
- Any new API methods or config options

## Related Repos

- **Main repo**: `/root/slintorm` — the SlintORM library itself
- **Docs repo**: `/root/slintorm-docs` — this project
- **Main repo llms.txt**: `/root/slintorm/llms.txt` — authoritative AI reference

## Development

```bash
npm run dev      # Next.js dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Deployment

Auto-deployed from Git pushes to the `main` branch on Vercel. After updating `public/llms.txt`, commit and push to trigger redeploy.
