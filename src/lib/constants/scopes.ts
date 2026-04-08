export interface ScopeDefinition {
  id: string;
  label: string;
  description: string;
}

export const AVAILABLE_SCOPES: ScopeDefinition[] = [
  {
    id: "read:profile",
    label: "read:profile",
    description: "Accès à votre nom et votre identifiant Octara",
  },
  {
    id: "read:email",
    label: "read:email",
    description: "Accès à votre adresse e-mail principale",
  },
];

export const DEFAULT_SCOPE = "read:profile";

export const getScopeById = (id: string) =>
  AVAILABLE_SCOPES.find((s) => s.id === id);

export const getScopeLabel = (id: string) =>
  getScopeById(id)?.description || id;
