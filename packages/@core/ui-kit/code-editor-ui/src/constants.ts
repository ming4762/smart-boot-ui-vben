import type { Extension } from '@codemirror/state';

import nullParseLinter from './utils/NullParseLinter';

enum Language {
  HTML = 'html',
  JAVA = 'java',
  JAVASCRIPT = 'javascript',
  JSON = 'json',
  SQL = 'sql',
  XML = 'xml',
}

const modeMap: Record<Language, () => Promise<Record<string, any>>> = {
  [Language.HTML]: () => import('@codemirror/lang-html'),
  [Language.JAVA]: () => import('@codemirror/lang-java'),
  [Language.JAVASCRIPT]: () => import('@codemirror/lang-javascript'),
  [Language.JSON]: () => import('@codemirror/lang-json'),
  [Language.XML]: () => import('@codemirror/lang-xml'),
  [Language.SQL]: () => import('@codemirror/lang-sql'),
};

const lintModeMap: Record<Language, () => Promise<Extension[]>> = {
  [Language.HTML]: async () => [],
  [Language.JAVA]: async () => [],
  [Language.JAVASCRIPT]: async () => [],
  [Language.JSON]: async () => {
    const { linter, lintGutter } = await import('@codemirror/lint');
    const { jsonParseLinter } = await import('@codemirror/lang-json');
    return [
      linter(nullParseLinter(jsonParseLinter), { delay: 200 }),
      lintGutter(),
    ];
  },
  [Language.XML]: async () => [],
  [Language.SQL]: async () => [],
};

const getLanguagePackage = (model: Language) => {
  return modeMap[model];
};

/**
 * 获取lint扩展
 * @param model
 */
const getLintExtension = (model: Language) => {
  const handler = lintModeMap[model];
  return handler ? handler() : [];
};

const DarkTheme = {
  '&': { backgroundColor: '#1e1e1e', color: '#d4d4d4' },
  '.cm-content': { caretColor: '#ffffff' },
  '.cm-line': { color: '#d4d4d4' },
};

const LightTheme = {
  '&': { backgroundColor: '#ffffff', color: '#000000' },
  '.cm-content': { caretColor: '#000000' },
  '.cm-line': { color: '#000000' },
};

export {
  DarkTheme,
  getLanguagePackage,
  getLintExtension,
  Language,
  LightTheme,
};
