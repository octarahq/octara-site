export interface ScopeDefinition {
  id: string;
  label: string;
  description: string;
}

export const AVAILABLE_SCOPES: ScopeDefinition[] = [
  {
    id: "read:profile",
    label: "Profil utilisateur",
    description: "Accès à votre nom et votre identifiant Octara",
  },
  {
    id: "read:email",
    label: "Adresse e-mail",
    description: "Accès à votre adresse e-mail principale",
  },
  {
    id: "read:search_history",
    label: "Historique de recherche (lecture)",
    description: "Accès à votre historique de recherche Octara",
  },
  {
    id: "write:search_history",
    label: "Historique de recherche (modification)",
    description:
      "Ajout et suppression d'entrées dans votre historique de recherche",
  },
  {
    id: "read:search_domains",
    label: "Domaines vérifiés (lecture)",
    description: "Accès à la liste de vos domaines vérifiés",
  },
  {
    id: "write:search_domains",
    label: "Domaines vérifiés (modification)",
    description: "Ajout et suppression de vos domaines vérifiés",
  },
  {
    id: "read:search_settings",
    label: "Paramètres de recherche (lecture)",
    description: "Accès à vos paramètres de recherche Octara",
  },
  {
    id: "write:search_settings",
    label: "Paramètres de recherche (modification)",
    description: "Modification de vos paramètres de recherche Octara",
  },
];

export const DEFAULT_SCOPE = "read:profile";

export const getScopeById = (id: string) =>
  AVAILABLE_SCOPES.find((s) => s.id === id);

export const getScopeLabel = (id: string) => getScopeById(id)?.label || id;

export const getScopeDescription = (id: string) =>
  getScopeById(id)?.description || id;
