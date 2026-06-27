import Sidebar from './Sidebar';

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
