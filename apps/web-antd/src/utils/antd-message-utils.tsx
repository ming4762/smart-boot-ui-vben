import type { HttpResponse } from '@vben/request';

import type { VNode } from 'vue';
import { h } from 'vue';

import { Check, createIconifyIcon, Info } from '@vben/icons';
import { $t } from '@vben/locales';
import { isString } from '@vben/utils';

import { message as Message, Modal, type ModalFuncProps } from 'ant-design-vue';

interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'error' | 'info' | 'success' | 'warning';
}
type ModalOptionsPartial = Partial<ModalOptionsEx> &
  Pick<ModalOptionsEx, 'content'>;

type MessageOptions = { message: string } | string;

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

const successMessage = (options: MessageOptions) => {
  if (isString(options)) {
    return Message.success(options);
  }
  return Message.success(options.message);
};

/**
 * 创建错误信息弹窗
 * @param options
 */
const createErrorModal = (options: ModalOptionsPartial) => {
  return Modal.error(createModalOptions(options, 'error'));
};

const createError500Modal = (e: HttpResponse) => {
  console.error(e);
};

const errorMessage = (e: Error | HttpResponse | string) => {
  if (isString(e)) {
    return Message.error(e);
  }
  console.error(e);
  const code = (e as any).code;
  switch (code) {
    case 500: {
      return createError500Modal(e as HttpResponse);
    }
    default: {
      return Message.error(e.message);
    }
  }
};

export { createErrorModal, errorMessage, successMessage };
