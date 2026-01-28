import os from 'node:os';

import { NextResponse } from 'next/server';

import packageJson from '../../../package.json';

const getGitSha = () =>
  process.env.GIT_SHA ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.NEXT_PUBLIC_GIT_SHA ??
  null;

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        ok: true,
        ts: new Date().toISOString(),
        uptimeMs: Math.floor(process.uptime() * 1000),
        nodeEnv: process.env.NODE_ENV ?? null,
        hostname: process.env.HOSTNAME ?? os.hostname(),
        appVersion: packageJson.version ?? null,
        gitSha: getGitSha(),
      },
      { status: 200 }
    );
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
