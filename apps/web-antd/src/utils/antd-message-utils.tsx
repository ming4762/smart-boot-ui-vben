import type { VNode } from 'vue';
import { h } from 'vue';

import { Check, createIconifyIcon, Info } from '@vben/icons';
import { $t } from '@vben/locales';
import { isString } from '@vben/utils';

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

const CloseOutline = createIconifyIcon('carbon:close-outline');

/**
 * todo：待优化
 * @param iconType
 */
function getIcon(iconType: string): () => VNode {
  switch (iconType) {
    case 'info': {
      return () => <Info class="modal-icon-info" />;
    }
    case 'success': {
      return () => <Check class="modal-icon-success" />;
    }
    case 'warning': {
      return () => <Info class="modal-icon-warning" />;
    }
    default: {
      return () => h(CloseOutline);
      // return <CloseCircleFilled class="modal-icon-error" />;
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
