/**
 * 将字符串的首字母大写
 * @param string
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 将字符串的首字母转换为小写。
 *
 * @param str 要转换的字符串
 * @returns 首字母小写的字符串
 */
function toLowerCaseFirstLetter(str: string): string {
  if (!str) return str; // 如果字符串为空，直接返回
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 *  生成驼峰命名法的键名
 * @param key
 * @param parentKey
 */
function toCamelCase(key: string, parentKey: string): string {
  if (!parentKey) {
    return key;
  }
  return parentKey + key.charAt(0).toUpperCase() + key.slice(1);
}

function kebabToCamelCase(str: string): string {
  return str
    .split('-')
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

/**
 * 驼峰转中划线
 * @param camelCaseName
 */
function camelToLine(camelCaseName: string): string {
  if (camelCaseName.length === 0) {
    return '';
  }
  camelCaseName = camelCaseName.replace(
    camelCaseName.charAt(0),
    camelCaseName.charAt(0).toLowerCase(),
  );
  return camelCaseName.replaceAll(/([A-Z])/g, (match) => {
    return `-${match.toLowerCase()}`;
  });
}

export {
  camelToLine,
  capitalizeFirstLetter,
  kebabToCamelCase,
  toCamelCase,
  toLowerCaseFirstLetter,
};
