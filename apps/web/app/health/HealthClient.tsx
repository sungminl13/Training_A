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

export default function HealthClient() {
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
      const response = await fetch('/api/health', {
        cache: 'no-store',
        signal: controller.signal,
      });
      const elapsed = Math.round(performance.now() - start);
      const data = (await response.json()) as HealthPayload;

      if (!response.ok) {
        throw new Error(data?.error ?? `Request failed (${response.status})`);
      }

      setPayload(data);
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

  const statusLabel = payload?.ok ? 'OK' : 'FAIL';
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
        <strong style={{ fontSize: 18 }}>Status</strong>
        <span style={{ color: statusColor, fontWeight: 600 }}>
          {isLoading ? 'CHECKING...' : statusLabel}
        </span>
      </div>

      <div style={{ marginTop: 12, color: '#333' }}>
        <div>Latency: {latencyMs ?? '-'} ms</div>
        <div>Timestamp: {payload?.ts ?? '-'}</div>
        <div>Uptime: {payload?.uptimeMs ?? '-'} ms</div>
        <div>Node Env: {payload?.nodeEnv ?? '-'}</div>
        <div>Hostname: {payload?.hostname ?? '-'}</div>
        <div>App Version: {payload?.appVersion ?? '-'}</div>
        <div>Git SHA: {payload?.gitSha ?? '-'}</div>
      </div>

      {error ? (
        <div style={{ marginTop: 12, color: '#b42318' }}>
          Error: {error}
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
        Retry
      </button>
    </section>
  );
}
