"use client";

import { useState } from "react";
import {
  TaskType, PromptStyle, OptimizationGoal, GroqModel,
  OptimizeRequest, GROQ_MODELS,
} from "@/types";
import { estimateTokens } from "@/lib/promptBuilder";
import { TaskPillGroup } from "./TaskPill";
import { OutputPanel } from "./OutputPanel";
import { FieldLabel, SectionSep } from "./Field";

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-syne)",
  fontSize: "13px",
  color: "var(--text-primary)",
  background: "var(--bg-surface)",
  border: "0.5px solid var(--border)",
  borderRadius: "8px",
  padding: "10px 13px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.15s",
  resize: "none" as const,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  paddingRight: "32px",
};

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <svg
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        width="10" height="6" viewBox="0 0 10 6" fill="none"
      >
        <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function OptimizerForm() {
  const [intent, setIntent] = useState("");
  const [style, setStyle] = useState<PromptStyle>("ask");
  const [goal, setGoal] = useState<OptimizationGoal>("token");
  const [taskType, setTaskType] = useState<TaskType>("code");
  const [model, setModel] = useState<GroqModel>("llama-3.3-70b-versatile");
  const [techStack, setTechStack] = useState("");
  const [constraints, setConstraints] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [tokenEstimate, setTokenEstimate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!intent.trim()) return;
    setOutput("");
    setTokenEstimate(null);
    setError(null);
    setStreaming(true);

    const body: OptimizeRequest = {
      intent,
      style,
      goal,
      taskType,
      model,
      techStack: techStack || undefined,
      constraints: constraints || undefined,
    };

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                full += parsed.text;
                setOutput(full);
              }
            } catch {}
          }
        }
      }

      setTokenEstimate(estimateTokens(full));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStreaming(false);
    }
  };

  const selectedModelInfo = GROQ_MODELS.find((m) => m.value === model);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <p style={{
            fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--text-tertiary)",
          }}>
            Prompt Optimization Engine
          </p>
          <span style={{
            fontSize: "10px", fontWeight: 500, padding: "2px 8px",
            borderRadius: "100px", border: "0.5px solid #1a3a2a",
            background: "#0d1f16", color: "#4ade80", letterSpacing: "0.06em",
          }}>
            Powered by Groq
          </span>
        </div>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15,
        }}>
          Raw intent →{" "}
          <span style={{ color: "var(--text-secondary)" }}>Production prompt</span>
        </h1>
      </div>

      {/* Model selector */}
      <div style={{ marginBottom: "16px" }}>
        <FieldLabel>Groq model</FieldLabel>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {GROQ_MODELS.map((m) => (
            <button
              key={m.value}
              onClick={() => setModel(m.value)}
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: "12px",
                fontWeight: 500,
                padding: "7px 13px",
                borderRadius: "8px",
                border: model === m.value ? "0.5px solid #4ade80" : "0.5px solid var(--border)",
                background: model === m.value ? "#0d1f16" : "var(--bg-surface)",
                color: model === m.value ? "#4ade80" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "flex-start",
                gap: "1px",
              }}
            >
              <span>{m.label}</span>
              <span style={{
                fontSize: "10px",
                color: model === m.value ? "#22c55e" : "var(--text-tertiary)",
                fontWeight: 400,
              }}>{m.badge}</span>
            </button>
          ))}
        </div>
        {selectedModelInfo && (
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "6px" }}>
            Using <span style={{ color: "var(--text-secondary)" }}>{selectedModelInfo.label}</span> via Groq — ultra-fast inference
          </p>
        )}
      </div>

      {/* Intent */}
      <div style={{ marginBottom: "12px" }}>
        <FieldLabel>User intent *</FieldLabel>
        <textarea
          rows={4}
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Describe what you want the LLM to do…"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--border-strong)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Style + Goal */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <FieldLabel>Output style</FieldLabel>
          <SelectWrapper>
            <select value={style} onChange={(e) => setStyle(e.target.value as PromptStyle)} style={selectStyle}>
              <option value="ask">Ask (single-turn)</option>
              <option value="agent">Agent (multi-step)</option>
              <option value="chain">Chain-of-thought</option>
              <option value="structured">Structured output</option>
            </select>
          </SelectWrapper>
        </div>
        <div>
          <FieldLabel>Optimization goal</FieldLabel>
          <SelectWrapper>
            <select value={goal} onChange={(e) => setGoal(e.target.value as OptimizationGoal)} style={selectStyle}>
              <option value="token">Minimize tokens</option>
              <option value="accuracy">Maximize accuracy</option>
              <option value="deterministic">Deterministic output</option>
              <option value="creative">Creative quality</option>
            </select>
          </SelectWrapper>
        </div>
      </div>

      <SectionSep>Task type</SectionSep>
      <TaskPillGroup selected={taskType} onChange={setTaskType} />

      <SectionSep>Optional context</SectionSep>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <FieldLabel>Tech stack</FieldLabel>
          <textarea
            rows={2}
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. React, TypeScript, Postgres"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--border-strong)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <div>
          <FieldLabel>Constraints / examples</FieldLabel>
          <textarea
            rows={2}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g. No external libs, max 100 lines"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--border-strong)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "12px", color: "#f87171", marginTop: "10px" }}>
          ⚠ {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={streaming || !intent.trim()}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "13px",
          fontFamily: "var(--font-syne)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          borderRadius: "8px",
          border: streaming || !intent.trim() ? "0.5px solid var(--border)" : "0.5px solid #4ade80",
          background: streaming || !intent.trim() ? "var(--bg-elevated)" : "#0d1f16",
          color: streaming || !intent.trim() ? "var(--text-tertiary)" : "#4ade80",
          cursor: streaming || !intent.trim() ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {streaming ? "Optimizing via Groq…" : "Optimize prompt →"}
      </button>

      <OutputPanel text={output} streaming={streaming} tokenEstimate={tokenEstimate} />
    </div>
  );
}
