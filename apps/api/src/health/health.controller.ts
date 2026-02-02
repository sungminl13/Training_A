import os from 'node:os';

import { Controller, Get } from '@nestjs/common';

import packageJson from '../../package.json';

const getGitSha = () =>
  process.env.GIT_SHA ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.NEXT_PUBLIC_GIT_SHA ??
  null;

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      ok: true,
      ts: new Date().toISOString(),
      uptimeMs: Math.floor(process.uptime() * 1000),
      nodeEnv: process.env.NODE_ENV ?? null,
      hostname: process.env.HOSTNAME ?? os.hostname(),
      appVersion: packageJson.version ?? null,
      gitSha: getGitSha(),
    };
  }
}
