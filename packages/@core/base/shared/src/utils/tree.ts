interface TreeConfigOptions {
  /**
   * 子属性的名称，默认为 'children'
   */
  childProps: string;
}

/**
 * 获取默认的子节点属性名
 */
const DEFAULT_CHILD_PROPS = 'children';

/**
 * 解析树配置选项
 */
function resolveChildProps(options?: TreeConfigOptions): string {
  return options?.childProps ?? DEFAULT_CHILD_PROPS;
}

/**
 * @zh_CN 遍历树形结构，并返回所有节点中指定的值。
 * @param tree 树形结构数组
 * @param getValue 获取节点值的函数
 * @param options 作为子节点数组的可选属性名称。
 * @returns 所有节点中指定的值的数组
 */
function traverseTreeValues<T, V>(
  tree: T[],
  getValue: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const result: V[] = [];
  const childProps = resolveChildProps(options);

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = (treeNode as Record<string, unknown>)?.[childProps];
    if (Array.isArray(children) && children.length > 0) {
      for (const child of children) {
        dfs(child as T);
      }
    }
  };

  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result;
}

/**
 * 根据条件过滤给定树结构的节点，并以原有顺序返回所有匹配节点的数组。
 * @param tree 要过滤的树结构的根节点数组。
 * @param filter 用于匹配每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 * @returns 包含所有匹配节点的数组。
 */
function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions,
): T[] {
  const childProps = resolveChildProps(options);

  const _filterTree = (nodes: T[]): T[] => {
    const filteredNodes: T[] = [];

    for (const node of nodes) {
      if (filter(node)) {
        const children = node[childProps] as T[] | undefined;
        const filteredChildren =
          Array.isArray(children) && children.length > 0
            ? _filterTree(children)
            : undefined;

        // 创建新对象，避免修改原始节点
        filteredNodes.push({
          ...node,
          ...(filteredChildren && filteredChildren.length > 0
            ? { [childProps]: filteredChildren }
            : {}),
        } as T);
      }
    }

    return filteredNodes;
  };

  return _filterTree(tree);
}

/**
 * 根据条件重新映射给定树结构的节点
 * @param tree 要映射的树结构的根节点数组。
 * @param mapper 用于映射每个节点的函数。
 * @param options 作为子节点数组的可选属性名称。
 * @returns 映射后的新树形结构
 */
function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T, parent: null | V) => V,
  options?: TreeConfigOptions,
  parent: null | V = null,
): V[] {
  const childProps = resolveChildProps(options);

  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node, parent as null | V);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(
        mapperNode[childProps],
        mapper,
        options,
        mapperNode as V,
      );
    }
    return mapperNode as V;
  });
}

interface TreeNode extends Record<string, unknown> {
  children?: TreeNode[];
  hasChild?: boolean;
  hasParent?: boolean;
}

/**
 * 将扁平列表转换为树形结构
 * @param list 需要转换的列表
 * @param keyGetter 获取节点唯一标识的函数
 * @param parentKeyGetter 获取父节点标识的函数
 * @param topParentCode 顶级父节点标识，默认为 '0'
 * @returns 转换后的树形结构数组
 */
function listToTree<T extends TreeNode>(
  list: null | T[],
  keyGetter: (arg: T) => number | string,
  parentKeyGetter: (arg: T) => number | string,
  topParentCode?: null | number | string,
): T[] {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }

  const rootCode = topParentCode ?? '0';

  // 使用 Map 优化查找性能，O(n) 时间复杂度
  const nodeMap = new Map<number | string, T>();
  const treeList: T[] = [];

  // 第一次遍历：建立 id -> node 的映射
  for (const node of list) {
    const id = keyGetter(node);
    nodeMap.set(id, node);
  }

  // 第二次遍历：建立父子关系
  for (const node of list) {
    const parentId = parentKeyGetter(node);

    // 如果是顶级节点
    if (parentId === null || parentId === rootCode) {
      treeList.push(node);
      continue;
    }

    // 查找父节点
    const parent = nodeMap.get(parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
      parent.hasChild = true;
      node.hasParent = true;
    }
  }

  return treeList;
}

/**
 * 对树形结构数据进行递归排序
 * @param treeData - 树形数据数组
 * @param sortFunction - 排序函数，用于定义排序规则
 * @param options - 配置选项，包括子节点属性名
 * @returns 排序后的树形数据
 */
function sortTree<T extends Record<string, any>>(
  treeData: T[],
  sortFunction: (a: T, b: T) => number,
  options?: TreeConfigOptions,
): T[] {
  const childProps = resolveChildProps(options);

  return treeData.toSorted(sortFunction).map((item) => {
    const children = item[childProps] as T[] | undefined;
    if (Array.isArray(children) && children.length > 0) {
      return {
        ...item,
        [childProps]: sortTree(children, sortFunction, options),
      } as T;
    }
    return item;
  });
}

export { filterTree, listToTree, mapTree, sortTree, traverseTreeValues };

export type { TreeNode };
