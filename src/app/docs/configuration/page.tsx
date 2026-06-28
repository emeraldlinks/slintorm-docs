import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Configuration — SlintORM' };

const configFile = `// slintorm.config.js
module.exports = {
  driver: 'sqlite',
  databaseUrl: './dev.db',
  dir: './src',         // directory to scan for TypeScript models
  logs: false,          // log SQL queries
};`;

const packageJson = `// package.json
{
  "slintorm": {
    "driver": "postgres",
    "databaseUrl": "postgresql://user:pass@localhost/mydb",
    "dir": "./src"
  }
}`;

const sqliteInit = `// db.ts — SQLite
import ORMManager from 'slintorm';

export const orm = new ORMManager({
  driver: 'sqlite',
  databaseUrl: './dev.db',   // path to file, or ':memory:'
  dir: './src',
  logs: false,
});

await orm.migrate();`;

const postgresInit = `// db.ts — PostgreSQL
import ORMManager from 'slintorm';

export const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.DATABASE_URL!, // postgresql://user:pass@host/db
  dir: './src',
});

await orm.migrate();`;

const mysqlInit = `// db.ts — MySQL
import ORMManager from 'slintorm';

export const orm = new ORMManager({
  driver: 'mysql',
  databaseUrl: 'mysql://user:pass@localhost/mydb',
  dir: './src',
});

await orm.migrate();`;

const mongoInit = `// db.ts — MongoDB
import ORMManager from 'slintorm';

export const orm = new ORMManager({
  driver: 'mongodb',
  databaseUrl: process.env.MONGO_URI!,
  dir: './src',
});

await orm.migrate();`;

const withModelMap = `// db.ts — typed db store via ModelMap
import ORMManager from 'slintorm';
import type { ModelMap } from './schema/generated';

export const orm = new ORMManager<ModelMap>({
  driver: 'sqlite',
  databaseUrl: './dev.db',
  modelMap: {} as ModelMap,
  schema: undefined, // or pre-built JSON for edge runtimes
});

// orm.db.User.insert(...)  — fully typed
export const db = orm.db;`;

const options = [
  { key: 'driver', type: '"sqlite" | "postgres" | "mysql" | "mongodb"', desc: 'Required. Database driver to use.' },
  { key: 'databaseUrl', type: 'string', desc: 'Required. Connection string or file path.' },
  { key: 'dir', type: 'string', desc: 'Directory to scan for TypeScript interfaces. Defaults to process.cwd().' },
  { key: 'logs', type: 'boolean', desc: 'Log every SQL query to stdout. Default: false.' },
  { key: 'schema', type: 'object', desc: 'Pre-built schema JSON (from generated.json). Pass this instead of scanning files — required for edge runtimes.' },
  { key: 'modelMap', type: 'object', desc: 'Type-only value for typing the db store. Use {} as ModelMap from generated.ts.' },
];

export default function ConfigurationPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Configuration</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM resolves config from three sources in priority order: CLI flags, <code>slintorm.config.js</code>, then the <code>&quot;slintorm&quot;</code> key in <code>package.json</code>.
      </p>

      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Recommended: new ORMManager()</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          <code>ORMManager</code> is the default export and the primary class. Use <code>new ORMManager(config)</code> directly.
          It gives you a real class instance — supporting <code>instanceof</code> checks, subclassing, and cleaner
          generic inference for typed <code>db</code> stores. The functional <code>createORM</code> alias exists
          but is not the recommended pattern.
        </p>
      </div>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>ORMManagerConfig options</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {options.map(o => (
              <tr key={o.key}>
                <td><code>{o.key}</code></td>
                <td><code style={{ fontSize: '0.8rem', color: '#60A5FA' }}>{o.type}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{o.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>slintorm.config.js</h2>
      <CodeBlock code={configFile} language="javascript" filename="slintorm.config.js" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>package.json alternative</h2>
      <CodeBlock code={packageJson} language="json" filename="package.json" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Driver-specific init examples</h2>

      <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-fg-muted)' }}>SQLite</h3>
      <CodeBlock code={sqliteInit} filename="db.ts" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>PostgreSQL</h3>
      <CodeBlock code={postgresInit} filename="db.ts" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>MySQL</h3>
      <CodeBlock code={mysqlInit} filename="db.ts" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>MongoDB</h3>
      <CodeBlock code={mongoInit} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Typed db store with ModelMap</h2>
      <p style={{ marginBottom: '1rem' }}>
        After running <code>npx slintorm generate</code>, pass the generated <code>ModelMap</code> type to get a
        fully-typed <code>db</code> object without manual <code>defineModel</code> exports.
      </p>
      <CodeBlock code={withModelMap} filename="db.ts" />
    </DocLayout>
  );
}
