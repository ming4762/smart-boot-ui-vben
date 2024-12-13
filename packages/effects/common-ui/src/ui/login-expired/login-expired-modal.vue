<script setup lang="ts">
import { watch } from 'vue';

import { globalShareState } from '@vben-core/shared/global-state';

interface Props {
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{ cancel: []; confirm: [] }>();

let messageInstance: any | null = null;

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};

watch(
  () => props.open,
  (val) => {
    if (val) {
      messageInstance = globalShareState.getMessage().confirm({
        title: '登录过期',
        content: '登录过期，请重新登录',
        onOk: () => {
          handleConfirm();
        },
        onCancel: () => {
          handleCancel();
        },
      });
    } else {
      messageInstance?.destroy();
      messageInstance = null;
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="less" scoped></style>
