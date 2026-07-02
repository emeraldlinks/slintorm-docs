import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Plugin System — SlintORM',
  description: "SlintORM plugin system — extend ORM behavior with lifecycle hooks, event listeners, and custom plugins.",
  alternates: { canonical: '/docs/plugins' },
};

const pluginInterface = `// Plugin interface

interface SlintORMPlugin {
  name: string;
  install(orm: OrmInstance): void | Promise<void>;
  on?(event: string, ctx: EventContext): void | Promise<void>;
  priority?: number;  // lower runs first, default 100
}

// Event types:
//   beforeQuery    afterQuery
//   beforeInsert   afterInsert
//   beforeUpdate   afterUpdate
//   beforeDelete   afterDelete
//   beforeMigrate  afterMigrate

// EventContext:
interface EventContext {
  model?: ModelDefinition;
  table?: string;
  data?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  query?: string;
  params?: unknown[];
  duration?: number;   // populated for after* events
}`;

const registerPlugin = `import { Orm } from 'slintorm';

const orm = new Orm({ /* config */ });

// Register a plugin
orm.use({
  name: 'audit-log',
  priority: 10,
  on(event, ctx) {
    if (event.startsWith('after')) {
      console.log(\`[\${event}] \${ctx.table}\`, ctx.data ?? ctx.filter);
    }
  },
});

// Plugins run in priority order (lower number first)
// orm.use() can be called before or after defining models`;

const auditLogCode = `// Example — audit logging plugin

const auditPlugin = {
  name: 'audit-log',
  priority: 20,

  install(orm) {
    // One-time setup — create audit table, register listeners, etc.
    console.log('Audit plugin installed');
  },

  async on(event, ctx) {
    // Only log mutating events
    const mutating = ['afterInsert', 'afterUpdate', 'afterDelete'];
    if (!mutating.includes(event)) return;

    await AuditLog.insert({
      table: ctx.table,
      event,
      modelName: ctx.model?.name ?? 'unknown',
      data: JSON.stringify(ctx.data ?? ctx.filter),
      timestamp: new Date().toISOString(),
    });
  },
};

orm.use(auditPlugin);`;

const queryTimingCode = `// Example — query timing plugin

const timingPlugin = {
  name: 'query-timing',
  priority: 5,  // run early for before*, late for after*

  on(event, ctx) {
    if (event === 'beforeQuery') {
      // Store start time on context
      ctx.__start = Date.now();
    }

    if (event === 'afterQuery') {
      const elapsed = Date.now() - (ctx.__start ?? Date.now());
      console.log(\`[TIMING] \${ctx.table} — \${elapsed}ms\`);

      // Emit metric to monitoring system
      metrics.timing('slintorm.query', elapsed, {
        table: ctx.table,
        operation: ctx.query?.split(' ')[0],  // SELECT, INSERT, etc.
      });
    }
  },
};

orm.use(timingPlugin);`;

const transformCode = `// Example — data transformation plugin

const transformPlugin = {
  name: 'data-transform',
  priority: 15,

  on(event, ctx) {
    if (event === 'beforeInsert' || event === 'beforeUpdate') {
      // Auto-set tenant ID on every mutation
      if (ctx.data && !ctx.data.tenantId) {
        ctx.data.tenantId = getCurrentTenant();
      }

      // Trim string fields
      if (ctx.data) {
        for (const [key, val] of Object.entries(ctx.data)) {
          if (typeof val === 'string') {
            ctx.data[key] = val.trim();
          }
        }
      }
    }

    if (event === 'beforeQuery') {
      // Auto-filter by tenant for multi-tenant apps
      if (ctx.filter && !ctx.filter.tenantId) {
        ctx.filter.tenantId = getCurrentTenant();
      }
    }
  },
};

orm.use(transformPlugin);`;

const lifecycleCleanup = `// Plugin lifecycle

// install() — called once when orm.use(plugin) is registered
//   Use for: creating tables, setting up connections, validation

// on(event, ctx) — called for every matching event
//   before* events: mutate ctx.data / ctx.filter to affect the operation
//   after* events: read-only observation (ctx.duration available)

// Cleanup — remove a plugin (not yet implemented, track via issue)
//   Future: orm.unuse('plugin-name') or plugin.uninstall()

// Plugins are called synchronously in priority order.
// If on() returns a Promise, the ORM awaits it before proceeding.
// A rejected promise in a before* event will abort the operation.`;

export default function PluginsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Plugin System</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM&apos;s plugin system lets you hook into the ORM lifecycle — before and after every query, insert, update, delete, and migration.
        Plugins are registered with <code>orm.use()</code> and receive an event context they can inspect or mutate.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Plugin interface</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        A plugin is an object with a <code>name</code>, an <code>install()</code> method, an optional <code>on()</code> handler, and an optional <code>priority</code>.
      </p>
      <CodeBlock code={pluginInterface} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Registering plugins</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Call <code>orm.use(plugin)</code> to register a plugin. Plugins with lower <code>priority</code> values run first.
      </p>
      <CodeBlock code={registerPlugin} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Example: audit logging</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Log every insert, update, and delete to an audit table.
      </p>
      <CodeBlock code={auditLogCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Example: query timing</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Measure query duration and emit metrics to your monitoring system.
      </p>
      <CodeBlock code={queryTimingCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Example: data transformation</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Automatically set tenant IDs, trim strings, or enforce field conventions before writes and queries.
      </p>
      <CodeBlock code={transformCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Lifecycle and cleanup</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>install()</code> runs once at registration. <code>on()</code> runs for every matching event.
        Before-events can mutate context to affect the operation; after-events are read-only.
      </p>
      <CodeBlock code={lifecycleCleanup} />
    </DocLayout>
  );
}
