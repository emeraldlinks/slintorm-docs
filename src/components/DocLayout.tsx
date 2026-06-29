import Sidebar from './Sidebar';
import { VERSION, GITHUB_URL } from '@/lib/config';

export default function DocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '56px' }}>
      {/* Sidebar - fixed on desktop */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
        position: 'fixed',
        top: '56px',
        bottom: 0,
        left: 0,
        overflowY: 'auto',
        background: 'var(--color-bg)',
        display: 'none',
      }} className="doc-sidebar">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        minWidth: 0,
        padding: '2.5rem 2rem',
        maxWidth: '860px',
        margin: '0 auto',
      }} className="doc-main">
        {children}

        {/* Footer */}
        <footer style={{
          marginTop: '4rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-fg-subtle)',
        }}>
          <span>SlintORM v{VERSION} &mdash; MIT &mdash; <a href={GITHUB_URL} style={{ color: 'var(--color-fg-subtle)' }}>GitHub</a></span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <a href="/llms.txt" download style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              color: 'var(--color-accent)', textDecoration: 'none',
              border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', padding: '0.3rem 0.65rem',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              llms.txt
            </a>
          </div>
        </footer>
      </main>

      <style>{`
        @media (min-width: 769px) {
          .doc-sidebar { display: block !important; }
          .doc-main { margin-left: 260px !important; margin-right: 0 !important; }
        }
      `}</style>
    </div>
  );
}
