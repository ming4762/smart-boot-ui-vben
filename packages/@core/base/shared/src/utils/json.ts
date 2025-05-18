/**
 * 判断是否是json字符串
 * @param str
 */
export function isJsonString(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
