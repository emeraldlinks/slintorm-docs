import DocLayout from '@/components/DocLayout';
import Link from 'next/link';

export const metadata = {
  title: 'Annotations — SlintORM',
  description: 'Complete reference for all SlintORM field annotations — security, validation, masking, omit, random, and more.',
  alternates: { canonical: '/docs/annotations' },
};

const categories = [
  {
    title: 'Security',
    items: [
      { name: '@hash', href: '/docs/annotations/hash', desc: 'PBKDF2 one-way hashing with .verify()' },
      { name: '@encrypt', href: '/docs/annotations/encrypt', desc: 'AES-256-GCM encryption with .decrypt()' },
      { name: '@secret', href: '/docs/annotations/secret', desc: '@hash + @omitjson composite' },
    ],
  },
  {
    title: 'Masking & Omit',
    items: [
      { name: '@mask', href: '/docs/annotations/mask', desc: 'Output masking with presets and directives' },
      { name: '@omit family', href: '/docs/annotations/omit', desc: '@omitdb, @omitjson, @omitmigrate' },
    ],
  },
  {
    title: 'Validation',
    items: [
      { name: '@email / @url / @uuid / @phone', href: '/docs/annotations/validation', desc: 'Format validators' },
      { name: '@min / @max', href: '/docs/annotations/validation', desc: 'Numeric range validation' },
      { name: '@minLength / @maxLength', href: '/docs/annotations/validation', desc: 'String length validation' },
      { name: '@pattern', href: '/docs/annotations/validation', desc: 'Custom regex validation' },
    ],
  },
  {
    title: 'Data Generation',
    items: [
      { name: '@random', href: '/docs/annotations/random', desc: 'Auto-generated field values on insert' },
    ],
  },
  {
    title: 'Field Metadata',
    items: [
      { name: '@auto / @primaryKey', href: '/docs/models', desc: 'Auto-increment and primary key' },
      { name: '@unique / @index', href: '/docs/models', desc: 'Unique constraint and indexes' },
      { name: '@nullable / @not null', href: '/docs/models', desc: 'Nullability constraints' },
      { name: '@default / @length', href: '/docs/models', desc: 'Default values and column length' },
      { name: '@enum', href: '/docs/models', desc: 'Enum check constraints' },
      { name: '@json', href: '/docs/models', desc: 'JSON column serialization' },
      { name: '@softDelete', href: '/docs/soft-delete', desc: 'Soft delete support' },
    ],
  },
];

export default function Page() {
  return (
    <DocLayout>
      <h1>Annotations Reference</h1>
      <p>SlintORM uses <code>// comment</code> annotations on interface fields to control column types, constraints, validation, security, masking, relations, and more.</p>

      {categories.map(cat => (
        <div key={cat.title} style={{ marginBottom: '2rem' }}>
          <h2>{cat.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {cat.items.map(item => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>
                  {item.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </DocLayout>
  );
}
