"use client";

import { useEffect } from "react";
import { recordExperimentExposure } from "@/features/experiments/actions";

export function ExperimentExposure({ assignmentId }: { assignmentId: string }) {
  useEffect(() => {
    void recordExperimentExposure(assignmentId);
  }, [assignmentId]);
  return null;
}
