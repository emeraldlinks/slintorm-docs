import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@polymorphicType / @polymorphicId — SlintORM Annotations',
  description: 'Polymorphic association annotations for SlintORM — morphTo, morphMany, and commentable/imageable patterns.',
  alternates: { canonical: '/docs/annotations/polymorphic' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@polymorphicType</code> / <code>@polymorphicId</code></h1>
      <p>Declares polymorphic associations — a single model that can belong to multiple other models. Common patterns: comments on posts <em>or</em> users, images on products <em>or</em> reviews, likes on any content.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`interface Comment {
  id: number;
  body: string;
  // @polymorphicType — stores the related model name (e.g. "Post", "User")
  commentableType: string;
  // @polymorphicId — stores the related record's primary key
  commentableId: number;
  createdAt: string;
  updatedAt: string;
}`} filename="src/interfaces.ts" />

      <h2>Usage</h2>
      <CodeBlock code={`// Create polymorphic comments
await Comment.insert({
  body: "Great post!",
  commentableType: "Post",
  commentableId: postId,
});
await Comment.insert({
  body: "Nice user!",
  commentableType: "User",
  commentableId: userId,
});

// Resolve the parent — morphTo()
const comment = await Comment.get({ id: 1 });
const parent = await Comment.morphTo();
// Returns the Post or User instance that this comment belongs to

// The morphTo method reads commentableType + commentableId,
// looks up the matching model, and returns the related record.`} filename="src/auth.ts" />

      <h2>How It Works</h2>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Annotation</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>commentableType</code></td>
            <td><code>@polymorphicType</code></td>
            <td>Stores the model name (e.g. <code>"Post"</code>, <code>"User"</code>)</td>
          </tr>
          <tr>
            <td><code>commentableId</code></td>
            <td><code>@polymorphicId</code></td>
            <td>Stores the related record's primary key value</td>
          </tr>
        </tbody>
      </table>

      <p>The schema generator detects both annotations and registers the polymorphic relationship. <code>morphTo()</code> uses the type + id to dynamically resolve the parent model at runtime.</p>

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
            <td><code>Unknown polymorphic type: "X"</code></td>
            <td><code>commentableType</code> value doesn't match any defined model</td>
            <td>Ensure the type value matches a model name exactly</td>
          </tr>
          <tr>
            <td><code>Polymorphic id is null</code></td>
            <td><code>commentableId</code> is <code>NULL</code> in the database</td>
            <td>Always provide both type and id together</td>
          </tr>
          <tr>
            <td><code>morphTo() returned null</code></td>
            <td>The referenced record doesn't exist (deleted or invalid id)</td>
            <td>Use optional chaining: <code>const parent = await comment.morphTo()</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Name the type field as <code>&lt;relation&gt;Type</code> and the id field as <code>&lt;relation&gt;Id</code> (e.g. <code>imageableType</code> + <code>imageableId</code>, <code>likableType</code> + <code>likableId</code>)</li>
        <li>The type value must match a registered model name exactly (case-sensitive)</li>
        <li>Polymorphic relations don't use foreign key constraints — the referenced record could be deleted</li>
        <li>Always check if <code>morphTo()</code> returns <code>null</code> — the parent may have been deleted</li>
      </ul>
    </DocLayout>
  );
}
