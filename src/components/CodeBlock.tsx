import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const displayCode = language === 'json' ? formatJson(code) : code;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="bg-code-bg text-code-text p-4 rounded-lg overflow-x-auto text-sm font-mono">
        <code className="language-json">
          {displayCode.split('\n').map((line, index) => (
            <div key={index} className="table-row">
              <span className="table-cell text-right pr-4 text-muted-foreground/60 select-none">
                {index + 1}
              </span>
              <span className="table-cell">
                {syntaxHighlight(line)}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

const syntaxHighlight = (line: string) => {
  // Simples syntax highlighting para JSON
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: line
          .replace(/(".*?")\s*:/g, '<span class="text-code-string">$1</span>:')
          .replace(/:\s*(".*?")/g, ': <span class="text-code-string">$1</span>')
          .replace(/:\s*(\d+)/g, ': <span class="text-code-number">$1</span>')
          .replace(/:\s*(true|false)/g, ': <span class="text-code-boolean">$1</span>')
          .replace(/:\s*(null)/g, ': <span class="text-muted-foreground">$1</span>')
      }}
    />
  );
};