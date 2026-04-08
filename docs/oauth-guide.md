# Guide : Implémentation de l&apos;Authentification OAuth2 Octara

Ce guide explique comment intégrer l&apos;authentification Octara dans votre application en utilisant le flux `Authorization Code`.

## 1. Enregistrement de l&apos;Application

Avant de commencer, vous devez enregistrer votre application sur le [Dashboard Octara](https://tools.octara.xyz/account/apps) pour obtenir :

- **Client ID** (ex: `app_oct_...`)
- **Client Secret** (à conserver précieusement)

Vous devez également configurer vos **Redirect URIs** autorisées.

## 2. Rediriger l&apos;Utilisateur vers l&apos;Autorisation

Pour initier la connexion, envoyez l&apos;utilisateur vers l&apos;URL suivante :

`GET /oauth/authorize`

### Paramètres de Requête :

| Paramètre       | Description                                                     |
| :-------------- | :-------------------------------------------------------------- |
| `client_id`     | Votre identifiant application (Client ID)                       |
| `redirect_uri`  | L&apos;URL de retour après consentement (doit être enregistrée) |
| `response_type` | Toujours `code`                                                 |
| `scope`         | Liste de permissions (ex: `read:profile read:email`)            |
| `state`         | (Optionnel) Chaîne aléatoire pour prévenir les attaques CSRF    |

**Exemple d&apos;URL :**
`https://tools.octara.xyz/oauth/authorize?client_id=YOUR_ID&redirect_uri=https://myapp.com/callback&response_type=code&scope=read:profile+read:email&state=random_str`

---

## 3. Récupération du Code d&apos;Autorisation

Si l&apos;utilisateur accepte, Octara le redirigera vers votre `redirect_uri` avec un paramètre `code` :

`https://myapp.com/callback?code=AUTH_CODE_HERE&state=random_str`

---

## 4. Échange du Code contre un Jeton (Access Token)

Effectuez une requête `POST` depuis votre serveur vers :

`POST /api/oauth/token`

### Corps de la Requête (JSON) :

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE_HERE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

### Réponse du Serveur (JSON) :

```json
{
  "access_token": "oct_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:profile read:email"
}
```

---

## 5. Accès aux Ressources Protégées

Une fois le `access_token` obtenu, incluez-le dans l&apos;en-tête `Authorization` de vos requêtes vers l&apos;API Octara.

**Endpoint :** `GET /api/v1/me`

**En-tête :**
`Authorization: Bearer YOUR_ACCESS_TOKEN`

**Exemple de Réponse :**

```json
{
  "success": true,
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "name": "User Name"
  },
  "scopes": ["read:profile", "read:email"]
}
```

---

## Erreurs Communes

- `Invalid client_id` : Vérifiez votre identifiant dans le dashboard.
- `Redirect URI mismatch` : L&apos;URL passée en paramètre doit correspondre **exactement** à l&apos;une des URLs enregistrées (incluant le protocole et le port).
- `Invalid secret` : Votre secret client a expiré ou est incorrect.
