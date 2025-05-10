type SmartMarkdownEditMode = 'html' | 'ir' | 'preview' | 'sv' | 'wysiwyg';
type SmartMarkdownThemeMode = 'dark' | 'light';
type SmartMarkdownLang =
  | 'en_US'
  | 'fr_FR'
  | 'ja_JP'
  | 'ko_KR'
  | 'pt_BR'
  | 'ru_RU'
  | 'sv_SE'
  | 'zh_CN'
  | 'zh_TW';

interface SmartMarkdownProps {
  mode?: SmartMarkdownEditMode;
  value?: string;
  theme?: SmartMarkdownThemeMode;
  width?: number | string;
  height?: number | string;
  options?: Record<string, any>;
  lang?: SmartMarkdownLang;
}

interface SmartMarkdownListeners {
  'update:value': [string];
  change: [string];
}

export type { SmartMarkdownListeners, SmartMarkdownProps, SmartMarkdownLang };
