import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@encrypt — SlintORM Annotations',
  description: 'AES-256-GCM encryption annotation for SlintORM — .decrypt() method, automatic transparent decryption, and key configuration.',
  alternates: { canonical: '/docs/annotations/encrypt' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@encrypt</code> — AES-256-GCM Encryption</h1>
      <p>Two-way encryption using AES-256-GCM via the Web Crypto API. Key derived per-field via PBKDF2 from the master <code>encryptionKey</code>. Exposes a <code>.decrypt()</code> method on read, or transparent auto-decryption with <code>:(decrypt=auto)</code>.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// Manual decryption — raw ciphertext with .decrypt()
// @encrypt
encrypted?: string;

// Auto-decrypted on read — returns plain string
// @encrypt:(decrypt=auto)
autoDecrypted?: string;`} filename="src/interfaces.ts" />

      <h2>Config Requirement</h2>
      <CodeBlock code={`const orm = new ORMManager({
  // ...
  encryptionKey: process.env.ENCRYPTION_KEY, // min 32 characters
});`} filename="src/db.ts" />

      <h2>Stored Format</h2>
      <CodeBlock code={`aes256gcm$<iterations>$<iv>$<ciphertext>$<authTag>
// Example:
aes256gcm$600000$rb9p9H35g0XdRRYA$lNbL7X2zLtGe0duz+xI=$DQsjtq10eZgOP7M/0XZ9YA==`} filename="(database column value)" />

      <ul>
        <li><strong>iterations</strong> — PBKDF2 iterations used for key derivation (inline-encoded for future-proofing)</li>
        <li><strong>iv</strong> — 12-byte random nonce, base64-encoded</li>
        <li><strong>ciphertext</strong> — AES-256-GCM encrypted payload</li>
        <li><strong>authTag</strong> — 16-byte GCM authentication tag</li>
      </ul>

      <h2>Usage</h2>
      <CodeBlock code={`// Insert — auto-encrypted before write
await User.insert({
  name: "Alice",
  encrypted: "sensitive-data",
});

// Fetch — raw ciphertext with .decrypt()
const user = await User.get({ name: "Alice" });
console.log(user.encrypted);
// "aes256gcm$600000$..."

const plaintext = await user.encrypted.decrypt();
console.log(plaintext);
// "sensitive-data"`} filename="src/auth.ts" />

      <h2>Auto-decrypt variant</h2>
      <CodeBlock code={`// Interface
// @encrypt:(decrypt=auto)
autoDecrypted?: string;

// Usage — transparent, reads as plain string
const user = await User.get({ name: "Alice" });
console.log(user.autoDecrypted);
// "auto-decrypted-value" (plain string, no .decrypt() needed)`} filename="src/auth.ts" />

      <h2>Errors</h2>
      <table>
        <thead>
          <tr>
            <th>Error</th>
            <th>Cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>[@encrypt] field "X" requires encryptionKey in ORMManager config</code></td>
            <td>Missing <code>encryptionKey</code> option</td>
            <td>Set <code>encryptionKey</code> (min 32 chars) in the ORM constructor</td>
          </tr>
          <tr>
            <td><code>Expected 'aes256gcm$iv$ct$tag' format, got '...'</code></td>
            <td>Stored value doesn't start with <code>aes256gcm$</code></td>
            <td>Verify the column was written by @encrypt</td>
          </tr>
          <tr>
            <td><code>[@encrypt] failed to decrypt field "X": ...</code></td>
            <td>Decryption failure (wrong key, tampered data, format mismatch)</td>
            <td>Check encryptionKey matches the one used at write time</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li><code>encryptionKey</code> must be at least 32 characters — store in <code>ENCRYPTION_KEY</code> env var</li>
        <li>Use manual <code>.decrypt()</code> when you need lazy/conditional decryption</li>
        <li>Use <code>:(decrypt=auto)</code> for fields that are always read in plaintext</li>
        <li>The key is derived per-field (<code>PBKDF2(masterKey, fieldName)</code>), so each field uses a unique encryption key</li>
        <li>Key derivation is memoized in a <code>Map</code> — repeated encrypt/decrypt on the same field reuse the cached <code>CryptoKey</code></li>
      </ul>

      <h2>Gotcha: <code>.decrypt()</code> returns a wrapper object</h2>
      <p>The field value at runtime is not a plain string — it's an object with <code>.decrypt()</code>, <code>.toString()</code>, <code>.valueOf()</code>, and <code>[Symbol.toPrimitive]()</code>. This means:</p>
      <ul>
        <li><code>typeof field === "string"</code> is <code>false</code> (it's <code>"object"</code>)</li>
        <li><code>field === "plaintext"</code> is <code>false</code> even if the decrypted value matches</li>
        <li><strong>Template literals and string concatenation work fine</strong> (<code>`${field}`</code>, <code>"" + field</code>) — these trigger <code>toString()</code></li>
        <li><strong>Comparison trick:</strong> <code>String(field) === "plaintext"</code> or <code>field.toString() === "plaintext"</code></li>
      </ul>

      <h2>See also</h2>
      <ul>
        <li><a href="/docs/annotations/hash"><code>@hash</code> — one-way hashing</a></li>
        <li><a href="/docs/annotations/secret"><code>@secret</code> — @hash + @omitjson composite</a></li>
      </ul>
    </DocLayout>
  );
}
