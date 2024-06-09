/**
 * 判断两个集合内容是否相同
 * @param set1 集合1
 * @param set2 集合2
 */
export const isSetsEqual = (set1: Set<any>, set2: Set<any>) => {
  // 首先检查两个Set的大小
  if (set1.size !== set2.size) {
    return false;
  }
  // 检查set1的每个元素是否都存在于set2中
  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }
  // 如果所有元素都匹配，则两个Set相同
  return true;
};
