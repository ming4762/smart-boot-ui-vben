import type { VbenFormProps } from '@vben-core/form-ui';
import type { VNode } from 'vue';

type SmartTableFormSlots =
  | Record<string, (data: any) => VNode | VNode[]>
  | string[];

interface SmartTableBasicFormConfig extends VbenFormProps {
  class?: string;
  slots?: SmartTableFormSlots;
}

export type { SmartTableBasicFormConfig };
