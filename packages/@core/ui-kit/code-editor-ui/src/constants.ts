enum Language {
  HTML = 'html',
  JAVA = 'java',
  JAVASCRIPT = 'javascript',
  JSON = 'json',
  XML = 'xml',
}

const modeMap: Record<Language, () => Promise<Record<string, any>>> = {
  [Language.HTML]: () => import('@codemirror/lang-html'),
  [Language.JAVA]: () => import('@codemirror/lang-java'),
  [Language.JAVASCRIPT]: () => import('@codemirror/lang-javascript'),
  [Language.JSON]: () => import('@codemirror/lang-json'),
  [Language.XML]: () => import('@codemirror/lang-xml'),
};

const getLanguagePackage = (model: Language) => {
  return modeMap[model];
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

export { DarkTheme, getLanguagePackage, Language, LightTheme };
