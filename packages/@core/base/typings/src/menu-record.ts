import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

import type { Recordable } from './helper';

/**
 * 扩展路由原始对象
 */
type ExRouteRecordRaw = RouteRecordRaw & {
  parent?: string;
  parents?: string[];
  path?: any;
};

interface MenuRecordBadgeRaw {
  /**
   * 徽标
   */
  badge?: string;
  /**
   * 徽标类型
   */
  badgeType?: 'dot' | 'normal';
  /**
   * 徽标颜色
   */
  badgeVariants?: 'destructive' | 'primary' | string;
}

/**
 * 菜单原始对象
 */
interface MenuRecordRaw extends MenuRecordBadgeRaw {
  /**
   * 激活时的图标名
   */
  activeIcon?: string;
  /**
   * 子菜单
   */
  children?: MenuRecordRaw[];
  /**
   * 是否禁用菜单
   * @default false
   */
  disabled?: boolean;
  /**
   * 图标名
   */
  icon?: Component | string;
  /** 菜单业务功能ID */
  functionId?: number;
  /** 是否允许收藏 */
  favoritable?: boolean;
  /** 是否为收藏快捷项 */
  favoriteShortcut?: boolean;
  /** 是否为不可用收藏清理项 */
  favoriteCleanup?: boolean;
  /** 菜单节点唯一标识，默认使用 path */
  key?: string;
  /**
   * 菜单名
   */
  name: string;
  /**
   * 排序号
   */
  order?: number;
  /**
   * 父级路径
   */
  parent?: string;
  /**
   * 所有父级路径
   */
  parents?: string[];
  /**
   * 菜单路径，唯一，可当作key
   */
  path: string;
  /**
   * 菜单参数
   */
  query?: Recordable<any>;
  /** 是否参与菜单搜索 */
  searchable?: boolean;
  /**
   * 是否显示菜单
   * @default true
   */
  show?: boolean;
  /** 实际跳转地址，默认使用 path */
  targetPath?: string;
}

export type { ExRouteRecordRaw, MenuRecordBadgeRaw, MenuRecordRaw };
