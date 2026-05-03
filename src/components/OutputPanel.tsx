"use client";

import { useState } from "react";

interface OutputPanelProps {
  text: string;
  streaming: boolean;
  tokenEstimate: number | null;
}

export function OutputPanel({ text, streaming, tokenEstimate }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!text && !streaming) return null;

  return (
    <div className="animate-fade-up" style={{ marginTop: "24px" }}>
      <div
        style={{
          height: "0.5px",
          background: "var(--border)",
          marginBottom: "20px",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            Optimized Prompt
          </span>
          {tokenEstimate !== null && !streaming && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              ~{tokenEstimate} tokens
            </span>
          )}
          {streaming && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  animation: "blink 0.75s step-end infinite",
                }}
              />
              streaming
            </span>
          )}
        </div>
        {!streaming && text && (
          <button
            onClick={handleCopy}
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: "11px",
              fontWeight: 500,
              padding: "4px 12px",
              borderRadius: "100px",
              border: "0.5px solid var(--border-md)",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        )}
      </div>

      <div
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "12.5px",
          lineHeight: "1.7",
          color: "var(--text-primary)",
          background: "var(--bg-surface)",
          border: "0.5px solid var(--border)",
          borderRadius: "10px",
          padding: "18px 20px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: "80px",
          position: "relative",
        }}
      >
        {text}
        {streaming && (
          <span
            className="cursor-blink"
            style={{ color: "var(--text-secondary)" }}
          >
            ▋
          </span>
        )}
      </div>
    </div>
  );
}
