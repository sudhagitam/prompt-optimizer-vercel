import {
  OptimizeRequest,
  TASK_LABELS,
  GOAL_DESCRIPTIONS,
  STYLE_GUIDES,
} from "@/types";

export function buildSystemPrompt(): string {
  return `You are a world-class Prompt Optimization Engine. Transform raw user intent into a production-ready, low-token, high-accuracy LLM prompt.

RULES:
- Remove all filler words; be maximally terse
- Preserve all semantic meaning
- Structure: ROLE → TASK → CONSTRAINTS → OUTPUT FORMAT
- Use markdown sparingly, only where structure aids clarity
- Include concrete output format spec (JSON schema, markdown structure, or plain spec)
- Never explain what you're doing — output ONLY the optimized prompt
- For agent/chain styles, include the reasoning loop structure inline`;
}

export function buildUserMessage(req: OptimizeRequest): string {
  const taskLabel = TASK_LABELS[req.taskType];
  const goalDesc = GOAL_DESCRIPTIONS[req.goal];
  const styleGuide = STYLE_GUIDES[req.style];

  let msg = `Transform this into an optimized ${req.style}-style prompt for ${taskLabel}.

OPTIMIZATION GOAL: ${goalDesc}
STYLE: ${styleGuide}
TASK TYPE: ${taskLabel}

USER INTENT: ${req.intent}`;

  if (req.techStack) msg += `\nTECH STACK: ${req.techStack}`;
  if (req.constraints) msg += `\nCONSTRAINTS: ${req.constraints}`;

  msg += `\n\nReturn ONLY the optimized prompt. No preamble, no explanation.`;
  return msg;
}

export function estimateTokens(text: string): number {
  return Math.round(text.split(/\s+/).filter(Boolean).length * 1.35);
}
