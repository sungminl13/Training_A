'use server';

import { cookies, headers } from 'next/headers';

export async function setLanguage(formData: FormData) {
  const lang = formData.get('lang');
  if (typeof lang === 'string' && lang.length > 0) {
    const cookieStore = await cookies();
    cookieStore.set('pkv_lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const headerStore = await headers();
  const referer = headerStore.get('referer');
  let path = '/';
  if (referer) {
    try {
      path = new URL(referer).pathname || '/';
    } catch {
      path = '/';
    }
  }
  return path;
}
