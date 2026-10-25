import { proxyToBackend } from "@/lib/backend-proxy";

export const runtime = "nodejs";

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const OPTIONS = proxyToBackend;
