"use client";

import { useEffect } from "react";
import type { AnalyticsEvent } from "@/features/analytics/contract";

export function captureBrowserAnalytics(payload: AnalyticsEvent) {
  const storageKey = "doroboty_analytics_id";
  let distinctId = window.localStorage.getItem(storageKey);
  if (!distinctId) {
    distinctId = window.crypto.randomUUID();
    window.localStorage.setItem(storageKey, distinctId);
  }
  return fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ distinctId, payload }),
    keepalive: true,
  });
}

export function ClientAnalyticsEvent({ payload }: { payload: AnalyticsEvent }) {
  useEffect(() => {
    void captureBrowserAnalytics(payload);
  }, [payload]);
  return null;
}
