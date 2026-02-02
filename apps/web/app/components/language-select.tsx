'use client';

import { useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type LanguageOption = {
  value: string;
  label: string;
};

export function LanguageSelect({
  currentLang,
  options,
  label,
}: {
  currentLang: string;
  options: LanguageOption[];
  label: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = () => {
    startTransition(async () => {
      const form = formRef.current;
      if (!form) {
        return;
      }
      const formData = new FormData(form);
      const lang = formData.get('lang');
      if (typeof lang === 'string' && lang.length > 0) {
        const maxAge = 60 * 60 * 24 * 365;
        document.cookie = `pkv_lang=${encodeURIComponent(lang)}; path=/; max-age=${maxAge}`;
      }
      router.refresh();
    });
  };

  return (
    <form ref={formRef} className="language-switcher">
      <label className="language-switcher__label">
        <span className="sr-only">{label}</span>
        <select
          name="lang"
          value={currentLang}
          onChange={handleChange}
          disabled={isPending}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
