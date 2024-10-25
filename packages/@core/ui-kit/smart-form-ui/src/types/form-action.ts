import type { ColEx } from './form-item';

import { ButtonProps } from 'ant-design-vue';

interface BasicFormActionProps {
  actionColOptions?: Partial<ColEx>;
  actionSpan?: number;
  hideAdvanceBtn?: boolean;
  isAdvanced?: boolean;
  resetButtonOptions?: ButtonProps;
  showActionButtonGroup?: boolean;
  showAdvancedButton?: boolean;
  showResetButton?: boolean;
  showSubmitButton?: boolean;
  submitButtonOptions?: ButtonProps;
}

interface BasicFormActionListeners {
  toggleAdvanced: () => void;
}

export { BasicFormActionListeners, BasicFormActionProps };
