import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

vi.mock("@openrouter/ai-sdk-provider", () => ({
	createOpenRouter: vi.fn(() => () => "mock-model"),
}));

vi.mock("ai", () => ({
	generateText: vi.fn(),
}));

const webhookUrl = "http://localhost:3001/api/webhooks/waha";

function createRequest(body: unknown) {
	return new Request(webhookUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
}

const validPayload = {
	event: "message",
	payload: {
		from: "60123456789@c.us",
		body: "Ada homestay di Kuala Lumpur?",
	},
};

const originalApiKey = process.env.OPENROUTER_API_KEY;

beforeEach(() => {
	vi.clearAllMocks();
	process.env.OPENROUTER_API_KEY = "test-openrouter-key";
});

afterEach(() => {
	if (originalApiKey === undefined) {
		delete process.env.OPENROUTER_API_KEY;
	} else {
		process.env.OPENROUTER_API_KEY = originalApiKey;
	}
});

describe("WAHA Webhook POST", () => {
	it("returns an AI-generated reply", async () => {
		vi.mocked(generateText).mockResolvedValue({
			text: "Hello! How can I help you?",
		} as never);

		const response = await POST(createRequest(validPayload));

		expect(response.status).toBe(200);

		expect(await response.json()).toEqual({
			to: "60123456789@c.us",
			reply: "Hello! How can I help you?",
		});

		expect(createOpenRouter).toHaveBeenCalledWith({
			apiKey: "test-openrouter-key",
		});

		expect(generateText).toHaveBeenCalledOnce();
	});

	it("rejects invalid webhook payload without calling AI", async () => {
		const response = await POST(
			createRequest({
				event: "message",
				payload: {
					from: "",
					body: "",
				},
			}),
		);

		expect(response.status).toBe(400);
		expect(generateText).not.toHaveBeenCalled();
	});

	it("returns 503 when OpenRouter is not configured", async () => {
		delete process.env.OPENROUTER_API_KEY;

		const response = await POST(createRequest(validPayload));

		expect(response.status).toBe(503);
		expect(generateText).not.toHaveBeenCalled();
	});

	it("returns 502 when AI generation fails", async () => {
		vi.mocked(generateText).mockRejectedValue(
			new Error("Mock AI service unavailable"),
		);

		const response = await POST(createRequest(validPayload));

		expect(response.status).toBe(502);
	});
});
