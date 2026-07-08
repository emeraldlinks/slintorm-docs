import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Upcoming Features — SlintORM',
  description: "Preview of annotations and features coming in SlintORM — omit family, security, validation, sanitization, audit, and more.",
  alternates: { canonical: '/docs/upcoming-features' },
};

const annotationSections = [
  {
    category: 'Omit / Visibility Family',
    color: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.2)',
    items: [
      {
        name: '@omitdb',
        summary: "Exclude field from database entirely — no column created, excluded from inserts and updates.",
        scenario: `You run a SaaS that stores raw webhook payloads for debugging. You want the payload available in your TypeScript model for in-memory processing (validation, transformation) but you don't want to bloat your database with multi-KB JSON blobs.

Instead: you process the payload, extract what you need into real columns, then discard the raw body. Using @omitdb, the rawBody field exists in code for handlers to access, but never touches the database.`,
        example: `interface WebhookEvent {
  id: number;
  type: string;
  // @omitdb — processed in code, not stored
  rawBody: Record<string, any>;
  processedAt: string;
}`,
      },
      {
        name: '@omitjson',
        summary: "Field is stored and migrated normally, but stripped from all read results unless explicitly selected.",
        scenario: `Your User model has a large JSON column containing full OAuth token responses (access_token, refresh_token, expiry, scope, raw_profile). 99% of the time, your frontend only needs user.name and user.email. But when the token refresh job runs, it needs the full payload.

With @omitjson, the tokens column lives in the database and gets migrated normally. Every get(), getAll(), and query() result automatically strips it. The only way to retrieve it is an explicit .select("tokens") — making accidental data leakage impossible.`,
        example: `interface User {
  id: number;
  name: string;
  email: string;
  // @omitjson — never returned unless explicitly selected
  tokens: Record<string, any>;
  createdAt: string;
}

// Frontend: safe by default
const user = await User.get({ id: 1 });
// user.tokens === undefined

// Token refresh job: explicit opt-in
const full = await User.query()
  .select("id", "tokens")
  .where("id", "=", 1)
  .first();
// full.tokens contains the OAuth payload`,
      },
      {
        name: '@omitmigrate',
        summary: "Field exists in the schema/TypeScript types but the migrator never creates, alters, or drops its column — manual DDL management.",
        scenario: `Your production database has a legacy column "ssn_last4" that was created by a previous migration tool. You're migrating to SlintORM but you don't want the migrator touching this column — it's already there, it has the right type, and altering it could trigger a full table rewrite on MySQL.

Mark it @omitmigrate. SlintORM treats it as read-only at the migration level: the column stays in the schema for queries and ORM access, but the migrator never generates CREATE/ALTER/DROP for it. You manage the DDL yourself.`,
        example: `interface Patient {
  id: number;
  name: string;
  // @omitmigrate — exists in DB, migrator won't touch it
  ssnLast4: string;
  createdAt: string;
}`,
      },
    ],
  },
  {
    category: 'Validation',
    color: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
    items: [
      {
        name: '@email / @url / @uuid / @phone',
        summary: "Built-in format validators that run on insert/update before the SQL query is executed. Zero dependencies — regex only.",
        scenario: `Your signup form accepts email, website, and phone. You want to validate these at the ORM layer so every code path (REST API, GraphQL, admin panel, CLI seed scripts) gets the same validation.

Simply annotate the fields. On every insert and update, SlintORM checks the format and throws a ValidationError immediately — before any SQL reaches the database. No extra validation library needed.`,
        example: `interface Contact {
  id: number;
  // @email
  email: string;
  // @url
  website: string;
  // @uuid
  externalId: string;
  // @phone
  mobile: string;
}`,
      },
      {
        name: '@min:N / @max:N / @minLength:N / @maxLength:N',
        summary: "Numeric range and string length validation at the ORM layer.",
        scenario: `Your Product model has a price field that must be between 0.01 and 9999.99, and a description that must be at least 10 characters but no more than 2000.

With @min/@max on price and @minLength/@maxLength on description, every code path that writes to products automatically enforces these constraints. A rogue API client sending price: -5 gets a clear ValidationError before the query runs.`,
        example: `interface Product {
  id: number;
  name: string;
  // @min:0.01;@max:9999.99
  price: number;
  // @minLength:10;@maxLength:2000
  description: string;
  // @min:1;@max:5
  rating: number;
}`,
      },
      {
        name: '@pattern:regex',
        summary: "Custom regex validation — for formats not covered by built-in validators.",
        scenario: `You store Slack channel names like "#general", "#random". They must start with "#" and be 1-80 lowercase alphanumeric characters with hyphens. No built-in validator covers this.

@pattern lets you write any regex. Invalid channels are rejected at the ORM layer.`,
        example: `interface SlackChannel {
  id: number;
  // @pattern:^#[a-z0-9-]{1,80}$
  name: string;
  teamId: number;
}`,
      },
    ],
  },
  {
    category: 'Security',
    color: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.2)',
    items: [
      {
        name: '@hash (pbkdf2 / scrypt)',
        summary: "One-way hashing using Node.js built-in crypto — pbkdf2 (default, 100k iterations) or scrypt (memory-hard). Stores algorithm$salt$hash format. Provides .verify(plaintext) for constant-time comparison.",
        scenario: `You're building the auth system for a B2B platform. Passwords must never be stored in plaintext. You need PBKDF2 with a strong iteration count, and you want to migrate to scrypt later without breaking existing hashes.

When a user registers, @hash automatically pbkdf2-hashes the password field with a random salt before writing to the database. The stored format is "pbkdf2$abc123$hashvalue" — self-describing for future algorithm upgrades.

On login, you call user.password.verify(plaintext) which uses crypto.timingSafeEqual to prevent timing attacks. When you later bump to scrypt, old pbkdf2 hashes continue working; the next successful login re-hashes with the new algorithm.`,
        example: `interface User {
  id: number;
  email: string;
  // @hash:pbkdf2
  password: string;
  createdAt: string;
}

// Registration — auto-hashed
await User.insert({
  email: "alice@example.com",
  password: "correct-horse-battery-staple",
});
// Stored: "pbkdf2$a1b2c3$ab3d7e..." (never the plaintext)

// Login — constant-time verify
const user = await User.get({ email: "alice@example.com" });
const match = user.password.verify("correct-horse-battery-staple");
// true — uses crypto.timingSafeEqual`,
      },
      {
        name: '@encrypt (AES-256-GCM / CBC)',
        summary: "Two-way encryption using Node.js crypto. AES-256-GCM by default (authenticated, tamper-detection). Stores iv:ciphertext:authTag in base64. Key drawn from process.env with optional per-column HKDF derivation.",
        scenario: `Your healthcare app stores patient Social Security Numbers (SSNs) and medical record numbers. Compliance (HIPAA, GDPR) requires encryption at rest — but you also need to read the plaintext values when rendering a patient's profile or billing a claim.

With @encrypt, the field is transparently encrypted on write and decrypted on read. The stored value looks like "iv$ciphertext$authTag" — an attacker who dumps the database sees only random bytes. Only your application, holding the master encryption key in an environment variable, can decrypt.

GCM mode adds an authentication tag that detects tampering: if someone modifies the ciphertext in the database, decryption throws an error instead of returning garbage.`,
        example: `interface PatientRecord {
  id: number;
  name: string;
  // @encrypt
  ssn: string;
  // @encrypt
  medicalRecordNumber: string;
  createdAt: string;
}

// Write: automatically encrypted
await PatientRecord.insert({
  name: "Jane Doe",
  ssn: "123-45-6789",
  medicalRecordNumber: "MRN-88472",
});
// DB stores: "a1b2...$x3y5...$authTag" (base64)

// Read: transparently decrypted
const record = await PatientRecord.get({ id: 1 });
console.log(record.ssn); // "123-45-6789"`,
      },
      {
        name: '@token',
        summary: "Auto-generate cryptographically secure random tokens on insert using crypto.randomBytes. Configurable byte length, prefix, and encoding. Combine with @hash for API key patterns.",
        scenario: `You're launching an API platform. Every new team gets an API key like "sk_live_a1b2c3d4e5f6...". The key must be:
1. Generated with cryptographic randomness (not Math.random)
2. Returned exactly once to the developer (on creation)
3. Stored as a hash so even you can't recover it

@token generates the random bytes and stores the raw value. Combined with @hash, the database stores only the hash — but the insert response includes the plaintext key for the developer to copy. If they lose it, they must regenerate.`,
        example: `interface ApiKey {
  id: number;
  teamId: number;
  // @token:bytes:32;@hash
  // @token generates the value, @hash stores it hashed
  key: string;
  // @token:bytes:16;@token:prefix:webhook_
  webhookSecret: string;
  createdAt: string;
}

// Create — raw key returned once
const key = await ApiKey.insert({ teamId: 1 });
console.log(key.key); // "a1b2c3d4e5f6..." — shown once, never again
// DB stores hash of the key

// Authenticate — constant-time verify
const apiKey = await ApiKey.get({ teamId: 1 });
apiKey.key.verify(request.apiKey); // true or false`,
      },
    ],
  },
  {
    category: 'Masking & Sanitization',
    color: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
    items: [
      {
        name: '@mask',
        summary: "Output masking — database stores the real value, but all read paths (get, getAll, query) return a masked version. Presets for creditcard, ssn, email, phone. Custom showFirst:N / showLast:N / showBoth:F,L / pattern templates. Bypass with .withoutMasking().",
        scenario: `Your support dashboard lets agents view user profiles. Agents need to verify identity but should never see full credit card numbers or SSNs. The compliance team, however, needs full access for audits.

With @mask, the database stores the real SSN "123-45-6789" and credit card "4111-1111-1111-1234". All ORM queries return masked values: "***-**-6789" and "****-****-****-1234". 

For the compliance team, the model layer exposes .withoutMasking() on the query builder — but only when the caller has the "compliance" role (checked at the application layer). The masking is zero-dependency: pure string manipulation, not even crypto needed.`,
        example: `interface Customer {
  id: number;
  name: string;
  // @mask:ssn
  ssn: string;
  // @mask:creditcard
  creditCard: string;
  // @mask:email
  email: string;
  // @mask:phone
  phone: string;
}

// Agent view — automatically masked
const customer = await Customer.get({ id: 1 });
console.log(customer.ssn);        // "***-**-6789"
console.log(customer.creditCard);  // "****-****-****-1234"
console.log(customer.email);       // "j***@example.com"

// Compliance team — bypass masking
const full = await Customer.query()
  .withoutMasking()
  .where("id", "=", 1)
  .first();
console.log(full.ssn); // "123-45-6789"`,
      },
      {
        name: '@sanitize',
        summary: "Input sanitization applied on insert/update before validation. Supports trim, lower, upper, stripTags (HTML), escape (HTML entities). Chainable.",
        scenario: `Your forum app accepts user posts. Users paste text from Word with fancy quotes, trailing whitespace, and sometimes malicious <script> tags. You need to clean input before storing — but you don't want to add DOMPurify or sanitize-html as dependencies.

@sanitize:trim removes leading/trailing whitespace. @sanitize:stripTags removes any HTML tags using regex (safe for plain-text fields). @sanitize:escape escapes & < > " ' for fields that allow limited HTML but need to prevent XSS.

All operations are zero-dependency regular expressions and string methods. They run on every insert and update, before validation checks, so your database only ever sees clean data.`,
        example: `interface ForumPost {
  id: number;
  // @sanitize:trim;@sanitize:stripTags
  title: string;
  // @sanitize:trim;@sanitize:escape
  body: string;
  // @sanitize:trim;@sanitize:lower
  slug: string;
}

// Input: title = "  Hello <script>alert('xss')</script>  "
// Stored: "Hello alert('xss')"

// Input: body = "<b>Hello</b> & <i>World</i>"
// Stored: "&lt;b&gt;Hello&lt;/b&gt; &amp; &lt;i&gt;World&lt;/i&gt;"

// Input: slug = "  My Post Title  "
// Stored: "my post title"`,
      },
    ],
  },
  {
    category: 'Expiry & Audit',
    color: 'rgba(168, 85, 247, 0.08)',
    border: 'rgba(168, 85, 247, 0.2)',
    items: [
      {
        name: '@expires',
        summary: "Auto-expire values. Supports Nd (days), Nh (hours), Nm (minutes). On read, expired values return null. On query, auto-adds WHERE expires_at > now(). Can also reference another timestamp field.",
        scenario: `Your app sends password reset emails with a token that must expire in 1 hour. You also issue email verification links that expire in 7 days. And you issue short-lived session tokens that expire in 15 minutes.

With @expires, each field carries its own expiry duration. The ORM transparently filters expired rows from query results — a leaked password reset link from 3 hours ago simply returns null when someone clicks it. You don't need a cron job to purge expired tokens; they're automatically invisible.`,
        example: `interface PasswordReset {
  id: number;
  userId: number;
  // @token;@hash;@expires:1h
  token: string;
  createdAt: string;
}

interface EmailVerification {
  id: number;
  userId: number;
  // @token;@hash;@expires:7d
  code: string;
  createdAt: string;
}

// 3 hours later — expired
const reset = await PasswordReset.get({ userId: 5 });
// reset === null (expired tokens filtered automatically)

// Within 1 hour — valid
const valid = await PasswordReset.get({ userId: 5 });
// valid.token exists and can be verified`,
      },
      {
        name: '@cuid',
        summary: "Create/Update/Delete user audit. Reads ctx.userId from the ORM context (propagated via withContext()). Variants: @cuid:create (set on insert), @cuid:update (set on update), @cuid:delete (set on soft-delete).",
        scenario: `Your enterprise app needs an audit trail: who created this order? Who last modified it? Who soft-deleted it? You already track timestamps via createdAt/updatedAt — now you need the userId that performed each action.

Mark createdBy with @cuid:create, updatedBy with @cuid:update, deletedBy with @cuid:delete. Before each operation, set the context: await orm.withContext({ userId: currentUser.id }). SlintORM automatically fills the audit fields — no manual plumbing in every route handler.`,
        example: `interface Order {
  id: number;
  total: number;
  // @cuid:create
  createdBy: number;
  // @cuid:update
  updatedBy: number;
  // @cuid:delete
  deletedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

// In your route handler:
await orm.withContext({ userId: req.user.id });

// These automatically set createdBy and updatedBy:
const order = await Order.insert({ total: 299.99 });
// order.createdBy === req.user.id

await Order.update({ id: order.id }, { total: 349.99 });
// order.updatedBy === req.user.id`,
      },
      {
        name: '@tenant / @owner',
        summary: "Multi-tenant and row-ownership annotations. @tenant auto-filters all queries by ctx.tenantId and auto-sets on insert. @owner auto-sets to ctx.userId on insert and filters reads. .asAdmin() bypasses the owner filter.",
        scenario: `You run a B2B platform with 500+ companies (tenants). Every table has a tenant_id column. Every query must filter by the current tenant to prevent cross-tenant data leaks. You also have user-scoped data (drafts, personal notes) that only the owner should see.

With @tenant, SlintORM transparently adds WHERE tenant_id = ? to every query and auto-fills the field on insert — zero chance of forgetting the filter. With @owner, personal data is automatically scoped to the current user. Admins can bypass the owner filter with .asAdmin().`,
        example: `interface Project {
  id: number;
  // @tenant — auto-filtered and auto-set
  tenantId: number;
  name: string;
  // @owner — scoped to current user
  ownerId: number;
  createdAt: string;
}

// User sees only their tenant's projects:
const projects = await Project.getAll();
// SQL: SELECT * FROM projects WHERE tenant_id = ?

// User sees only their own drafts:
const drafts = await Project.query()
  .where("name", "ILIKE", "%draft%")
  .get();
// SQL: SELECT * FROM projects WHERE name ILIKE ?
//      AND tenant_id = ? AND owner_id = ?

// Admin overrides owner filter:
const all = await Project.query()
  .asAdmin()
  .get();`,
      },
    ],
  },
  {
    category: 'Relationship Shortcuts & Validation',
    color: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
    items: [
      {
        name: '@belongsTo / @hasMany / @hasOne / @belongsToMany',
        summary: "Concise relationship shortcuts. @belongsTo:Model = @relation manytoone:Model. @hasMany:Model = @relation onetomany:Model. @hasOne:Model = @relation onetoone:Model. @belongsToMany:Model = @relation manytomany:Model.",
        scenario: `Your team finds @relation manytoone:User;foreignKey:userId too verbose for everyday use. You want Laravel/ActiveRecord-style shortcuts that say exactly what the relationship is in one word.

Instead of remembering the exact @relation syntax, you write @belongsTo:User and SlintORM infers everything: the kind (manytoone), the foreign key (userId), and the target model (User). One annotation, zero configuration for standard conventions.`,
        example: `interface Post {
  id: number;
  title: string;
  userId: number;
  // @belongsTo:User — infers manytoone, fk: userId
  user?: User;
  // @hasMany:Comment — infers onetomany, fk: postId
  comments?: Comment[];
}

interface Profile {
  id: number;
  userId: number;
  // @hasOne:User — infers onetoone, fk: userId
  user?: User;
}

interface Team {
  id: number;
  name: string;
  // @belongsToMany:User — infers manytomany, pivot: team_users
  members?: User[];
}`,
      },
      {
        name: 'Cross-model relation validation',
        summary: "When the schema initializes, every @belongsTo/@hasMany/@relation is validated against its target model. If model A references model B but B has no inverse relation, a warning or error is emitted.",
        scenario: `You defined a Post model with @belongsTo:User but forgot to add @hasMany:Post (or @relation onetomany:Post) on the User model. Your eager-loading code silently fails at runtime when you try Post.user.preload("comments") — wasting hours of debugging.

With cross-model validation, SlintORM checks every relation at schema load time. It detects that User has no inverse relation to Post and warns you immediately, pointing to the exact file and line. In strict mode, your app refuses to start until every relation has a matching inverse.`,
        example: `// models.ts
interface Post {
  id: number;
  userId: number;
  // @belongsTo:User — OK
  user?: User;
}

interface User {
  id: number;
  name: string;
  // MISSING: @hasMany:Post  ← SlintORM warns:
  // "Post.user -> User has no inverse relation for Post"
}`,
      },
    ],
  },
  {
    category: 'Composite: @secret',
    color: 'rgba(0, 0, 0, 0.06)',
    border: 'rgba(0, 0, 0, 0.12)',
    items: [
      {
        name: '@secret',
        summary: "Composite annotation that combines @hash + @omitjson + log-masking. One annotation = hash on write, never returned in queries, never logged. Ideal for API keys, client secrets, OAuth tokens, webhook signing secrets.",
        scenario: `You generate API keys for developers: "sk_live_abc123...". This value must be:
1. Hashed in the database (so a breach doesn't leak keys)
2. Never returned by any query (so your list-all-keys admin endpoint doesn't accidentally expose them)
3. Never written to query logs (so your debug logs don't contain secrets)

@secret is the single-annotation solution. It hashes the value with @hash, strips it from query results with @omitjson, and the ORM logger redacts the field from its SQL log output. The raw value is returned exactly once — on the insert response — and never again.`,
        example: `interface DeveloperKey {
  id: number;
  teamId: number;
  // @secret — hashed, never returned, never logged
  apiKey: string;
  createdAt: string;
}

// Create: raw key returned ONCE
const key = await DeveloperKey.insert({ teamId: 1 });
console.log(key.apiKey); // "sk_live_a1b2c3d4..." ← copy this now!

// Any subsequent read:
const stored = await DeveloperKey.get({ teamId: 1 });
console.log(stored.apiKey); // undefined (stripped by @omitjson)

// Verify against the hash:
const match = stored.apiKey.verify("sk_live_a1b2c3d4...");
// true (the hash is retrievable internally, just not serialized)`,
      },
    ],
  },
  {
    category: 'Data Lifecycle & DDL',
    color: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.2)',
    items: [
      {
        name: '@slug:sourceField',
        summary: "Auto-generate a URL-friendly slug from another field on insert. Uses simple string transformation (lowercase, hyphenate, strip special chars) — zero dependencies.",
        scenario: `Your blog platform needs URL slugs: "My First Blog Post!" → "my-first-blog-post". You could generate this in application code, but every code path (REST API, GraphQL, admin panel, import script) would need the same logic. One forgotten path creates inconsistent slugs.

With @slug:title on the slug field, SlintORM automatically generates the slug from the title field on every insert. The logic is built-in and runs on every write path. If the title changes, re-generate with .regenerateSlug().`,
        example: `interface BlogPost {
  id: number;
  title: string;
  // @slug:title — auto-generated from title field
  slug: string;
  body: string;
}

const post = await BlogPost.insert({
  title: "My First Blog Post!",
  body: "Hello world",
});
console.log(post.slug); // "my-first-blog-post"`,
      },
      {
        name: '@counterCache:relation.field',
        summary: "Auto-manage counter caches. When a related record is created/deleted, the counter on the parent is automatically incremented/decremented.",
        scenario: `Your forum shows a comment count next to every post title. You could COUNT(*) on every page load, but that's slow at scale. You could use Redis, but now you have two data stores. You need a simple, transactional counter that always matches reality.

@counterCache on the post's commentsCount field automatically increments when a comment is created and decrements when one is deleted. The counter lives in the same database, same transaction — always consistent. No separate cache, no race conditions.`,
        example: `interface Post {
  id: number;
  title: string;
  // @counterCache:Comment.postId — auto-managed
  commentsCount: number;
}

interface Comment {
  id: number;
  postId: number;
  body: string;
}

await Comment.insert({ postId: 1, body: "Great post!" });
// Post.commentsCount for post 1 is now 1

await Comment.delete({ id: 1 });
// Post.commentsCount for post 1 is now 0`,
      },
      {
        name: '@fulltext / @spatial / @partialIndex',
        summary: "Advanced index types: FTS (full-text search), GiST/GIN (spatial/JSON), partial/conditional indexes (WHERE clause on the index).",
        scenario: `You need to search blog posts by title and body with ranking (relevance order). A regular b-tree index won't help with LIKE '%term%' queries. You need a full-text search (FTS) index.

@fulltext on title and body creates an FTS index that supports MATCH ... AGAINST (MySQL/Postgres) or FTS5 virtual table (SQLite). @spatial on a coordinates field creates a GiST index for radius queries. @partialIndex:WHERE active=1 creates an index that only includes active records — smaller, faster, more efficient.`,
        example: `interface BlogPost {
  id: number;
  // @fulltext
  title: string;
  // @fulltext
  body: string;
  // @spatial
  location: string;
  // @partialIndex:WHERE active = 1
  active: boolean;
}

// Full-text search with ranking:
const results = await BlogPost.query()
  .whereRaw("MATCH (title, body) AGAINST (? IN BOOLEAN MODE)", ["search terms"])
  .orderBy("rank")
  .get();`,
      },
    ],
  },
];

export default function UpcomingFeaturesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Upcoming Features</h1>
      <p style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
        A preview of annotations and features planned for upcoming SlintORM releases.
        Every feature listed here has <strong>zero external dependencies</strong> —
        built entirely on Node.js built-in <code style={{ fontSize: '0.9em' }}>crypto</code> and standard library modules.
      </p>
      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
          Work in progress
        </strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          These features are being implemented in batches of 3 per day.
          Check the <a href="/docs/changelog" style={{ color: 'var(--color-accent)' }}>changelog</a> for release status.
          Have a suggestion? Open an issue on GitHub.
        </p>
      </div>

      {annotationSections.map((section) => (
        <div key={section.category} style={{ marginBottom: '3rem' }}>
          <h2 style={{
            marginBottom: '1.5rem',
            paddingBottom: '0.5rem',
            borderBottom: `2px solid ${section.border}`,
          }}>
            {section.category}
          </h2>

          {section.items.map((item) => (
            <div key={item.name} style={{
              background: section.color,
              border: `1px solid ${section.border}`,
              borderRadius: '10px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
              }}>
                <code style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {item.name}
                </code>
              </div>

              <p style={{
                color: 'var(--color-fg-muted)',
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}>
                {item.summary}
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.15)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                marginBottom: '1rem',
                fontStyle: 'italic',
                color: 'var(--color-fg-muted)',
                fontSize: '0.9rem',
                border: '1px dashed var(--color-border)',
              }}>
                <strong style={{ color: 'var(--color-fg)', fontStyle: 'normal' }}>Real-life scenario</strong>
                <p style={{ marginTop: '0.25rem', lineHeight: 1.6 }}>
                  {item.scenario}
                </p>
              </div>

              <CodeBlock code={item.example} language="typescript" />
            </div>
          ))}
        </div>
      ))}
    </DocLayout>
  );
}
