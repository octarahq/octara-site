import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
});

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
});

export const userUpdateSchema = z.object({
  name: z.string().max(100).optional().nullable(),
  email: z.string().email().max(255).optional(),
  currentPassword: z.string().min(8).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
  avatarData: z
    .string()
    .max(5 * 1024 * 1024)
    .optional()
    .nullable(),
});

export const appCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  redirect_uris: z.array(z.string().url()).min(1),
});

export const appUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  redirect_uris: z.array(z.string().url()).min(1).optional(),
  logoData: z
    .string()
    .max(5 * 1024 * 1024)
    .optional()
    .nullable(),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const tokenSchema = z.discriminatedUnion("grant_type", [
  z.object({
    grant_type: z.literal("authorization_code"),
    client_id: z.string().min(1).max(100),
    client_secret: z.string().min(1).max(255),
    code: z.string().min(1).max(255),
    redirect_uri: z.string().url().max(500),
  }),
  z.object({
    grant_type: z.literal("refresh_token"),
    client_id: z.string().min(1).max(100),
    client_secret: z.string().min(1).max(255),
    refresh_token: z.string().min(1).max(255),
  }),
]);

export const consentSchema = z.object({
  client_id: z.string().min(1).max(100),
  scope: z.string().max(1000).optional(),
  state: z.string().max(255).optional().nullable(),
  redirect_uri: z.string().max(500),
});

export const revokeSchema = z.object({
  clientId: z.string().uuid(),
});

export const authorizeSchema = z.object({
  client_id: z.string().min(1).max(100),
  redirect_uri: z.string().max(500),
  response_type: z.literal("code"),
  scope: z.string().max(1000).optional(),
  state: z.string().max(255).optional(),
});
