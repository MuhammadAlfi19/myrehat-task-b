
import { pathToFileURL } from "node:url";
import { generateText } from "ai";
import { createOpencode } from "ai-sdk-provider-opencode-sdk";

export function buildPolishPrompt(description: string) {
  const trimmed = description.trim();

  if (!trimmed) {
    throw new Error("Description cannot be empty");
  }

  return [
    "Rewrite the following homestay listing description.",
    "Make it clear, professional, and appealing to potential customers.",
    "Preserve all factual details.",
    "Do not invent amenities, prices, locations, or availability.",
    "Return only the polished description.",
    "",
    trimmed,
  ].join("\n");
}

export async function polishDescription(
  description: string,
): Promise<string> {
  const prompt = buildPolishPrompt(description);

  const password = process.env.OPENCODE_PASSWORD;

	if (!password) {
		throw new Error("OPENCODE_PASSWORD is required");
	}

	const opencode = createOpencode({
		baseUrl: process.env.OPENCODE_URL ?? "http://127.0.0.1:4096",
		clientOptions: {
			headers: {
				Authorization: `Basic ${Buffer.from(
					`opencode:${password}`,
				).toString("base64")}`,
			},
		},
	});

  try {
    const result = await generateText({
      model: opencode(
        process.env.OPENCODE_MODEL ?? "opencode/big-pickle",
      ),
      prompt,
    });

    const polished = result.text.trim();

    if (!polished) {
      throw new Error("AI returned an empty description");
    }

    return polished;
  } finally {
    await opencode.dispose();
  }
}

async function main() {
  const description = process.argv.slice(2).join(" ").trim();

  if (!description) {
    console.error('Usage: pnpm polish "Homestay description"');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await polishDescription(description);
    console.log(result);
  } catch (error) {
    console.error(
      "Failed to polish description:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  }
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await main();
}
