type SmartMarkdownEditMode = 'html' | 'ir' | 'preview' | 'sv' | 'wysiwyg';
type SmartMarkdownThemeMode = 'dark' | 'light';

interface SmartMarkdownProps {
  mode?: SmartMarkdownEditMode;
  value?: string;
  theme?: SmartMarkdownThemeMode;
}

interface SmartMarkdownListeners {
  'update:value': [string];
  change: [string];
}

export type { SmartMarkdownListeners, SmartMarkdownProps };
