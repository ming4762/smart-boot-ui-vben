import type { VxePagerPropTypes } from 'vxe-pc-ui';

export const DEFAULT_PAGE_SIZE = 50;

export const DEFAULT_PAGE_SIZE_OPTIONS = [50, 100, 500, 1000, 3000];

export const DEFAULT_PAGE_LAYOUTS = [
  'Sizes',
  'PrevJump',
  'PrevPage',
  'Number',
  'NextJump',
  'FullJump',
  'Total',
] as VxePagerPropTypes.Layouts;
