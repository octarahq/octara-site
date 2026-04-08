export type ProjectStatus =
  | "active"
  | "maintenance"
  | "experimental"
  | "archived"
  | "down";

export type ProjectStatusUrls = Record<string, string>;

export type Platform =
  | "web"
  | "android"
  | "ios"
  | "discord"
  | "api"
  | "cli"
  | "library";

export type ProjectCategory = "app" | "web" | "modules";

export interface ProjectDescriptions {
  fr: string;
  en: string;
}

export interface Project {
  id: string;
  name: string;
  descriptions: ProjectDescriptions;

  siteUrl: string;
  favicon: string;
  githubUrl?: string;

  status: ProjectStatus;
  statusUrls: ProjectStatusUrls;
  platforms: Platform[];
  tags: string[];

  version: string;
}

export interface ProjectCategoryGroup {
  category: ProjectCategory;
  projects: Project[];
}

export type ProjectsData = ProjectCategoryGroup[];

const PROJECTS_URL =
  "https://raw.githubusercontent.com/octarahq/.github/main/assets/projects.json";

interface GetProjectsWithCache {
  (): Promise<ProjectsData>;
  _cache?: ProjectsData;
  _promise?: Promise<ProjectsData> | null;
}

export const getProjects: GetProjectsWithCache =
  async function (): Promise<ProjectsData> {
    const self = getProjects as GetProjectsWithCache;
    if (self._cache) return self._cache;
    if (self._promise) return self._promise;

    self._promise = (async (): Promise<ProjectsData> => {
      try {
        const res = await fetch(PROJECTS_URL, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const text = await res.text();
        try {
          return JSON.parse(text) as ProjectsData;
        } catch (e) {
          const normalized = text.replace(
            /([\{,\n\r\s]+)([A-Za-z0-9_\-]+)\s*:/g,
            '$1"$2":',
          );
          try {
            return JSON.parse(normalized) as ProjectsData;
          } catch (e2) {
            return [];
          }
        }
      } catch (e) {
        return [];
      }
    })();

    try {
      const data = await self._promise;
      self._cache = data;
      return data;
    } finally {
      self._promise = null;
    }
  };
