import { readVideoJob } from "@/lib/video-jobs";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { jobId } = await context.params;
    const job = await readVideoJob(jobId);

    return NextResponse.json({
      ok: true,
      job,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "영상 생성 작업을 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }
}
