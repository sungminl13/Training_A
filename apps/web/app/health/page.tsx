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

export default function HealthPage() {
  const [payload, setPayload] = useState<HealthPayload | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const start = performance.now();

    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const statusLabel = payload?.ok ? 'OK' : 'FAIL';
  const statusColor = payload?.ok ? '#0f766e' : '#b42318';

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '40px auto',
        padding: '0 24px',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Health Diagnostics</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        API 상태를 확인하고 왕복 latency를 측정합니다.
      </p>

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
    </main>
  );
}
