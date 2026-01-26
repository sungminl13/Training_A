import { cookies, headers } from 'next/headers';
import {
  getSupportedLangs,
  loadMessages,
  resolveLanguage,
} from '@repo/messages';

export async function getUiLanguage() {
  const messages = await loadMessages();
  const supportedLangs = getSupportedLangs(messages);
  const cookieStore = await cookies();
  const headerStore = await headers();
  const uiLang = resolveLanguage({
    userLang: cookieStore.get('pkv_lang')?.value,
    acceptLanguage: headerStore.get('accept-language') ?? undefined,
    supported: supportedLangs,
    fallback: 'en',
  });

  return { messages, supportedLangs, uiLang };
}
