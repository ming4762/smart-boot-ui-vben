<script setup lang="ts">
import type { SmartMarkdownListeners, SmartMarkdownProps } from './types';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  useTemplateRef,
  watch,
} from 'vue';

import Vditor from 'vditor';

import { getTheme } from './getTheme';

const props = withDefaults(defineProps<SmartMarkdownProps>(), {
  value: '',
  theme: 'light',
});

const emit = defineEmits<SmartMarkdownListeners>();

const elRef = useTemplateRef<HTMLDivElement>('elRef');

let markdownEditor: null | Vditor = null;

/**
 * 预览
 */
const htmlContentRef = ref('');
const computedIsHtml = computed(() => props.mode === 'html');

/**
 * 主题
 */
const computedThemeMode = computed(() => {
  if (props.mode === 'html') {
    return null;
  }
  if (props.mode === 'preview') {
    return getTheme(props.theme, 'content');
  }
  return getTheme(props.theme);
});

/**
 * 初始化编辑器
 */
const initEditor = () => {
  if (markdownEditor) {
    return;
  }
  markdownEditor = new Vditor(unref(elRef)!, {
    height: 500,
    placeholder: '请输入内容',
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    input(value: string) {
      emit('update:value', value);
      emit('change', value);
    },
    after() {
      nextTick(() => {
        markdownEditor?.setValue(props.value);
      });
    },
  });
};

const getPreviewOptions = () => {
  return {
    mode: unref(computedThemeMode) as never,
    theme: {
      current: getTheme(props.theme, 'content'),
    },
    hljs: {
      style: getTheme(props.theme, 'code'),
    },
  };
};

const renderPreview = () => {
  Vditor.preview(unref(elRef)!, props.value, getPreviewOptions());
};

watch(
  () => props.value,
  async (newValue, oldValue) => {
    if (unref(computedIsHtml)) {
      htmlContentRef.value = await Vditor.md2html(
        newValue,
        getPreviewOptions(),
      );
    } else if (props.mode === 'preview') {
      if (newValue !== oldValue && unref(elRef)) {
        renderPreview();
      }
    } else {
      if (newValue !== oldValue && markdownEditor) {
        markdownEditor.setValue(newValue);
      }
    }
  },
  { immediate: true },
);

/**
 * 销毁编辑器
 */
const destroy = () => {
  if (!markdownEditor) {
    return;
  }
  try {
    markdownEditor.destroy();
  } catch {
    // do nothing
  }
  markdownEditor = null;
};

onMounted(() => {
  if (unref(computedIsHtml)) {
    return;
  }
  if (props.mode === 'preview') {
    renderPreview();
  } else {
    initEditor();
  }
});

onBeforeUnmount(() => {
  destroy();
});
</script>

<template>
  <div v-if="computedIsHtml" v-html="htmlContentRef"></div>
  <div v-else ref="elRef"></div>
</template>

<style scoped></style>
