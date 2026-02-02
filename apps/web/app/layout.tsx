import localFont from 'next/font/local';
import { getMessage } from '@repo/messages';

import { LanguageSelect } from './components/language-select';
import { getUiLanguage } from './i18n';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export async function generateMetadata() {
  const { messages, uiLang } = await getUiLanguage();
  const title = getMessage(messages, 'META_SITE_TITLE', uiLang, 'Training App');
  const description = getMessage(
    messages,
    'META_SITE_DESCRIPTION',
    uiLang,
    'Training application demo.'
  );

  return {
    title,
    description,
    openGraph: {
      title: getMessage(messages, 'META_SITE_OG_TITLE', uiLang, title),
      description: getMessage(
        messages,
        'META_SITE_OG_DESCRIPTION',
        uiLang,
        description
      ),
    },
    twitter: {
      card: 'summary',
      title: getMessage(messages, 'META_SITE_TWITTER_TITLE', uiLang, title),
      description: getMessage(
        messages,
        'META_SITE_TWITTER_DESCRIPTION',
        uiLang,
        description
      ),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { messages, supportedLangs, uiLang } = await getUiLanguage();
  const languageOptions = supportedLangs.map((lang) => ({
    value: lang,
    label: getMessage(
      messages,
      `LANGUAGE_${lang.toUpperCase()}`,
      uiLang,
      lang.toUpperCase()
    ),
  }));
  const languageLabel = getMessage(messages, 'LANGUAGE_LABEL', uiLang, 'Language');

  return (
    <html lang={uiLang}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageSelect
          currentLang={uiLang}
          options={languageOptions}
          label={languageLabel}
        />
        {children}
      </body>
    </html>
  );
}
