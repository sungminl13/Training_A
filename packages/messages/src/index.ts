import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export type ErrorMessages = Record<string, Record<string, string>>;

const baseDir = __dirname;
const repoRoots = [
  process.cwd(),
  resolve(process.cwd(), '..'),
  resolve(process.cwd(), '..', '..'),
];

async function resolveMessagePath(filename: string) {
  const candidates = [
    ...repoRoots.map((root) => resolve(root, 'packages', 'messages', 'src', filename)),
    resolve(baseDir, filename),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  return resolve(baseDir, filename);
}

let cachedMessages: ErrorMessages | null = null;

export async function loadMessages(): Promise<ErrorMessages> {
  if (cachedMessages) {
    return cachedMessages;
  }

  const messagesPath = await resolveMessagePath('messages.json');
  const raw = await readFile(messagesPath, 'utf8');
  const parsed = JSON.parse(raw) as ErrorMessages;
  cachedMessages = parsed;
  return parsed;
}

export async function loadMessagesMarkdown(): Promise<string> {
  const markdownPath = await resolveMessagePath('messages.md');
  return readFile(markdownPath, 'utf8');
}

export function getSupportedLangs(messages: ErrorMessages): string[] {
  const langs = new Set<string>();

  for (const code of Object.keys(messages)) {
    const entry = messages[code];
    if (!entry) {
      continue;
    }
    for (const lang of Object.keys(entry)) {
      langs.add(lang.toLowerCase());
    }
  }

  return Array.from(langs);
}

const normalizeLang = (lang: string) => lang.trim().toLowerCase();

const matchLang = (lang: string, supported: Set<string>) => {
  const normalized = normalizeLang(lang);
  if (supported.has(normalized)) {
    return normalized;
  }

  const base = normalized.split('-')[0];
  if (supported.has(base)) {
    return base;
  }

  return null;
};

export function resolveLanguage({
  userLang,
  acceptLanguage,
  supported,
  fallback = 'en',
}: {
  userLang?: string;
  acceptLanguage?: string;
  supported: string[];
  fallback?: string;
}): string {
  const supportedSet = new Set(supported.map((lang) => lang.toLowerCase()));

  if (userLang) {
    const match = matchLang(userLang, supportedSet);
    if (match) {
      return match;
    }
  }

  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(',')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => segment.split(';')[0]);

    for (const candidate of candidates) {
      const match = matchLang(candidate, supportedSet);
      if (match) {
        return match;
      }
    }
  }

  const normalizedFallback = fallback.toLowerCase();
  if (supportedSet.has(normalizedFallback)) {
    return normalizedFallback;
  }

  return supported[0] ?? fallback;
}

export function getErrorMessage(
  messages: ErrorMessages,
  code: string,
  lang: string,
  fallback = 'Unknown error.'
): string {
  const entry = messages[code];
  if (!entry) {
    return fallback;
  }

  return entry[lang] ?? entry[lang.toLowerCase()] ?? entry.en ?? fallback;
}

export function getMessage(
  messages: ErrorMessages,
  code: string,
  lang: string,
  fallback = ''
): string {
  const entry = messages[code];
  if (!entry) {
    return fallback;
  }

  return entry[lang] ?? entry[lang.toLowerCase()] ?? entry.en ?? fallback;
}
