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
      { name: '@hash', href: '/docs/annotations/hash', desc: 'Balloon hashing (memory-hard) with .verify(), PBKDF2 opt-in' },
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
    title: 'Column Constraints',
    items: [
      { name: '@auto / @primaryKey', href: '/docs/annotations/constraints', desc: 'Auto-increment and primary key' },
      { name: '@unique / @index', href: '/docs/annotations/constraints', desc: 'Unique constraint and indexes' },
      { name: '@nullable / @not null', href: '/docs/annotations/constraints', desc: 'Nullability constraints' },
      { name: '@default / @length', href: '/docs/annotations/constraints', desc: 'Default values and column length' },
      { name: '@enum / @comment', href: '/docs/annotations/constraints', desc: 'Enum check constraints and column comments' },
      { name: '@softDelete', href: '/docs/annotations/constraints', desc: 'Soft delete support' },
    ],
  },
  {
    title: 'Relations & Polymorphics',
    items: [
      { name: '@relation / @relationship', href: '/docs/annotations/relations', desc: 'One-to-many, many-to-one, one-to-one, many-to-many' },
      { name: '@belongsTo / @hasMany / @hasOne / @belongsToMany', href: '/docs/annotations/relations', desc: 'Relation shortcuts' },
      { name: '@polymorphicType / @polymorphicId', href: '/docs/annotations/polymorphic', desc: 'Polymorphic associations (morphTo)' },
    ],
  },
  {
    title: 'Serialization',
    items: [
      { name: '@json', href: '/docs/annotations/json', desc: 'JSON column serialization (auto stringify/parse)' },
      { name: '@omit family', href: '/docs/annotations/omit', desc: '@omitdb, @omitjson, @omitmigrate' },
    ],
  },
];

export default function Page() {
  return (
    <DocLayout>
      <style>{`.annotation-card { display: block; padding: 1rem; border: 1px solid var(--color-border); border-radius: 8px; text-decoration: none; color: inherit; transition: border-color 150ms; } .annotation-card:hover { border-color: var(--color-accent); }`}</style>
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
                className="annotation-card"
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
