"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  category: string;
}

const getLanguage = (category: string): string => {
  switch (category) {
    case "BDFD":
      return "javascript";
    case "AOIJS":
      return "javascript";
    case "JS":
      return "javascript";
    case "ALTYAPI":
      return "javascript";
    default:
      return "javascript";
  }
};

export function CodeBlock({ code, category }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Kopyalandı
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Kopyala
          </>
        )}
      </Button>
      <div className="rounded-lg overflow-hidden border border-border">
        <SyntaxHighlighter
          language={getLanguage(category)}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            padding: "1rem",
          }}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: "#858585",
            userSelect: "none",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
