import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'TypeScript — SlintORM' };

const modelApiType = `// ModelAPI<T> — all 24 methods
// Returned by orm.defineModel<T>(table, name, hooks?)

interface ModelAPI<T> {
  insert(data: Partial<T>): Promise<EntityWithUpdate<T>>;
  insertMany(data: Partial<T>[]): Promise<EntityWithUpdate<T>[]>;
  get(filter: Partial<T>): Promise<EntityWithUpdate<T> | null>;
  getAll(filter?: Partial<T>): Promise<EntityWithUpdate<T>[]>;
  update(filter: Partial<T>, data: Partial<T>): Promise<number>;
  updateMany(filter: Partial<T>, data: Partial<T>): Promise<number>;
  delete(filter: Partial<T>): Promise<number>;
  deleteMany(filter: Partial<T>): Promise<number>;
  upsert(data: Partial<T>, conflictKey: keyof T): Promise<EntityWithUpdate<T>>;
  findOrCreate(filter: Partial<T>, defaults?: Partial<T>): Promise<{ record: EntityWithUpdate<T>; created: boolean }>;
  exists(filter: Partial<T>): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
  sum(col: keyof T, filter?: Partial<T>): Promise<number>;
  avg(col: keyof T, filter?: Partial<T>): Promise<number>;
  min(col: keyof T, filter?: Partial<T>): Promise<number | string>;
  max(col: keyof T, filter?: Partial<T>): Promise<number | string>;
  truncate(): Promise<void>;
  restore(filter: Partial<T>): Promise<void>;
  validate(data: Partial<T>, rules: FieldRules<T>): Promise<void>;
  check(data: Partial<T>, rules: FieldRules<T>): Promise<Record<string, string> | null>;
  query(): QueryBuilder<T>;
  advanced(): AdvancedQueryBuilder<T>;
  softDelete(): SoftDeleteQueryBuilder<T>;
  extended(): ExtendedQueryBuilder<T>;
}`;

const entityWithUpdate = `// EntityWithUpdate<T>
// Rows returned by get(), insert(), findOrCreate() are augmented with:

type EntityWithUpdate<T> = T & {
  update(data: Partial<T>): Promise<EntityWithUpdate<T>>;
  delete(): Promise<void>;
  refresh(): Promise<EntityWithUpdate<T>>;
  toJSON(): T;
};

// Example:
const user = await User.insert({ email: 'a@b.com', name: 'Alice' });
// user is EntityWithUpdate<User>

const updated = await user.update({ name: 'Bob' });   // -> EntityWithUpdate<User>
await user.delete();                                  // -> void
const fresh = await user.refresh();                   // re-fetches from DB
const plain = user.toJSON();                          // -> User (no ORM methods)`;

const dbStore = `// DBStore<TModelMap> — typed db object
// Access all models without individual exports

import { createORM } from 'slintorm';
import type { ModelMap } from './schema/generated';

const orm = createORM<typeof ModelMap>({
  driver: 'sqlite',
  databaseUrl: './dev.db',
  modelMap: {} as typeof ModelMap,
});

export const db: DBStore<typeof ModelMap> = orm.db;

// Fully typed:
db.User.insert(...)      // knows User fields
db.Post.getAll()         // knows Post fields
db.Comment.query()       // QueryBuilder<Comment>`;

const readonlyStore = `// ReadonlyDBStore<TModelMap>
// Same as DBStore but all models are readonly (no insert/update/delete)
// Useful for passing to functions that should only read

function listUsers(db: ReadonlyDBStore<typeof ModelMap>) {
  return db.User.getAll();  // allowed
  // db.User.insert(...)    // TypeScript error
}`;

const configType = `// ORMManagerConfig<TModelMap>
interface ORMManagerConfig<TModelMap = Record<string, unknown>> {
  driver: DBDriver;
  databaseUrl: string;
  dir?: string;
  logs?: boolean;
  schema?: object;
  modelMap?: TModelMap;
}

type DBDriver = 'sqlite' | 'postgres' | 'mysql' | 'mongodb';`;

const utilTypes = `// Utility types

// SQLExecResult — returned by adapter.exec()
interface SQLExecResult {
  rows: unknown[];
  rowsAffected: number;
  lastInsertId: number | null;
}

// ExecFn — the adapter's core execute function
type ExecFn = (sql: string, params?: unknown[]) => Promise<SQLExecResult>;

// OpComparison — valid WHERE operators
type OpComparison = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE' | 'ILIKE';

// RelationKind — valid relation types
type RelationKind = 'onetomany' | 'manytoone' | 'onetoone' | 'manytomany';

// RelationDef — parsed from @relation annotations
interface RelationDef {
  kind: RelationKind;
  modelName: string;
  foreignKey: string;
  relatedKey?: string;
  through?: string;
  onDelete?: 'CASCADE' | 'SET NULL';
}`;

const fieldMeta = `// FieldMeta — parsed annotation data per field
// Used internally by Migrator and QueryBuilder

interface FieldMeta {
  auto?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  index?: boolean;
  nullable?: boolean;
  notNull?: boolean;
  length?: number;
  json?: boolean;
  softDelete?: boolean;
  enum?: string[];
  default?: string;
  comment?: string;
  relation?: RelationDef;
}`;

const validationTypes = `// FieldRules<T> — per-field validation rules

type FieldRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    match?: RegExp;
    custom?: (value: unknown, row: Partial<T>) => string | null | Promise<string | null>;
  };
};

// ModelHooks<T> — lifecycle hooks
interface ModelHooks<T> {
  onCreateBefore?: (data: T) => T | void | Promise<T | void>;
  onCreateAfter?: (item: T) => void | Promise<void>;
  onUpdateBefore?: (oldData: T, newData: Partial<T>) => Partial<T> | void | Promise<Partial<T> | void>;
  onUpdateAfter?: (oldData: T, newData: Partial<T>) => void | Promise<void>;
  onDeleteBefore?: (deleted: T) => void;
  onDeleteAfter?: (deleted: T) => void;
}`;

const modelMapPattern = `// ModelMap pattern — generated by 'npx slintorm generate'

// src/schema/generated.ts (auto-generated — do not edit)
export const ModelMap = {
  User: {} as ModelAPI<User>,
  Post: {} as ModelAPI<Post>,
  Comment: {} as ModelAPI<Comment>,
  Team: {} as ModelAPI<Team>,
};

export type ModelMap = typeof ModelMap;

// Usage in db.ts:
import { createORM } from 'slintorm';
import type { ModelMap } from './schema/generated';

const orm = createORM<typeof ModelMap>({
  driver: 'sqlite',
  databaseUrl: './dev.db',
  modelMap: {} as typeof ModelMap,
});

// orm.db is typed as DBStore<typeof ModelMap>
// orm.db.User, orm.db.Post, etc. are all fully typed`;

export default function TypeScriptPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>TypeScript</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM is written in TypeScript with full generic typing throughout.
        This page documents every exported type and interface.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ModelAPI&lt;T&gt;</h2>
      <CodeBlock code={modelApiType} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>EntityWithUpdate&lt;T&gt;</h2>
      <CodeBlock code={entityWithUpdate} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>DBStore / ReadonlyDBStore</h2>
      <CodeBlock code={dbStore} />
      <CodeBlock code={readonlyStore} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ORMManagerConfig</h2>
      <CodeBlock code={configType} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Utility types</h2>
      <CodeBlock code={utilTypes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>FieldMeta</h2>
      <CodeBlock code={fieldMeta} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>FieldRules / ModelHooks</h2>
      <CodeBlock code={validationTypes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ModelMap pattern</h2>
      <CodeBlock code={modelMapPattern} />
    </DocLayout>
  );
}
