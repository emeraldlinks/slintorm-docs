import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'CLI — SlintORM',
  description: "SlintORM CLI — generate, migrate, rollback, status, fresh, drop-tracking commands with all flags.",
  alternates: { canonical: '/docs/cli' },
};

const generate = `# Generate schema files from TypeScript source
# Scans --dir (or config dir) for interfaces, outputs:
#   src/schema/generated.ts
#   src/schema/generated.json

npx slintorm generate`;

const migrate = `# Apply pending migrations
npx slintorm migrate`;

const rollback = `# Roll back the most recent batch
npx slintorm rollback

# Roll back a specific migration by name
npx slintorm rollback users

# Roll back to a specific batch number (rolls back all batches after N)
npx slintorm rollback --to 3`;

const status = `# Show pending and applied migrations with their batch numbers
npx slintorm status

# Output example:
# [✓] users       batch 1   2024-01-10
# [✓] posts       batch 1   2024-01-10
# [✗] comments    pending`;

const fresh = `# Drop all tables and re-run all migrations from scratch
# USE WITH CAUTION — destroys all data in development

npx slintorm fresh`;

const dropTracking = `# Remove the _slint_migrations tracking table
# Useful when you want to reset migration history without dropping tables
# (e.g. switching from another ORM or fixing a corrupted state)

npx slintorm drop-tracking`;

const help = `# Print all available commands
npx slintorm --help`;

const configResolution = `# Config resolution order (highest to lowest priority):
# 1. CLI flags    --dir ./src --driver sqlite
# 2. slintorm.config.js in cwd
# 3. "slintorm" key in package.json

# Example: override dir at runtime
npx slintorm migrate --dir ./app/models --driver postgres --databaseUrl $DATABASE_URL`;

const commands = [
  { cmd: 'generate', desc: 'Scan TypeScript source, write schema/generated.ts and schema/generated.json' },
  { cmd: 'migrate', desc: 'Apply all pending migrations to the database' },
  { cmd: 'rollback', desc: 'Roll back the most recent migration batch' },
  { cmd: 'rollback <name>', desc: 'Roll back a specific migration by model/table name' },
  { cmd: 'rollback --to <batch>', desc: 'Roll back to a specific batch number (all later batches removed)' },
  { cmd: 'status', desc: 'Show all migrations with their applied/pending status and batch number' },
  { cmd: 'fresh', desc: 'Drop all tables and rerun every migration. Development only.' },
  { cmd: 'drop-tracking', desc: 'Remove the _slint_migrations tracking table only' },
  { cmd: '--help', desc: 'Print command reference' },
];

export default function CLIPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>CLI</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        The <code>slintorm</code> CLI manages schema generation, migrations, and rollbacks.
        All commands read config from <code>slintorm.config.js</code> or the <code>"slintorm"</code> key in <code>package.json</code>,
        with CLI flags taking highest priority.
      </p>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Command reference</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Command</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => (
              <tr key={c.cmd}>
                <td><code style={{ fontSize: '0.82rem' }}>npx slintorm {c.cmd}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>generate</h2>
      <CodeBlock code={generate} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>migrate</h2>
      <CodeBlock code={migrate} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>rollback</h2>
      <CodeBlock code={rollback} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>status</h2>
      <CodeBlock code={status} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>fresh</h2>
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        fontSize: '0.875rem',
        color: '#FCA5A5',
      }}>
        Drops all tables and re-runs every migration. Destroys all data. Development only.
      </div>
      <CodeBlock code={fresh} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>drop-tracking</h2>
      <CodeBlock code={dropTracking} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>--help</h2>
      <CodeBlock code={help} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Config resolution and flags</h2>
      <CodeBlock code={configResolution} language="bash" />

      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Terminal output</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          The CLI uses timestamped logging and progress bars for long-running operations.
          Color-coded output: green for success, yellow for pending/skipped, red for errors.
          All timestamps are ISO 8601 UTC.
        </p>
      </div>
    </DocLayout>
  );
}
