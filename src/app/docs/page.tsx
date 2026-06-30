import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';
import { VERSION, GITHUB_URL, NPM_URL } from '@/lib/config';

export const metadata = {
  title: 'Introduction',
  description: 'SlintORM documentation — a zero-config TypeScript ORM for SQLite, Postgres, MySQL, and MongoDB. Start here.',
  alternates: { canonical: '/docs' },
};

const llmUsage = `# Paste the full file into any AI chat for instant context:
curl https://slintorm.vercel.app/llms.txt | pbcopy

# Or reference it directly in your prompt:
"Using the SlintORM API documented at https://slintorm.vercel.app/llms.txt,
help me write a query that..."`;

const aiPrompt = `# Example prompt with llms.txt context
"I'm using SlintORM v${VERSION}. Here is the full API reference:
[paste llms.txt contents]

Help me write a model for a blog system with Users, Posts, Comments,
and Tags using many-to-many for post tags."`;

const quickLinks = [
  {
    group: 'Getting Started',
    color: '#22C55E',
    pages: [
      { label: 'Installation', href: '/docs/installation', desc: 'Install SlintORM and your database driver' },
      { label: 'Configuration', href: '/docs/configuration', desc: 'Set up new ORMManager with all options' },
      { label: 'Models', href: '/docs/models', desc: 'Define models as TypeScript interfaces' },
    ],
  },
  {
    group: 'Core API',
    color: '#60A5FA',
    pages: [
      { label: 'defineModel', href: '/docs/define-model', desc: 'All 24 ModelAPI methods' },
      { label: 'CRUD', href: '/docs/crud', desc: 'Insert, get, update, delete, upsert, and more' },
      { label: 'Query Builder', href: '/docs/query-builder', desc: 'Fluent chainable query API' },
    ],
  },
  {
    group: 'Features',
    color: '#C084FC',
    pages: [
      { label: 'Relations', href: '/docs/relations', desc: 'One-to-many, many-to-many, and more' },
      { label: 'Migrations', href: '/docs/migrations', desc: 'Auto-migrations from your interfaces' },
      { label: 'Edge / Serverless', href: '/docs/edge-serverless', desc: 'Cloudflare Workers, Next.js Edge, Deno' },
    ],
  },
];

export default function DocsIndexPage() {
  return (
    <DocLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '100px', padding: '0.3rem 0.85rem',
          fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)',
          marginBottom: '1.25rem',
        }}>
          v{VERSION}
        </div>
        <h1 style={{ marginBottom: '0.75rem' }}>Introduction</h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '640px' }}>
          SlintORM is a zero-config TypeScript ORM for SQLite, PostgreSQL, MySQL, and MongoDB.
          Define your data as plain TypeScript interfaces, call <code>migrate()</code>, and your
          database is ready — no schema files, no codegen, no extra build steps.
        </p>
      </div>

      {/* Key properties */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.65rem', marginBottom: '2.5rem',
      }}>
        {[
          { label: 'Zero dependencies', desc: 'All drivers are optional peerDependencies' },
          { label: 'Auto-migrations', desc: 'From TypeScript interfaces, non-destructive' },
          { label: 'Full query builder', desc: 'Fluent API, no N+1, window functions' },
          { label: 'Edge ready', desc: 'Cloudflare Workers, Deno, Next.js Edge' },
          { label: 'Soft delete', desc: 'Built-in, auto-filters deleted rows' },
          { label: 'Typed db store', desc: 'Full inference via ModelMap' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: '8px', padding: '0.85rem 1rem',
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-fg)', marginBottom: '0.2rem' }}>{item.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-fg-subtle)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Quick navigation */}
      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Documentation</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {quickLinks.map(group => (
          <div key={group.group}>
            <h3 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '0.6rem' }}>
              {group.group}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
              {group.pages.map(page => (
                <Link key={page.href} href={page.href} style={{
                  display: 'block', padding: '0.75rem 1rem',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: '8px', textDecoration: 'none', transition: 'border-color 150ms',
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: group.color, fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>{page.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-fg-subtle)', lineHeight: 1.5 }}>{page.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Full docs link */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/docs/installation" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--color-accent)', color: '#0F172A',
          fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.875rem',
          padding: '0.65rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
        }}>
          Start from Installation
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border)', margin: '2.5rem 0' }}/>

      {/* llms.txt section */}
      <h2 style={{ marginBottom: '0.5rem' }}>Using llms.txt with AI models</h2>
      <p style={{ marginBottom: '1.25rem', lineHeight: 1.7 }}>
        SlintORM ships a <code>/llms.txt</code> file — a full plain-text reference of the entire API
        designed specifically for AI models and LLM context windows. If you are using an AI coding
        assistant to work with SlintORM, feeding it <code>llms.txt</code> gives it everything it needs:
        every method signature, all config options, relation syntax, error codes, TypeScript types,
        and working code examples — in one file.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.65rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: '949 lines', desc: 'Full API reference — nothing omitted' },
          { label: 'Plain text', desc: 'No HTML, no markup — pure signal' },
          { label: 'AI crawlable', desc: 'All major AI crawlers explicitly allowed in robots.txt' },
          { label: 'Always current', desc: 'Updated with every release' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '8px', padding: '0.85rem 1rem',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', marginBottom: '0.2rem' }}>{item.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-fg-subtle)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: '0.65rem', marginTop: '1.5rem', fontSize: '1rem' }}>Get the file</h3>
      <CodeBlock code={llmUsage} language="bash" />

      <h3 style={{ marginBottom: '0.65rem', marginTop: '1.5rem', fontSize: '1rem' }}>Use it in a prompt</h3>
      <CodeBlock code={aiPrompt} language="bash" />

      <div style={{
        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: '8px', padding: '1rem 1.25rem', marginTop: '1.5rem', fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Direct URL</strong>
        <p style={{ marginTop: '0.35rem', color: 'var(--color-fg-muted)' }}>
          The file is served at{' '}
          <a href="/llms.txt" target="_blank">
            https://slintorm.vercel.app/llms.txt
          </a>{' '}
          — link to it in system prompts, paste it into context windows, or reference it
          directly in tools that support URL-based context loading.
        </p>
        <div style={{ marginTop: '0.75rem' }}>
          <a href="/llms.txt" download style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--color-accent)', fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem', textDecoration: 'none',
            border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px',
            padding: '0.35rem 0.75rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download llms.txt
          </a>
        </div>
      </div>

      {/* Links */}
      <div style={{ borderTop: '1px solid var(--color-border)', margin: '2.5rem 0 0' }}/>
      <div style={{
        display: 'flex', gap: '1.5rem', paddingTop: '1.5rem',
        fontSize: '0.875rem', flexWrap: 'wrap',
      }}>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--color-fg-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a href={NPM_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--color-fg-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0v24h24V0zm13 20.4H6.6V6.6H13v13.8zm4.4 0h-3.5V6.6h3.5v13.8z"/>
          </svg>
          npm package
        </a>
        <a href="/docs/changelog" style={{ color: 'var(--color-fg-muted)', textDecoration: 'none' }}>
          Changelog
        </a>
      </div>
    </DocLayout>
  );
}
