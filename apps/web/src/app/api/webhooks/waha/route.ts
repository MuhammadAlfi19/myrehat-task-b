import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

import { formatWahaReply, wahaWebhookSchema } from "./waha";

export async function POST(request: Request) {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const result = wahaWebhookSchema.safeParse(body);

	if (!result.success) {
		return Response.json({ error: "Invalid WAHA payload" }, { status: 400 });
	}

	const apiKey = process.env.OPENROUTER_API_KEY;

	if (!apiKey) {
		return Response.json(
			{ error: "AI service is not configured" },
			{ status: 503 },
		);
	}

	try {
		const openrouter = createOpenRouter({ apiKey });

		const { text } = await generateText({
			model: openrouter(process.env.OPENROUTER_MODEL || "openrouter/free"),
			system:
				"You are MyRehat's helpful homestay concierge. " +
				"Answer questions about homestay booking clearly and politely. " +
				"Do not invent property availability, prices, or booking confirmations. " +
				"Respond in the same language as the customer.",
			prompt: result.data.payload.body,
		});

		return Response.json(formatWahaReply(result.data.payload.from, text));
	} catch (error) {
		console.error("WAHA AI generation failed", error);

		return Response.json(
			{ error: "Unable to generate reply" },
			{ status: 502 },
		);
	}
}
