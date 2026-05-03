export type TaskType =
  | "code"
  | "ui"
  | "api"
  | "arch"
  | "debug"
  | "analysis"
  | "writing"
  | "data";

export type PromptStyle = "ask" | "agent" | "chain" | "structured";

export type OptimizationGoal =
  | "token"
  | "accuracy"
  | "deterministic"
  | "creative";

export type GroqModel =
  | "llama-3.3-70b-versatile"
  | "llama-3.1-8b-instant"
  | "mixtral-8x7b-32768"
  | "gemma2-9b-it"
  | "llama3-70b-8192";

export interface OptimizeRequest {
  intent: string;
  style: PromptStyle;
  goal: OptimizationGoal;
  taskType: TaskType;
  model: GroqModel;
  techStack?: string;
  constraints?: string;
}

export interface OptimizeResponse {
  optimizedPrompt: string;
  tokenEstimate: number;
}

export const TASK_LABELS: Record<TaskType, string> = {
  code: "Code Generation",
  ui: "UI Generation",
  api: "API Design",
  arch: "Architecture",
  debug: "Debugging",
  analysis: "Analysis",
  writing: "Writing",
  data: "Data Processing",
};

export const GOAL_DESCRIPTIONS: Record<OptimizationGoal, string> = {
  token: "Minimize tokens without losing meaning. Remove filler, be terse.",
  accuracy:
    "Maximize precision. Add explicit format constraints and examples.",
  deterministic:
    "Use temp=0 framing. Specify exact output schema with zero ambiguity.",
  creative:
    "Encourage exploratory generation while maintaining structure.",
};

export const STYLE_GUIDES: Record<PromptStyle, string> = {
  ask: "Single-turn instruction. Lead with action verb. End with output format spec.",
  agent:
    "Multi-step with THOUGHT/ACTION/RESULT loop. Include tool access hints.",
  chain: "Instruct step-by-step reasoning before the final answer.",
  structured: "Demand JSON/XML output only. Define schema inline.",
};

export const GROQ_MODELS: { value: GroqModel; label: string; badge: string }[] = [
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", badge: "Recommended" },
  { value: "llama3-70b-8192",         label: "Llama 3 70B",   badge: "Fast" },
  { value: "llama-3.1-8b-instant",    label: "Llama 3.1 8B",  badge: "Instant" },
  { value: "mixtral-8x7b-32768",      label: "Mixtral 8x7B",  badge: "32K ctx" },
  { value: "gemma2-9b-it",            label: "Gemma 2 9B",    badge: "Google" },
];
