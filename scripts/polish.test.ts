import { generateText } from "ai";
import { createOpencode } from "ai-sdk-provider-opencode-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildPolishPrompt, polishDescription } from "./polish";

const { disposeMock } = vi.hoisted(() => ({
	disposeMock: vi.fn(),
}));

vi.mock("ai", () => ({
	generateText: vi.fn(),
}));

vi.mock("ai-sdk-provider-opencode-sdk", () => ({
	createOpencode: vi.fn(() =>
		Object.assign(
			vi.fn(() => "mock-model"),
			{ dispose: disposeMock },
		),
	),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe("AI Description Polish", () => {
	it("rejects empty descriptions", () => {
		expect(() => buildPolishPrompt("   ")).toThrow(
			"Description cannot be empty",
		);
	});

	it("preserves original facts in the prompt", () => {
		const prompt = buildPolishPrompt(
			"Homestay with 2 bedrooms in Kuala Lumpur",
		);

		expect(prompt).toContain("2 bedrooms");
		expect(prompt).toContain("Kuala Lumpur");
		expect(prompt).toContain("Do not invent");
	});

	it("returns a polished description using mocked AI", async () => {
		vi.mocked(generateText).mockResolvedValue({
			text: "Comfortable two-bedroom homestay in Kuala Lumpur.",
		} as never);

		const result = await polishDescription("2 bedroom homestay KL");

		expect(result).toBe("Comfortable two-bedroom homestay in Kuala Lumpur.");
		expect(createOpencode).toHaveBeenCalledOnce();
		expect(generateText).toHaveBeenCalledOnce();
		expect(disposeMock).toHaveBeenCalledOnce();
	});

	it("rejects empty AI output", async () => {
		vi.mocked(generateText).mockResolvedValue({
			text: "   ",
		} as never);

		await expect(polishDescription("Homestay in Penang")).rejects.toThrow(
			"AI returned an empty description",
		);

		expect(disposeMock).toHaveBeenCalledOnce();
	});
});
