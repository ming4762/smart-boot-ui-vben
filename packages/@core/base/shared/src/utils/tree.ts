interface TreeConfigOptions {
  // 子属性的名称，默认为'children'
  childProps: string;
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
  const { childProps } = options || {
    childProps: 'children',
  };

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = (treeNode as Record<string, any>)?.[childProps];
    if (!children) {
      return;
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child);
      }
    }
  };

  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result.filter(Boolean);
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
  const { childProps } = options || {
    childProps: 'children',
  };

  const _filterTree = (nodes: T[]): T[] => {
    return nodes.filter((node: Record<string, any>) => {
      if (filter(node as T)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps]);
        }
        return true;
      }
      return false;
    });
  };

  return _filterTree(tree);
}

/**
 * 根据条件重新映射给定树结构的节
 * @param tree 要过滤的树结构的根节点数组。
 * @param mapper 用于map每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 */
function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const { childProps } = options || {
    childProps: 'children',
  };
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options);
    }
    return mapperNode as V;
  });
}

interface TreeNode extends Record<string, any> {
  children?: TreeNode[];
  hasChild?: boolean;
  hasParent?: boolean;
}

/**
 * 将list转为树结构
 * @param list 需要转换的list
 * @param keyGetter 获取key函数
 * @param parentKeyGetter 获取value函数
 * @param topParentCode 顶级parent code
 */
function listToTree<T extends TreeNode>(
  list: T[],
  keyGetter: (arg: T) => number | string,
  parentKeyGetter: (arg: T) => number | string,
  topParentCode?: number | string,
): T[] {
  if (list === null) {
    return [];
  }
  if (topParentCode === undefined || topParentCode === null) {
    topParentCode = '0';
  }
  const treeList: T[] = [];
  for (const value of list) {
    const parentId = parentKeyGetter(value);
    // 如果父ID 等于顶级父ID，则是顶级节点
    if (parentId === null || parentId === topParentCode) {
      treeList.push(value);
      continue;
    }
    for (const parent of list) {
      const id = keyGetter(parent);
      if (id === parentId) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(value);
        // 设置节点含有下级
        parent.hasChild = true;
        // 设置节点含有上级
        value.hasParent = true;
      }
    }
  }
  return treeList;
}

export { filterTree, listToTree, mapTree, traverseTreeValues };
