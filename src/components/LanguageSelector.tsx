// components/LanguageSelector.tsx - Language selection dropdown for solutions

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/types';
import { LANGUAGE_DISPLAY_NAMES } from '@/lib/editor';

interface LanguageSelectorProps {
  /** Currently selected language */
  value: SupportedLanguage;
  /** Called when language changes */
  onChange: (language: SupportedLanguage) => void;
  /** Whether disabled */
  disabled?: boolean;
}

/**
 * Dropdown selector for programming languages
 * Used in solution forms to select syntax highlighting language
 */
export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as SupportedLanguage)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {LANGUAGE_DISPLAY_NAMES[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
