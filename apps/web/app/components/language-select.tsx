'use client';

import { useRef, useTransition } from 'react';

type LanguageOption = {
  value: string;
  label: string;
};

export function LanguageSelect({
  action,
  currentLang,
  options,
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  currentLang: string;
  options: LanguageOption[];
  label: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form ref={formRef} action={action} className="language-switcher">
      <label className="language-switcher__label">
        <span className="sr-only">{label}</span>
        <select
          name="lang"
          defaultValue={currentLang}
          onChange={() =>
            startTransition(() => formRef.current?.requestSubmit())
          }
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
