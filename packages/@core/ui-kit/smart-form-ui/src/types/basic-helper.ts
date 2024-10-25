import type { VNodeChild } from 'vue';

interface BasicHelperProps {
  color?: string;
  fontSize?: string;
  maxWidth: string;
  placement?: string;
  showIndex?: boolean;
  text?: JSX.Element | string | string[] | VNodeChild;
}

export { BasicHelperProps };
