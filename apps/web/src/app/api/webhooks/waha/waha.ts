import { z } from "zod";

export const wahaWebhookSchema = z.object({
	event: z.string().min(1),
	payload: z.object({
		from: z.string().min(1),
		body: z.string().trim().min(1),
	}),
});

export function formatWahaReply(to: string, reply: string) {
	return {
		to,
		reply: reply.trim(),
	};
}
