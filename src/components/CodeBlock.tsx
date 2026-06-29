'use client';
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted');
      hljs.highlightElement(ref.current);
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      {filename && (
        <div style={{
          background: '#0D1B2E',
          borderTop: '1px solid var(--color-border)',
          borderLeft: '1px solid var(--color-border)',
          borderRight: '1px solid var(--color-border)',
          borderRadius: '8px 8px 0 0',
          padding: '0.5rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--color-fg-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          {filename}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <pre style={{
          borderRadius: filename ? '0 0 8px 8px' : '8px',
          marginBottom: 0,
        }}>
          <code ref={ref} className={`language-${language}`} data-language={language}>
            {code.trim()}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(45, 63, 87, 0.8)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: copied ? 'var(--color-accent)' : 'var(--color-fg-muted)',
            cursor: 'pointer',
            padding: '0.35rem 0.6rem',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            transition: 'all 200ms',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
