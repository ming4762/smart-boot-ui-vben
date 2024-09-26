import { $t } from '@vben/locales';
import { isString } from '@vben/utils';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons-vue';
import { Modal, type ModalFuncProps } from 'ant-design-vue';

interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'error' | 'info' | 'success' | 'warning';
}
type ModalOptionsPartial = Partial<ModalOptionsEx> &
  Pick<ModalOptionsEx, 'content'>;

const getBaseOptions = () => {
  return {
    centered: true,
    okText: $t('common.confirm'),
  };
};

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  return isString(content) ? (
    <div innerHTML={`<div>${content as string}</div>`}></div>
  ) : (
    content
  );
}

function getIcon(iconType: string) {
  switch (iconType) {
    case 'warning': {
      return <InfoCircleFilled class="modal-icon-warning" />;
    }
    case 'success': {
      return <CheckCircleFilled class="modal-icon-success" />;
    }
    case 'info': {
      return <InfoCircleFilled class="modal-icon-info" />;
    }
    default: {
      return <CloseCircleFilled class="modal-icon-error" />;
    }
  }
}

function createModalOptions(
  options: ModalOptionsPartial,
  icon: string,
): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}

/**
 * 创建错误信息弹窗
 * @param options
 */
const createErrorModal = (options: ModalOptionsPartial) => {
  return Modal.error(createModalOptions(options, 'error'));
};

export { createErrorModal };
