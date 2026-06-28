import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Schema Generation — SlintORM' };

const generateCmd = `# Scan TypeScript source files and output schema artifacts
npx slintorm generate

# Output:
#   src/schema/generated.ts   — typed ModelMap for TypeScript
#   src/schema/generated.json — JSON schema for edge runtimes`;

const generatedTs = `// src/schema/generated.ts (auto-generated — do not edit)
import type { ModelAPI } from 'slintorm';

// Interfaces are inlined automatically from your source files
interface User {
  id: number;
  email: string;
  name: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

export const ModelMap = {
  User: {} as ModelAPI<User>,
  Post: {} as ModelAPI<Post>,
};

export type ModelMap = typeof ModelMap;`;

const generatedJson = `// src/schema/generated.json (auto-generated)
// Used by edge runtimes — pass as 'schema' option

{
  "User": {
    "table": "users",
    "fields": {
      "id": { "auto": true, "primaryKey": true },
      "email": { "unique": true },
      "name": {}
    }
  },
  "Post": {
    "table": "posts",
    "fields": {
      "id": { "auto": true, "primaryKey": true },
      "title": {},
      "userId": {
        "index": true,
        "relation": {
          "kind": "manytoone",
          "modelName": "User",
          "foreignKey": "userId"
        }
      }
    }
  }
}`;

const howGenerator = `// How generator.ts works — no ts-morph, no compiler API
// Tokenizes .ts files with a lightweight regex-based scanner

// 1. Scans every .ts file in the configured 'dir'
// 2. Finds interface declarations and their fields
// 3. Reads // comment annotations above each field
// 4. Produces the FieldMeta map per interface
// 5. Writes generated.ts and generated.json

// This means:
// - No TypeScript compiler dependency at runtime
// - Works in any Node.js environment
// - Fast (no AST build step)
// - Only reads interface declarations (not classes or type aliases)`;

const modelMapUsage = `// Use ModelMap for a fully-typed db without individual defineModel exports

import ORMManager from 'slintorm';
import type { ModelMap } from './schema/generated';

const orm = new ORMManager<ModelMap>({
  driver: 'sqlite',
  databaseUrl: './dev.db',
  modelMap: {} as ModelMap,  // type-only — no runtime value
});

await orm.migrate();

export const db = orm.db;
// db.User  — ModelAPI<User>
// db.Post  — ModelAPI<Post>
// TypeScript knows every field on every model`;

const schemaOption = `// Pass pre-built JSON for edge runtimes (skip filesystem reads)
// Run 'npx slintorm generate' at build time, import the JSON

import schemaJson from './schema/generated.json' assert { type: 'json' };
import ORMManager from 'slintorm/browser';

const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.DATABASE_URL!,
  schema: schemaJson,  // no 'dir', no migrate()
});`;

const whenToRegenerate = `// Re-run 'npx slintorm generate' when:
// - You add a new interface
// - You add, remove, or rename a field
// - You change a relation annotation
// - You add/remove @softDelete, @unique, @index, etc.

// The schema hash in _slint_migrations is SHA-256 of the JSON —
// if the JSON changes, migrate() detects it as a pending migration

// Add to your CI pipeline:
// "prebuild": "npx slintorm generate && npx slintorm migrate"`;

export default function SchemaGenerationPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Schema Generation</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>npx slintorm generate</code> scans your TypeScript source files and produces
        two artifacts: a typed <code>ModelMap</code> for TypeScript and a JSON schema for edge runtimes.
        No TypeScript compiler or ts-morph required.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Running the generator</h2>
      <CodeBlock code={generateCmd} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>generated.ts</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The typed output. Import <code>ModelMap</code> as a type to get full inference on <code>orm.db</code>.
      </p>
      <CodeBlock code={generatedTs} filename="src/schema/generated.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>generated.json</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The JSON schema. Pass this as the <code>schema</code> option in edge runtimes to skip all
        filesystem reads at runtime.
      </p>
      <CodeBlock code={generatedJson} language="json" filename="src/schema/generated.json" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>How the generator works</h2>
      <CodeBlock code={howGenerator} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Using ModelMap for a typed db</h2>
      <CodeBlock code={modelMapUsage} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Passing schema to edge runtimes</h2>
      <CodeBlock code={schemaOption} filename="worker.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>When to re-run generate</h2>
      <CodeBlock code={whenToRegenerate} language="bash" />

      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Commit generated files</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          Commit <code>src/schema/generated.ts</code> and <code>src/schema/generated.json</code> to version control.
          This ensures edge deployments always have the latest schema without needing to run the generator
          in production. Regenerate locally after any interface changes and commit the result.
        </p>
      </div>
    </DocLayout>
  );
}
