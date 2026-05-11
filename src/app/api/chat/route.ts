import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAgentById } from "@/lib/agents";
import type { ChatRequest, ChatResponse } from "@/types";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { agentId, messages, sessionId } = body;

    // Validate agent
    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: "Invalid agent ID" },
        { status: 400 }
      );
    }

    // Convert to Anthropic message format
    const anthropicMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: agent.systemPrompt,
      messages: anthropicMessages,
    });

    // Extract text from response
    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Sorry, I couldn't generate a response.";

    // Generate or reuse session ID
    const newSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result: ChatResponse = {
      message: assistantMessage,
      sessionId: newSessionId,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
