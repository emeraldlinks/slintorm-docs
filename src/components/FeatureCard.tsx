'use client';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '1.5rem',
        transition: 'border-color 200ms, transform 200ms',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.4)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ color: 'var(--color-accent)', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}
