import {
  getSupportedLangs,
  loadMessages,
  resolveLanguage,
} from '@repo/messages';

export async function getApiI18n(acceptLanguage?: string) {
  const messages = await loadMessages();
  const supportedLangs = getSupportedLangs(messages);
  const uiLang = resolveLanguage({
    acceptLanguage,
    supported: supportedLangs,
    fallback: 'en',
  });

  return { messages, uiLang };
}
