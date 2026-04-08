import type { ProjectStatus } from "@/utils/projects";
import type { OctaraStatus } from "@/utils/incident";

export interface SnapshotProject {
  id: string;
  name: string;
  mainUrl: string;
  statusUrls: Record<
    string,
    { url: string; status: ProjectStatus | "degraded" }
  >;
  records?: unknown[];
  status?: ProjectStatus | "degraded";
}

export interface MetricData {
  availability: number;
  avgResponseMs: number;
  daysWithoutIncident: number;
  lastIncidentAt?: string | null;
  updatedAt: string;
}

export type { OctaraStatus };
