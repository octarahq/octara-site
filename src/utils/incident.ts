type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

type MaintenanceStatus = "scheduled" | "in-progress" | "completed";
export type Incident = {
  id: string;
  service: string;
  title: string;
  startedAt: string;
  resolvedAt?: string;
  updates: Array<{
    status: IncidentStatus;
    message: string;
    timestamp: string;
  }>;
};

export type Maintenance = {
  id: string;
  service: string;
  title: string;
  message: string;
  status: MaintenanceStatus;
  scheduledStart: string;
  scheduledEnd: string;
};

export interface OctaraStatus {
  incidents: Incident[];
  maintenances: Maintenance[];
  lastUpdated?: string;
}

const INCIDENT_URL =
  "https://raw.githubusercontent.com/octarahq/.github/main/assets/incidents.json";

export async function getStatus(): Promise<OctaraStatus> {
  const response = await fetch(INCIDENT_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch status: ${response.status}`);
  }

  return (await response.json()) as OctaraStatus;
}
