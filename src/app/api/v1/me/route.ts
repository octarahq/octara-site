import { NextResponse } from "next/server";
import {
  verifyAccessToken,
  insufficientScopesResponse,
} from "@/lib/oauth-resources";

export async function GET(request: Request) {
  try {
    const auth = await verifyAccessToken(request);

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, scopes } = auth;
    const hasProfile = scopes.includes("read:profile");
    const hasEmail = scopes.includes("read:email");

    if (!hasProfile && !hasEmail) {
      return insufficientScopesResponse(["read:profile", "read:email"]);
    }

    interface UserResponse {
      success: boolean;
      user: {
        id: string;
        name?: string | null;
        created_at?: Date;
        email?: string;
      };
      scopes: string[];
    }

    const responseData: UserResponse = {
      success: true,
      user: {
        id: user.id,
      },
      scopes,
    };

    if (hasProfile) {
      responseData.user.name = user.name;
      responseData.user.created_at = user.createdAt;
    }

    if (hasEmail) {
      responseData.user.email = user.email;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Resource API v1/me Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
