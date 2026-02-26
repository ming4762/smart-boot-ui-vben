import { mergeWithArrayOverride } from '@vben/utils';

type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>;

function arrayToNestedObject(pathArray: string[], value: any) {
  let result = value;
  for (const key of pathArray.toReversed()) {
    result = { [key]: result };
  }
  return result;
}

/**
 * Load locale modules with directory structure
 * @param regexp - Regular expression to match language and file names
 * @param modules - The modules object containing paths and import functions
 * @returns A map of locales to their corresponding import functions
 */
function loadLocalesMapFromDir(
  regexp: RegExp,
  modules: Record<string, () => Promise<unknown>>,
): Record<string, ImportLocaleFn> {
  const localesRaw: Record<string, Record<string, () => Promise<unknown>>> = {};
  const localesMap: Record<string, any> = {};
  // Iterate over the modules to extract language and file names
  for (const path in modules) {
    const match = path.match(regexp);
    if (match) {
      const [_, locale, fileName] = match;
      if (locale && fileName) {
        if (!localesRaw[locale]) {
          localesRaw[locale] = {};
        }
        if (modules[path]) {
          localesRaw[locale][fileName] = modules[path];
        }
      }
    }
  }
  // Convert raw locale data into async import functions
  for (const [locale, files] of Object.entries(localesRaw)) {
    localesMap[locale] = async () => {
      let messages: Record<string, any> = {};
      for (const [fileName, importFn] of Object.entries(files)) {
        const value = ((await importFn()) as any)?.default;
        if (fileName.includes('.')) {
          const filePath = fileName.split('.');
          messages = mergeWithArrayOverride(
            arrayToNestedObject(filePath, value),
            messages,
          );
        } else {
          messages[fileName] = value;
        }
      }
      return { default: messages };
    };
  }

  return localesMap;
}

export { loadLocalesMapFromDir };
