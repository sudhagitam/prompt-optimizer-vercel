import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { OptimizeRequest } from "@/types";
import { buildSystemPrompt, buildUserMessage } from "@/lib/promptBuilder";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "GROQ_API_KEY is not set. Copy .env.local.example → .env.local and add your key from console.groq.com",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body: OptimizeRequest = await req.json();

    if (!body.intent?.trim()) {
      return new Response(JSON.stringify({ error: "Intent is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new Groq({ apiKey });
    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserMessage(body);

    const stream = await client.chat.completions.create({
      model: body.model ?? "llama-3.3-70b-versatile",
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              const data = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Optimize API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
