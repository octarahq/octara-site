import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  firstPartyOnlyResponse,
  verifyAccessToken,
} from "@/lib/oauth-resources";
import dns from "node:dns/promises";

export async function POST(request: Request) {
  try {
    const auth = await verifyAccessToken(request);

    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, isFirstParty } = auth;
    if (!isFirstParty) return firstPartyOnlyResponse();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing domain id" }, { status: 400 });
    }

    const domainEntry = await prisma.verifiedDomain.findUnique({
      where: { id, userId: user.id },
    });

    if (!domainEntry) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    if (domainEntry.status === "VERIFIED") {
      return NextResponse.json({
        success: true,
        message: "Already verified",
        status: "VERIFIED",
      });
    }

    try {
      const records = await dns.resolveTxt(domainEntry.domain);
      const flattenedRecords = records.flat();

      const isVerified = flattenedRecords.some(
        (record) => record === domainEntry.verificationTxt,
      );

      if (isVerified) {
        await prisma.verifiedDomain.update({
          where: { id },
          data: { status: "VERIFIED" },
        });

        return NextResponse.json({
          success: true,
          message: "Domain successfully verified",
          status: "VERIFIED",
        });
      } else {
        return NextResponse.json({
          success: false,
          error:
            "Verification record not found. Please ensure the TXT record is correctly set.",
          foundRecords: flattenedRecords,
          domain: domainEntry.domain,
          expected: domainEntry.verificationTxt,
        });
      }
    } catch (dnsError: any) {
      console.error("DNS Lookup Error:", dnsError);
      return NextResponse.json(
        {
          success: false,
          error: "Could not resolve DNS records. " + dnsError.message,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("POST /api/v1/search/domains/verify Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
