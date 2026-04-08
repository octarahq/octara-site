# Guide: Implementing Octara OAuth2 Authentication

This guide explains how to integrate Octara authentication into your application using the `Authorization Code` flow.

## 1. Register Your Application

Before starting, you must register your application on the [Octara Dashboard](https://octara.xyz/account/apps) to obtain:

- **Client ID** (e.g., `app_oct_...`)
- **Client Secret** (keep this secure)

You must also configure your authorized **Redirect URIs**.

## 2. Redirect the User to Authorization

To initiate the login, send the user to the following URL:

`GET /oauth/authorize`

### Query Parameters:

| Parameter       | Description                                           |
| :-------------- | :---------------------------------------------------- |
| `client_id`     | Your application's Client ID                          |
| `redirect_uri`  | The return URL after consent (must be registered)     |
| `response_type` | Always `code`                                         |
| `scope`         | List of permissions (e.g., `read:profile read:email`) |
| `state`         | (Optional) Random string to prevent CSRF attacks      |

**Example URL:**
`https://octara.xyz/oauth/authorize?client_id=YOUR_ID&redirect_uri=https://myapp.com/callback&response_type=code&scope=read:profile+read:email&state=random_str`

---

## 3. Retrieve the Authorization Code

If the user accepts, Octara will redirect them to your `redirect_uri` with a `code` parameter:

`https://myapp.com/callback?code=AUTH_CODE_HERE&state=random_str`

---

## 4. Exchange the Code for an Access Token

Perform a `POST` request from your server to:

`POST /api/oauth/token`

### Request Body (JSON):

```json
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE_HERE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://myapp.com/callback"
}
```

### Server Response (JSON):

```json
{
  "access_token": "oct_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:profile read:email"
}
```

---

## 5. Access Protected Resources

Once you have the `access_token`, include it in the `Authorization` header of your requests to the Octara API.

**Endpoint:** `GET /api/v1/me`

**Header:**
`Authorization: Bearer YOUR_ACCESS_TOKEN`

**Example Response:**

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

## Common Errors

- `Invalid client_id`: Check your ID in the dashboard.
- `Redirect URI mismatch`: The URL passed as a parameter must match **exactly** one of the registered URLs (including protocol and port).
- `Invalid secret`: Your client secret has expired or is incorrect.
