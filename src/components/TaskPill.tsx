"use client";

import { TaskType, TASK_LABELS } from "@/types";

interface TaskPillProps {
  value: TaskType;
  selected: boolean;
  onClick: (val: TaskType) => void;
}

export function TaskPill({ value, selected, onClick }: TaskPillProps) {
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        fontFamily: "var(--font-syne)",
        fontSize: "12px",
        fontWeight: 500,
        padding: "5px 13px",
        borderRadius: "100px",
        border: selected
          ? "0.5px solid var(--border-strong)"
          : "0.5px solid var(--border)",
        background: selected ? "var(--accent)" : "transparent",
        color: selected ? "#0a0a0b" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.15s",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {TASK_LABELS[value]}
    </button>
  );
}

interface TaskPillGroupProps {
  selected: TaskType;
  onChange: (val: TaskType) => void;
}

export function TaskPillGroup({ selected, onChange }: TaskPillGroupProps) {
  const tasks = Object.keys(TASK_LABELS) as TaskType[];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {tasks.map((t) => (
        <TaskPill key={t} value={t} selected={selected === t} onClick={onChange} />
      ))}
    </div>
  );
}
