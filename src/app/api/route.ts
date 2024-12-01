import { ContestSubmission } from "@/utilities/codeforcequery";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, apiKey, secret } = await req.json();
    const contests = await ContestSubmission(username, apiKey, secret);
    return NextResponse.json(contests);
  } catch (ex) {
    return NextResponse.error();
  }
}