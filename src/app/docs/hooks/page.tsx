import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Hooks — SlintORM',
  description: "SlintORM lifecycle hooks — all 6 ModelHooks with async support, data mutation, and real-world examples.",
  alternates: { canonical: '/docs/hooks' },
};

const allHooks = `// ModelHooks<T> — all 6 lifecycle hooks
// Passed as third argument to orm.defineModel()

const User = orm.defineModel<User>('users', 'User', {
  // onCreateBefore: runs before INSERT
  // Returning a value replaces the data being inserted
  async onCreateBefore(data: User): Promise<User | void> {
    return { ...data, email: data.email.toLowerCase() };
  },

  // onCreateAfter: runs after INSERT, receives the inserted row
  async onCreateAfter(item: User): Promise<void> {
    console.log('Created user:', item.id);
  },

  // onUpdateBefore: runs before UPDATE
  // Returning a value replaces the newData being applied
  async onUpdateBefore(oldData: User, newData: Partial<User>): Promise<Partial<User> | void> {
    // No return needed if not mutating
    console.log('Updating user', oldData.id);
  },

  // onUpdateAfter: runs after UPDATE
  async onUpdateAfter(oldData: User, newData: Partial<User>): Promise<void> {
    console.log('Updated user', oldData.id);
  },

  // onDeleteBefore: runs before DELETE
  onDeleteBefore(deleted: User): void {
    console.log('About to delete user:', deleted.id);
  },

  // onDeleteAfter: runs after DELETE
  onDeleteAfter(deleted: User): void {
    console.log('Deleted user:', deleted.id);
  },
});`;

const passwordHook = `// Hash password before insert and update
import bcrypt from 'bcrypt';

const User = orm.defineModel<User>('users', 'User', {
  async onCreateBefore(data) {
    if (data.password) {
      return { ...data, password: await bcrypt.hash(data.password, 12) };
    }
  },

  async onUpdateBefore(oldData, newData) {
    if (newData.password) {
      return { ...newData, password: await bcrypt.hash(newData.password, 12) };
    }
    // No return = newData used as-is
  },
});`;

const auditHook = `// Audit log hook — record every change to a separate table
const AuditLog = orm.defineModel<AuditLog>('audit_logs', 'AuditLog');

const Post = orm.defineModel<Post>('posts', 'Post', {
  async onCreateAfter(item) {
    await AuditLog.insert({
      action: 'create',
      entityType: 'Post',
      entityId: item.id,
      data: JSON.stringify(item),
    });
  },

  async onUpdateAfter(oldData, newData) {
    await AuditLog.insert({
      action: 'update',
      entityType: 'Post',
      entityId: oldData.id,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    });
  },

  async onDeleteAfter(deleted) {
    await AuditLog.insert({
      action: 'delete',
      entityType: 'Post',
      entityId: deleted.id,
      data: JSON.stringify(deleted),
    });
  },
});`;

const emailHook = `// Send welcome email after user creation
import { sendEmail } from '@/lib/email';

const User = orm.defineModel<User>('users', 'User', {
  async onCreateAfter(item) {
    await sendEmail({
      to: item.email,
      subject: 'Welcome to the platform',
      template: 'welcome',
      data: { name: item.name },
    });
  },
});`;

const mutationHook = `// Mutation via return value
// onCreateBefore and onUpdateBefore can return a new object
// that replaces the data being written

const Product = orm.defineModel<Product>('products', 'Product', {
  onCreateBefore(data) {
    // Normalize slug before insert
    return {
      ...data,
      slug: data.name.toLowerCase().replace(/\\s+/g, '-'),
      createdBy: getCurrentUserId(),
    };
  },

  onUpdateBefore(oldData, newData) {
    // If name changed, regenerate slug
    if (newData.name && newData.name !== oldData.name) {
      return {
        ...newData,
        slug: newData.name.toLowerCase().replace(/\\s+/g, '-'),
      };
    }
    // Return nothing = use newData unchanged
  },
});`;

const hookSignatures = [
  { hook: 'onCreateBefore(data: T)', returns: 'T | void | Promise<T | void>', desc: 'Runs before INSERT. Return value replaces data.' },
  { hook: 'onCreateAfter(item: T)', returns: 'void | Promise<void>', desc: 'Runs after INSERT with the created row.' },
  { hook: 'onUpdateBefore(oldData: T, newData: Partial<T>)', returns: 'Partial<T> | void | Promise<...>', desc: 'Runs before UPDATE. Return value replaces newData.' },
  { hook: 'onUpdateAfter(oldData: T, newData: Partial<T>)', returns: 'void | Promise<void>', desc: 'Runs after UPDATE.' },
  { hook: 'onDeleteBefore(deleted: T)', returns: 'void', desc: 'Runs before DELETE with the row being deleted.' },
  { hook: 'onDeleteAfter(deleted: T)', returns: 'void', desc: 'Runs after DELETE.' },
];

export default function HooksPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Hooks</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>ModelHooks&lt;T&gt;</code> provides 6 lifecycle hooks passed as the third argument to <code>defineModel()</code>.
        All hooks support async. <code>onCreateBefore</code> and <code>onUpdateBefore</code> can mutate
        data by returning a new value.
      </p>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Hook signatures</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Hook</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {hookSignatures.map(h => (
              <tr key={h.hook}>
                <td><code style={{ fontSize: '0.78rem' }}>{h.hook}</code></td>
                <td><code style={{ fontSize: '0.78rem', color: '#60A5FA' }}>{h.returns}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{h.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>All hooks example</h2>
      <CodeBlock code={allHooks} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Password hashing hook</h2>
      <CodeBlock code={passwordHook} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Audit log hook</h2>
      <CodeBlock code={auditHook} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Email notification hook</h2>
      <CodeBlock code={emailHook} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Mutation via return value</h2>
      <CodeBlock code={mutationHook} />
    </DocLayout>
  );
}
