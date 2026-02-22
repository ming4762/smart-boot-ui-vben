import type { ButtonProps } from 'antdv-next';
import type { ModalFuncProps } from 'antdv-next/dist/modal/interface';

import type { VNode } from 'vue';

import type { HttpResponse } from '@vben/request';
import type { Recordable } from '@vben/types';

import { h } from 'vue';

import { Check, createIconifyIcon, Info } from '@vben/icons';
import { $t } from '@vben/locales';
import { useApiExceptionStore } from '@vben/stores';
import { isString } from '@vben/utils';

import { message as Message, Modal } from 'antdv-next';

interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  buttons?: Array<(ButtonProps & { name: string }) | string>;
  footerProps?: Recordable<any>;
  iconType?: 'error' | 'info' | 'success' | 'warning';
}
type ModalOptionsPartial = Partial<ModalOptionsEx> &
  Pick<ModalOptionsEx, 'content'>;

type MessageOptions = string | { message: string };

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
      return () => <Info class="modal-icon-info anticon" />;
    }
    case 'success': {
      return () => <Check class="modal-icon-success anticon" />;
    }
    case 'warning': {
      return () => <Info class="modal-icon-warning anticon" />;
    }
    default: {
      return () => h(CloseOutline);
      // return <CloseCircleFilled class="modal-icon-error" />;
    }
  }
}

function createModalOptions(
  options: ModalOptionsPartial,
  icon?: string,
): ModalOptionsPartial {
  const result: ModalOptionsPartial = {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
  };
  if (icon) {
    result.icon = getIcon(icon);
  }
  return result;
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
  return Modal.error(
    createModalOptions({
      title: $t('common.message.errorTip'),
      ...options,
    }),
  );
};

/**
 * 确认弹窗
 * @param options
 */
const createConfirm = (options: ModalOptionsEx) => {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const modalOptions = createModalOptions(
    {
      ...options,
      footerProps: {
        ...options.footerProps,
        class: ['ant-modal-confirm-btns'],
      },
    },
    iconType,
  );
  return Modal.confirm({
    ...modalOptions,
  });
};

const createError500Modal = (e: HttpResponse) => {
  const { exceptionNo } = e;
  if (!exceptionNo) {
    return false;
  }
  const { handleShow } = useApiExceptionStore();
  handleShow(exceptionNo);
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

const warnMessage = (options: MessageOptions | string) => {
  if (isString(options)) {
    return Message.warning(options);
  }
  return Message.warning(options.message);
};

export {
  createConfirm,
  createErrorModal,
  errorMessage,
  successMessage,
  warnMessage,
};
