import { z } from "zod";
import { analyticsEventSchema } from "@/features/analytics/contract";
import { captureAnalytics } from "@/features/analytics/server";

const requestSchema = z.object({ distinctId: z.uuid(), payload: analyticsEventSchema }).strict();

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 });
  await captureAnalytics(parsed.data.distinctId, parsed.data.payload);
  return Response.json({ ok: true }, { status: 202 });
}
