const BACKEND_URL = process.env.SERVER_URL ?? "http://localhost:3000";

export async function proxyToBackend(request: Request): Promise<Response> {
	const incomingUrl = new URL(request.url);

	const targetUrl = new URL(
		incomingUrl.pathname + incomingUrl.search,
		BACKEND_URL,
	);

	const requestHeaders = new Headers(request.headers);

	// Headers managed by the HTTP client.
	requestHeaders.delete("host");
	requestHeaders.delete("connection");
	requestHeaders.delete("content-length");
	requestHeaders.delete("transfer-encoding");

	requestHeaders.set("x-forwarded-host", incomingUrl.host);

	requestHeaders.set(
		"x-forwarded-proto",
		incomingUrl.protocol.replace(":", ""),
	);

	try {
		const hasBody = request.method !== "GET" && request.method !== "HEAD";

		const upstream = await fetch(targetUrl, {
			method: request.method,
			headers: requestHeaders,
			body: hasBody ? await request.arrayBuffer() : undefined,
			cache: "no-store",
			redirect: "manual",
		});

		const responseHeaders = new Headers(upstream.headers);

		responseHeaders.delete("connection");
		responseHeaders.delete("transfer-encoding");
		responseHeaders.delete("content-length");
		responseHeaders.delete("content-encoding");

		// Preserve authentication cookies individually.
		responseHeaders.delete("set-cookie");

		for (const cookie of upstream.headers.getSetCookie()) {
			responseHeaders.append("set-cookie", cookie);
		}

		return new Response(upstream.body, {
			status: upstream.status,
			statusText: upstream.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error("Backend proxy failed:", error);

		return Response.json({ error: "Backend unavailable" }, { status: 502 });
	}
}
