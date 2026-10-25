import { describe, expect, it } from "vitest";

import { formatWahaReply, wahaWebhookSchema } from "./waha";

const validPayload = {
	event: "message",
	payload: {
		from: "60123456789@c.us",
		body: "Halo, ada homestay di Kuala Lumpur?",
	},
};

describe("WAHA Webhook Validation", () => {
	it("accepts a valid WAHA message", () => {
		const result = wahaWebhookSchema.safeParse(validPayload);

		expect(result.success).toBe(true);
	});

	it("rejects a missing sender", () => {
		const result = wahaWebhookSchema.safeParse({
			...validPayload,
			payload: {
				...validPayload.payload,
				from: "",
			},
		});

		expect(result.success).toBe(false);
	});

	it("rejects an empty message", () => {
		const result = wahaWebhookSchema.safeParse({
			...validPayload,
			payload: {
				...validPayload.payload,
				body: "   ",
			},
		});

		expect(result.success).toBe(false);
	});

	it("rejects a missing payload", () => {
		const result = wahaWebhookSchema.safeParse({
			event: "message",
		});

		expect(result.success).toBe(false);
	});
});

describe("WAHA Reply Formatting", () => {
	it("returns the expected to and reply fields", () => {
		const result = formatWahaReply("60123456789@c.us", "Hello MyRehat!");

		expect(result).toEqual({
			to: "60123456789@c.us",
			reply: "Hello MyRehat!",
		});
	});

	it("trims unnecessary whitespace", () => {
		const result = formatWahaReply("60123456789@c.us", "  Hello MyRehat!  ");

		expect(result.reply).toBe("Hello MyRehat!");
	});
});
