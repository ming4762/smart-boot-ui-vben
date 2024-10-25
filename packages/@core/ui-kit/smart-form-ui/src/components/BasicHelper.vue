<script setup lang="tsx">
import type { CSSProperties } from 'vue';
import { computed, unref } from 'vue';

import { CircleHelp } from '@vben-core/icons';

import { Tooltip } from 'ant-design-vue';

import { BasicHelperProps } from '../types/basic-helper';

interface Props extends BasicHelperProps {}

defineOptions({
  name: 'BasicHelp',
});

const props = withDefaults(defineProps<Props>(), {
  color: '#ffffff',
  fontSize: '14px',
  maxWidth: '600px',
  placement: 'right',
});

const getTooltipStyle = computed(
  (): CSSProperties => ({ color: props.color, fontSize: props.fontSize }),
);

const getOverlayStyle = computed(
  (): CSSProperties => ({ maxWidth: props.maxWidth }),
);

function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

function renderTitle() {
  const textList = props.text;

  if (isString(textList)) {
    return <p>{textList}</p>;
  }

  if (isArray(textList)) {
    return textList.map((text, index) => {
      return (
        <p key={text}>
          <>
            {props.showIndex ? `${index + 1}. ` : ''}
            {text}
          </>
        </p>
      );
    });
  }
  return <div>{textList}</div>;
}

const RenderFunction = () => {
  return () => {
    return (
      <Tooltip
        autoAdjustOverflow={true}
        getPopupContainer={() => getPopupContainer()}
        overlayClassName="basic-help__wrap"
        overlayStyle={unref(getOverlayStyle)}
        placement={props.placement as 'right'}
        title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
      >
        <span class="basic-help">{getSlot(slots) || <CircleHelp />}</span>
      </Tooltip>
    );
  };
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped lang="less">
.basic-help {
  display: inline-block;
  margin-left: 6px;
  color: #909399;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #13c2c2;
  }
  &__wrap {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
