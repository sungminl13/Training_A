import { getMessage } from '@repo/messages';

import { getUiLanguage } from '../i18n';
import HealthClient from './HealthClient';

export default async function HealthPage() {
  const { messages, uiLang } = await getUiLanguage();
  const labels = {
    status: getMessage(messages, 'HEALTH_STATUS', uiLang, 'Status'),
    ok: getMessage(messages, 'HEALTH_OK', uiLang, 'OK'),
    fail: getMessage(messages, 'HEALTH_FAIL', uiLang, 'FAIL'),
    checking: getMessage(messages, 'HEALTH_CHECKING', uiLang, 'CHECKING...'),
    latency: getMessage(messages, 'HEALTH_LATENCY', uiLang, 'Latency'),
    timestamp: getMessage(messages, 'HEALTH_TIMESTAMP', uiLang, 'Timestamp'),
    uptime: getMessage(messages, 'HEALTH_UPTIME', uiLang, 'Uptime'),
    nodeEnv: getMessage(messages, 'HEALTH_NODE_ENV', uiLang, 'Node Env'),
    hostname: getMessage(messages, 'HEALTH_HOSTNAME', uiLang, 'Hostname'),
    appVersion: getMessage(messages, 'HEALTH_APP_VERSION', uiLang, 'App Version'),
    gitSha: getMessage(messages, 'HEALTH_GIT_SHA', uiLang, 'Git SHA'),
    error: getMessage(messages, 'HEALTH_ERROR', uiLang, 'Error'),
    retry: getMessage(messages, 'HEALTH_RETRY', uiLang, 'Retry'),
  };

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '40px auto',
        padding: '0 24px',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        {getMessage(messages, 'HEALTH_TITLE', uiLang, 'Health Diagnostics')}
      </h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        {getMessage(
          messages,
          'HEALTH_DESCRIPTION',
          uiLang,
          'API 상태를 확인하고 왕복 latency를 측정합니다.'
        )}
      </p>

      <HealthClient labels={labels} />
    </main>
  );
}
