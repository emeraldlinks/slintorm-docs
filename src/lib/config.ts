// Central config — reads from environment variables
// Update .env to change version across the entire site

export const VERSION = process.env.NEXT_PUBLIC_VERSION ?? '1.1.5';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://slintorm.vercel.app';
export const GITHUB_URL = 'https://github.com/emeraldlinks/slintorm';
export const NPM_URL = 'https://www.npmjs.com/package/slintorm';
