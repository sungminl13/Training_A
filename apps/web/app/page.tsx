import type { Link } from '@repo/api';
import {
  getMessage,
} from '@repo/messages';
import { Button } from '@repo/ui/button';
import Image, { type ImageProps } from 'next/image';

import { getUiLanguage } from './i18n';
import styles from './page.module.css';

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

async function getLinks(lang: string): Promise<Link[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    'http://localhost:3000';
  const endpoint = `${baseUrl.replace(/\/$/, '')}/links`;
  const res = await fetch(endpoint, {
    cache: 'no-store',
    headers: lang ? { 'accept-language': lang } : undefined,
  }).catch(() => null);

  if (!res || !res.ok) {
    return [];
  }

  const payload = (await res.json()) as { data?: Link[] };
  return Array.isArray(payload?.data) ? payload.data : [];
}

export default async function Home() {
  const { messages, uiLang } = await getUiLanguage();
  const links = await getLinks(uiLang);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt={getMessage(messages, 'ALT_TURBOREPO_LOGO', uiLang)}
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            {getMessage(messages, 'PAGE_GET_STARTED', uiLang)}{' '}
            <code>apps/web/app/page.tsx</code>
          </li>
          <li>{getMessage(messages, 'PAGE_SAVE_CHANGES', uiLang)}</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt={getMessage(messages, 'ALT_VERCEL_LOGOMARK', uiLang)}
              width={20}
              height={20}
            />
            {getMessage(messages, 'CTA_DEPLOY_NOW', uiLang)}
          </a>
          <a
            href="https://turborepo.dev/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            {getMessage(messages, 'CTA_READ_DOCS', uiLang)}
          </a>
        </div>

        <Button appName="web" className={styles.secondary}>
          {getMessage(messages, 'BUTTON_OPEN_ALERT', uiLang)}
        </Button>

        {links.length > 0 ? (
          <div className={styles.ctas}>
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.description}
                className={styles.secondary}
              >
                {link.title}
              </a>
            ))}
          </div>
        ) : (
          <div style={{ color: '#666' }}>
            {getMessage(messages, 'LINKS_EMPTY', uiLang)}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt={getMessage(messages, 'ALT_WINDOW_ICON', uiLang)}
            width={16}
            height={16}
          />
          {getMessage(messages, 'CTA_EXAMPLES', uiLang)}
        </a>
        <a
          href="https://turborepo.dev?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt={getMessage(messages, 'ALT_GLOBE_ICON', uiLang)}
            width={16}
            height={16}
          />
          {getMessage(messages, 'CTA_TURBOREPO', uiLang)}
        </a>
      </footer>
    </div>
  );
}

export async function generateMetadata() {
  const { messages, uiLang } = await getUiLanguage();
  const title = getMessage(messages, 'META_HOME_TITLE', uiLang, 'Training App');
  const description = getMessage(
    messages,
    'META_HOME_DESCRIPTION',
    uiLang,
    'Training application demo.'
  );

  return {
    title,
    description,
    openGraph: {
      title: getMessage(
        messages,
        'META_HOME_OG_TITLE',
        uiLang,
        title
      ),
      description: getMessage(
        messages,
        'META_HOME_OG_DESCRIPTION',
        uiLang,
        description
      ),
    },
    twitter: {
      card: 'summary',
      title: getMessage(
        messages,
        'META_HOME_TWITTER_TITLE',
        uiLang,
        title
      ),
      description: getMessage(
        messages,
        'META_HOME_TWITTER_DESCRIPTION',
        uiLang,
        description
      ),
    },
  };
}
