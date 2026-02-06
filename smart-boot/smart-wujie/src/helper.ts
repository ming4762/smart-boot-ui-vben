/**
 * 拼接URL路径，自动处理路径分隔符
 * @param path1 基础路径
 * @param path2 要拼接的路径片段，默认值为空字符串
 * @returns 拼接后的URL路径
 */
export function concatUrlPaths(path1: string, path2: string = ''): string {
  // 处理第一个路径：移除末尾所有的/
  const processedPath1 = path1.trim().replace(/\/+$/, '');
  // 处理第二个路径：移除开头所有的/
  const processedPath2 = path2.trim().replace(/^\/+/, '');

  // 边界情况：如果其中一个路径处理后为空，直接返回另一个（避免出现多余的/）
  if (!processedPath1) return processedPath2;
  if (!processedPath2) return processedPath1;

  // 正常拼接：中间用单个/连接
  return `${processedPath1}/${processedPath2}`;
}
