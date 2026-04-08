# Documentation Technique Octara

Bienvenue dans la documentation technique de la forge logicielle Octara. Ce dossier contient les spécifications et guides pour intégrer les services Octara dans vos applications tierces.

## Contenu

- [Spécification OpenAPI (YAML)](./openapi.yaml) : Définition complète des points de terminaison de l&apos;API (v1).
- [Guide OAuth2 (Markdown)](./oauth-guide.md) : Guide pas-à-pas pour implémenter le flux d&apos;authentification standard.

## Points de Terminaison Clés

- **Base URL (API)** : `https://tools.octara.xyz/api/v1`
- **Authentification (OAuth2)** :
  - **Authorize** : `https://tools.octara.xyz/oauth/authorize`
  - **Token Exchange** : `https://tools.octara.xyz/api/oauth/token`

## Ressources Disponibles

- **GET /me** : Récupérer le profil de l&apos;utilisateur authentifié (nom, email, id, avatar).

---

&copy; 2024 Octara • Infrastructure Forge & Sécurité
