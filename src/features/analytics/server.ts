import "server-only";

import { createHash } from "node:crypto";
import { PostHog } from "posthog-node";
import { parseAnalyticsEvent, type AnalyticsEvent } from "@/features/analytics/contract";

function config() {
  return {
    key: process.env.POSTHOG_PROJECT_KEY,
    host: process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com",
  };
}

export function analyticsDistinctId(sourceId: string) {
  const salt = process.env.ANALYTICS_SALT ?? "local-disabled-analytics";
  return createHash("sha256").update(`${salt}:${sourceId}`).digest("hex");
}

export async function captureAnalytics(distinctId: string, candidate: AnalyticsEvent) {
  const event = parseAnalyticsEvent(candidate);
  const { key, host } = config();
  if (!event || !key) return false;

  const client = new PostHog(key, {
    host,
    flushAt: 1,
    flushInterval: 0,
    disableGeoip: true,
  });
  try {
    client.capture({
      distinctId: analyticsDistinctId(distinctId),
      event: event.event,
      properties: event.properties,
    });
    await client.shutdown();
    return true;
  } catch {
    await client.shutdown().catch(() => undefined);
    return false;
  }
}
