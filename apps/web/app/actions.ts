'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setLanguage(formData: FormData) {
  const lang = formData.get('lang');
  if (typeof lang === 'string' && lang.length > 0) {
    const cookieStore = await cookies();
    cookieStore.set('pkv_lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  redirect('/');
}
