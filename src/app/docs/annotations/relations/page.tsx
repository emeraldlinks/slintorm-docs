import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@relation / @relationship — SlintORM Annotations',
  description: '@relation and @relationship annotation syntax for SlintORM — one-to-many, many-to-one, one-to-one, many-to-many, and relation shortcuts.',
  alternates: { canonical: '/docs/annotations/relations' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@relation</code> / <code>@relationship</code></h1>
      <p>Declares relationships between models. Both <code>@relation</code> and <code>@relationship</code> are accepted interchangeably. See the <a href="/docs/relations">Relations</a> section for full concept docs.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`@relation <kind>:<Model>[;foreignKey:<col>][;relatedKey:<col>][;through:<table>][;onDelete:CASCADE|SET NULL]`} filename="syntax" />

      <h2>One-to-Many</h2>
      <CodeBlock code={`interface User {
  // @relation onetomany:Post;foreignKey:userId
  posts?: Post[];
}
interface Post {
  userId: number;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}`} filename="src/interfaces.ts" />

      <h2>One-to-One</h2>
      <CodeBlock code={`interface User {
  // @relationship onetoone:Profile;foreignKey:userId
  profile?: Profile;
}
interface Profile {
  // @unique
  userId: number;
  // @relationship onetoone:User;foreignKey:userId;onDelete:CASCADE
  user?: User;
}`} filename="src/interfaces.ts" />

      <h2>Many-to-Many</h2>
      <CodeBlock code={`interface User {
  // @relation manytomany:Team;through:team_members;foreignKey:userId;relatedKey:teamId
  teams?: Team[];
}
interface Team {
  // @relation manytomany:User;through:team_members;foreignKey:teamId;relatedKey:userId
  members?: User[];
}
// Pivot table team_members(userId, teamId) auto-created by migrate()`} filename="src/interfaces.ts" />

      <h2>Relation Shortcuts</h2>
      <CodeBlock code={`// @belongsTo:Model — shortcut for manytoone
// @belongsTo:User
user?: User;

// @hasMany:Model — shortcut for onetomany
// @hasMany:Post
posts?: Post[];

// @hasOne:Model — shortcut for onetoone
// @hasOne:Profile
profile?: Profile;

// @belongsToMany:Model — shortcut for manytomany
// @belongsToMany:Team
teams?: Team[];`} filename="src/interfaces.ts" />

      <h2>Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Param</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>foreignKey</code></td><td>Yes</td><td>Column on the child/many side</td></tr>
          <tr><td><code>relatedKey</code></td><td>Many-to-many</td><td>Column on the related side (default: <code>id</code>)</td></tr>
          <tr><td><code>through</code></td><td>Many-to-many</td><td>Pivot table name</td></tr>
          <tr><td><code>onDelete</code></td><td>No</td><td><code>CASCADE</code> or <code>SET NULL</code> on foreign key</td></tr>
        </tbody>
      </table>

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
            <td><code>Post.user -&gt; User has no inverse relation for Post</code></td>
            <td>One side of a relation is missing the inverse annotation</td>
            <td>Add <code>@relation manytoone:Post</code> on the inverse side</td>
          </tr>
          <tr>
            <td><code>Unknown relation target</code></td>
            <td>Model name doesn't match any known interface</td>
            <td>Check the model name spelling in the annotation</td>
          </tr>
          <tr>
            <td><code>Duplicate interface "User" found</code></td>
            <td>Multiple models have the same name in different files</td>
            <td>Use unique interface names across your project</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Always declare both sides of a relation (inverse) to enable preloading</li>
        <li>Foreign key fields should be <code>number</code> type (or <code>string</code> for UUIDs)</li>
        <li>Use <code>onDelete:CASCADE</code> for strong ownership; <code>onDelete:SET NULL</code> for weak references</li>
        <li>Pivot tables for many-to-many are auto-created by <code>migrate()</code> — no interface needed</li>
        <li>Relation shortcuts (<code>@belongsTo</code>, etc.) are syntactic sugar and produce the same metadata</li>
      </ul>

      <h2>See also</h2>
      <ul>
        <li><a href="/docs/relations">Full Relations Documentation</a> — preloading, filtering, and traversal</li>
      </ul>
    </DocLayout>
  );
}
