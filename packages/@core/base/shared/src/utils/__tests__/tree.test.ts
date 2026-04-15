import type { TreeNode } from '../tree';

import { describe, expect, it } from 'vitest';

import { filterTree, listToTree, mapTree, sortTree, traverseTreeValues } from '../tree';

describe('traverseTreeValues', () => {
  interface Node {
    children?: Node[];
    name: string;
  }

  type NodeValue = string;

  const sampleTree: Node[] = [
    {
      name: 'A',
      children: [
        { name: 'B' },
        {
          name: 'C',
          children: [{ name: 'D' }, { name: 'E' }],
        },
      ],
    },
    {
      name: 'F',
      children: [
        { name: 'G' },
        {
          name: 'H',
          children: [{ name: 'I' }],
        },
      ],
    },
  ];

  it('traverses tree and returns all node values', () => {
    const values = traverseTreeValues<Node, NodeValue>(
      sampleTree,
      (node) => node.name,
      {
        childProps: 'children',
      },
    );
    expect(values).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
  });

  it('handles empty tree', () => {
    const values = traverseTreeValues<Node, NodeValue>([], (node) => node.name);
    expect(values).toEqual([]);
  });

  it('handles tree with only root node', () => {
    const rootNode = { name: 'A' };
    const values = traverseTreeValues<Node, NodeValue>(
      [rootNode],
      (node) => node.name,
    );
    expect(values).toEqual(['A']);
  });

  it('handles tree with only leaf nodes', () => {
    const leafNodes = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    const values = traverseTreeValues<Node, NodeValue>(
      leafNodes,
      (node) => node.name,
    );
    expect(values).toEqual(['A', 'B', 'C']);
  });
});

describe('filterTree', () => {
  const tree = [
    {
      id: 1,
      children: [
        { id: 2 },
        { id: 3, children: [{ id: 4 }, { id: 5 }, { id: 6 }] },
        { id: 7 },
      ],
    },
    { id: 8, children: [{ id: 9 }, { id: 10 }] },
    { id: 11 },
  ];

  it('should return all nodes when condition is always true', () => {
    const result = filterTree(tree, () => true, { childProps: 'children' });
    expect(result).toEqual(tree);
  });

  it('should return only root nodes when condition is always false', () => {
    const result = filterTree(tree, () => false);
    expect(result).toEqual([]);
  });

  it('should return nodes with even id values', () => {
    const result = filterTree(tree, (node) => node.id % 2 === 0);
    expect(result).toEqual([{ id: 8, children: [{ id: 10 }] }]);
  });

  it('should return nodes with odd id values and their ancestors', () => {
    const result = filterTree(tree, (node) => node.id % 2 === 1);
    expect(result).toEqual([
      {
        id: 1,
        children: [{ id: 3, children: [{ id: 5 }] }, { id: 7 }],
      },
      { id: 11 },
    ]);
  });

  it('should return nodes with "leaf" in their name', () => {
    const tree = [
      {
        name: 'root',
        children: [
          { name: 'leaf 1' },
          {
            name: 'branch',
            children: [{ name: 'leaf 2' }, { name: 'leaf 3' }],
          },
          { name: 'leaf 4' },
        ],
      },
    ];
    const result = filterTree(
      tree,
      (node) => node.name.includes('leaf') || node.name === 'root',
    );
    expect(result).toEqual([
      {
        name: 'root',
        children: [{ name: 'leaf 1' }, { name: 'leaf 4' }],
      },
    ]);
  });
});

describe('listToTree', () => {
  interface TestNode extends TreeNode {
    children?: TestNode[];
    hasChild?: boolean;
    hasParent?: boolean;
    id: number;
    name: string;
    parentId: null | number | string;
  }

  const sampleList: TestNode[] = [
    { id: 1, parentId: null, name: 'Root 1' },
    { id: 2, parentId: 1, name: 'Child 1-1' },
    { id: 3, parentId: 1, name: 'Child 1-2' },
    { id: 4, parentId: 2, name: 'Child 2-1' },
    { id: 5, parentId: null, name: 'Root 2' },
    { id: 6, parentId: 5, name: 'Child 5-1' },
  ];

  it('should convert flat list to tree structure', () => {
    const result = listToTree(
      sampleList,
      (node) => node.id,
      (node) => node.parentId as number | string,
      undefined,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe('Root 1');
    expect(result[0]?.children).toHaveLength(2);
    expect(result[0]?.hasChild).toBe(true);
    expect(result[1]?.name).toBe('Root 2');
    expect(result[1]?.children).toHaveLength(1);
  });

  it('should set hasChild and hasParent flags correctly', () => {
    const result = listToTree(
      sampleList,
      (node) => node.id,
      (node) => node.parentId as number | string,
      undefined,
    );

    // Root nodes have hasChild but no hasParent
    expect(result[0]?.hasChild).toBe(true);
    expect(result[0]?.hasParent).toBeUndefined();

    // Child nodes have hasParent
    const child = result[0]?.children?.[0];
    expect(child?.hasParent).toBe(true);
  });

  it('should handle empty list', () => {
    const result = listToTree(
      [] as TestNode[],
      (node) => node.id,
      (node) => node.parentId as number | string,
      undefined,
    );
    expect(result).toEqual([]);
  });

  it('should handle null input', () => {
    const result = listToTree(
      [] as TestNode[],
      (node) => node.id,
      (node) => node.parentId as number | string,
      null,
    );
    expect(result).toEqual([]);
  });

  it('should use default topParentCode when not provided', () => {
    const listWithDefaultParent: TestNode[] = [
      { id: 1, parentId: '0', name: 'Root' },
      { id: 2, parentId: 1, name: 'Child' },
    ];

    const result = listToTree(
      listWithDefaultParent,
      (node) => node.id,
      (node) => node.parentId as number | string,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Root');
  });

  it('should handle custom topParentCode', () => {
    const listWithCustomRoot: TestNode[] = [
      { id: 1, parentId: -1, name: 'Root' },
      { id: 2, parentId: 1, name: 'Child' },
    ];

    const result = listToTree(
      listWithCustomRoot,
      (node) => node.id,
      (node) => node.parentId as number | string,
      -1,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Root');
  });

  it('should handle deeply nested tree', () => {
    const deepList: TestNode[] = [
      { id: 1, parentId: null, name: 'Level 1' },
      { id: 2, parentId: 1, name: 'Level 2' },
      { id: 3, parentId: 2, name: 'Level 3' },
      { id: 4, parentId: 3, name: 'Level 4' },
      { id: 5, parentId: 4, name: 'Level 5' },
    ];

    const result = listToTree(
      deepList,
      (node) => node.id,
      (node) => node.parentId as number | string,
      null,
    );

    expect(result).toHaveLength(1);
    let current = result[0];
    for (let i = 0; i < 4; i++) {
      expect(current?.name).toBe(`Level ${i + 1}`);
      current = current?.children?.[0];
    }
    expect(current?.name).toBe('Level 5');
    expect(current?.children).toBeUndefined();
  });

  it('should handle string keys', () => {
    interface StringKeyNode extends TreeNode {
      children?: StringKeyNode[];
      code: string;
      hasChild?: boolean;
      hasParent?: boolean;
      name: string;
      parentCode: null | string;
    }

    const stringKeyList: StringKeyNode[] = [
      { code: 'A', parentCode: null, name: 'Root A' },
      { code: 'B', parentCode: 'A', name: 'Child B' },
      { code: 'C', parentCode: 'A', name: 'Child C' },
    ];

    const result = listToTree(
      stringKeyList,
      (node) => node.code,
      (node) => node.parentCode as string,
      null,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.code).toBe('A');
    expect(result[0]?.children).toHaveLength(2);
  });
});

describe('sortTree', () => {
  interface SortNode extends TreeNode {
    children?: SortNode[];
    id: number;
    name: string;
    order: number;
  }

  const unsortedTree: SortNode[] = [
    {
      id: 3,
      name: 'Node 3',
      order: 3,
      children: [
        { id: 32, name: 'Child 32', order: 2 },
        { id: 31, name: 'Child 31', order: 1 },
        { id: 33, name: 'Child 33', order: 3 },
      ],
    },
    { id: 1, name: 'Node 1', order: 1 },
    {
      id: 2,
      name: 'Node 2',
      order: 2,
      children: [{ id: 21, name: 'Child 21', order: 1 }],
    },
  ];

  it('should sort tree nodes by order property', () => {
    const result = sortTree(unsortedTree, (a, b) => a.order - b.order);

    expect(result[0]?.id).toBe(1);
    expect(result[1]?.id).toBe(2);
    expect(result[2]?.id).toBe(3);
  });

  it('should recursively sort child nodes', () => {
    const result = sortTree(unsortedTree, (a, b) => a.order - b.order);

    const node3Children = result[2]?.children || [];
    expect(node3Children[0]?.id).toBe(31);
    expect(node3Children[1]?.id).toBe(32);
    expect(node3Children[2]?.id).toBe(33);
  });

  it('should handle empty tree', () => {
    const result = sortTree([] as SortNode[], (a, b) => a.order - b.order);
    expect(result).toEqual([]);
  });

  it('should handle tree without children', () => {
    const simpleTree: SortNode[] = [
      { id: 3, name: 'Node 3', order: 3 },
      { id: 1, name: 'Node 1', order: 1 },
      { id: 2, name: 'Node 2', order: 2 },
    ];

    const result = sortTree(simpleTree, (a, b) => a.order - b.order);

    expect(result[0]?.id).toBe(1);
    expect(result[1]?.id).toBe(2);
    expect(result[2]?.id).toBe(3);
  });

  it('should support custom childProps', () => {
    interface CustomChildNode extends TreeNode {
      id: number;
      items?: CustomChildNode[];
      order: number;
    }

    const customTree: CustomChildNode[] = [
      {
        id: 2,
        order: 2,
        items: [
          { id: 22, order: 2 },
          { id: 21, order: 1 },
        ],
      },
      { id: 1, order: 1 },
    ];

    const result = sortTree(customTree, (a, b) => a.order - b.order, {
      childProps: 'items',
    });

    expect(result[0]?.id).toBe(1);
    expect(result[1]?.items?.[0]?.id).toBe(21);
    expect(result[1]?.items?.[1]?.id).toBe(22);
  });

  it('should handle descending sort', () => {
    const result = sortTree(unsortedTree, (a, b) => b.order - a.order);

    expect(result[0]?.id).toBe(3);
    expect(result[1]?.id).toBe(2);
    expect(result[2]?.id).toBe(1);
  });

  it('should not mutate original tree', () => {
    const originalTree = structuredClone(unsortedTree);
    sortTree(unsortedTree, (a, b) => a.order - b.order);

    // Note: sortTree uses toSorted which creates a new array,
    // but the map operation creates new objects for nodes with children
    expect(unsortedTree[0]?.id).toBe(originalTree[0]?.id);
  });

  it('should handle sort by name alphabetically', () => {
    interface NameNode extends TreeNode {
      children?: NameNode[];
      name: string;
    }

    const nameTree: NameNode[] = [
      {
        name: 'Charlie',
        children: [{ name: 'Zebra' }, { name: 'Apple' }],
      },
      { name: 'Alice' },
      { name: 'Bob' },
    ];

    const result = sortTree(nameTree, (a, b) => a.name.localeCompare(b.name));

    expect(result[0]?.name).toBe('Alice');
    expect(result[1]?.name).toBe('Bob');
    expect(result[2]?.name).toBe('Charlie');
    expect(result[2]?.children?.[0]?.name).toBe('Apple');
    expect(result[2]?.children?.[1]?.name).toBe('Zebra');
  });
});

describe('mapTree', () => {
  it('map infinite depth tree using mapTree', () => {
    const tree = [
      {
        id: 1,
        name: 'node1',
        children: [
          { id: 2, name: 'node2' },
          { id: 3, name: 'node3' },
          {
            id: 4,
            name: 'node4',
            children: [
              {
                id: 5,
                name: 'node5',
                children: [
                  { id: 6, name: 'node6' },
                  { id: 7, name: 'node7' },
                ],
              },
              { id: 8, name: 'node8' },
            ],
          },
        ],
      },
    ];
    const newTree = mapTree(tree, (node) => ({
      ...node,
      name: `${node.name}-new`,
    }));

    expect(newTree).toEqual([
      {
        id: 1,
        name: 'node1-new',
        children: [
          { id: 2, name: 'node2-new' },
          { id: 3, name: 'node3-new' },
          {
            id: 4,
            name: 'node4-new',
            children: [
              {
                id: 5,
                name: 'node5-new',
                children: [
                  { id: 6, name: 'node6-new' },
                  { id: 7, name: 'node7-new' },
                ],
              },
              { id: 8, name: 'node8-new' },
            ],
          },
        ],
      },
    ]);
  });
});
