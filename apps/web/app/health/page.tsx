import HealthClient from './HealthClient';

export default function HealthPage() {
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

      <HealthClient />
    </main>
  );
}
