'use client';

import { useCallback, useEffect, useState } from 'react';

type HealthPayload = {
  ok: boolean;
  ts?: string;
  uptimeMs?: number;
  nodeEnv?: string | null;
  hostname?: string | null;
  appVersion?: string | null;
  gitSha?: string | null;
  error?: string;
};

const REQUEST_TIMEOUT_MS = 3000;

type HealthEnvelope = {
  data?: HealthPayload;
  requestId?: string;
};

type HealthLabels = {
  status: string;
  ok: string;
  fail: string;
  checking: string;
  latency: string;
  timestamp: string;
  uptime: string;
  nodeEnv: string;
  hostname: string;
  appVersion: string;
  gitSha: string;
  error: string;
  retry: string;
};

export default function HealthClient({ labels }: { labels: HealthLabels }) {
  const [payload, setPayload] = useState<HealthPayload | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const defaultBaseUrl = `http://${window.location.hostname}:3000`;
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultBaseUrl;
      const endpoint = `${baseUrl.replace(/\/$/, '')}/health`;
      const response = await fetch(endpoint, {
        cache: 'no-store',
        signal: controller.signal,
      });
      const elapsed = Math.round(performance.now() - start);
      const body = (await response.json()) as HealthEnvelope | HealthPayload | { message?: string };
      const data = 'data' in (body as HealthEnvelope)
        ? (body as HealthEnvelope).data
        : (body as HealthPayload);

      if (!response.ok) {
        const message =
          (body as { message?: string })?.message ??
          (data as HealthPayload | undefined)?.error ??
          `Request failed (${response.status})`;
        throw new Error(message);
      }

      setPayload(data ?? null);
      setLatencyMs(elapsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setPayload(null);
      setLatencyMs(Math.round(performance.now() - start));
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const statusLabel = payload?.ok ? labels.ok : labels.fail;
  const statusColor = payload?.ok ? '#0f766e' : '#b42318';

  return (
    <section
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        background: '#fafafa',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <strong style={{ fontSize: 18 }}>{labels.status}</strong>
        <span style={{ color: statusColor, fontWeight: 600 }}>
          {isLoading ? labels.checking : statusLabel}
        </span>
      </div>

      <div style={{ marginTop: 12, color: '#333' }}>
        <div>
          {labels.latency}: {latencyMs ?? '-'} ms
        </div>
        <div>
          {labels.timestamp}: {payload?.ts ?? '-'}
        </div>
        <div>
          {labels.uptime}: {payload?.uptimeMs ?? '-'} ms
        </div>
        <div>
          {labels.nodeEnv}: {payload?.nodeEnv ?? '-'}
        </div>
        <div>
          {labels.hostname}: {payload?.hostname ?? '-'}
        </div>
        <div>
          {labels.appVersion}: {payload?.appVersion ?? '-'}
        </div>
        <div>
          {labels.gitSha}: {payload?.gitSha ?? '-'}
        </div>
      </div>

      {error ? (
        <div style={{ marginTop: 12, color: '#b42318' }}>
          {labels.error}: {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={fetchHealth}
        disabled={isLoading}
        style={{
          marginTop: 16,
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid #d1d5db',
          background: isLoading ? '#f3f4f6' : '#fff',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {labels.retry}
      </button>
    </section>
  );
}
