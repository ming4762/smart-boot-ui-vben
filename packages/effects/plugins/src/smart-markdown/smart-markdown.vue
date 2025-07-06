<script setup lang="ts">
import type {
  SmartMarkdownLang,
  SmartMarkdownListeners,
  SmartMarkdownProps,
} from './types';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue';

import { $t as t } from '@vben/locales';
import { preferences } from '@vben/preferences';

import Vditor from 'vditor';

import { getTheme } from './getTheme';

defineOptions({
  name: 'SmartMarkdown',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SmartMarkdownProps>(), {
  value: '',
  width: '100%',
  height: 500,
});
const emit = defineEmits<SmartMarkdownListeners>();

const attrs = useAttrs();

const elRef = useTemplateRef<HTMLDivElement>('elRef');

const editorValueRef = ref(props.value || '');

let markdownEditor: null | Vditor = null;

/**
 * 预览
 */
const htmlContentRef = ref('');
const computedIsHtml = computed(() => props.mode === 'html');

/**
 * 编辑器是否已创建
 */
const isEditorHasCreate = () => {
  return markdownEditor?.vditor !== undefined;
};

/**
 * 国际化语言
 */
const computedLang = computed<SmartMarkdownLang>(() => {
  if (props.lang) {
    return props.lang;
  }
  let lang: SmartMarkdownLang;
  switch (preferences.app.locale) {
    case 'en-US': {
      lang = 'en_US';
      break;
    }
    default: {
      lang = 'zh_CN';
      break;
    }
  }
  return lang;
});

/**
 * 编辑器主题
 */
const computedEditorTheme = computed(() => {
  let theme = props.theme as string | undefined;
  if (!theme) {
    theme = preferences.theme.mode;
  }
  return getTheme(theme);
});

watch(computedEditorTheme, (value) => {
  if (props.mode === 'preview') {
    renderPreview();
  } else {
    markdownEditor?.setTheme(value as never);
  }
});

/**
 * 编辑器模式
 */
const computedMode = computed(() => {
  if (props.mode === 'html' || props.mode === 'preview') {
    return undefined;
  }
  return props.mode ?? 'ir';
});

/**
 * 编辑器配置
 */
const computedVditorOptions = computed(() => {
  const options: Record<string, any> = {
    placeholder: t('ui.placeholder.input'),
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    cdn: '/vditor',
    ...props.options,
    width: props.width,
    height: props.height,
    lang: unref(computedLang),
    mode: unref(computedMode),
    input(value: string) {
      editorValueRef.value = value;
      emit('update:value', value);
      emit('change', value);
    },
    after() {
      nextTick(() => {
        markdownEditor?.setValue(props.value);
      });
    },
  };
  const theme = unref(computedEditorTheme);
  if (theme === 'dark') {
    options.theme = theme;
    options.preview = {
      ...options.preview,
      theme: {
        current: 'dark',
        ...options.preview?.theme,
      },
    };
  }
  return options;
});

/**
 * 初始化编辑器
 */
const initEditor = () => {
  if (markdownEditor) {
    return;
  }
  markdownEditor = new Vditor(unref(elRef)!, {
    ...unref(computedVditorOptions),
  });
};

const getPreviewOptions = () => {
  return {
    mode: unref(computedEditorTheme) as never,
    theme: {
      current: getTheme(unref(computedEditorTheme), 'content'),
    },
    hljs: {
      style: getTheme(unref(computedEditorTheme), 'code'),
    },
  };
};

const renderPreview = () => {
  Vditor.preview(unref(elRef)!, props.value, getPreviewOptions());
};

watch(
  () => props.value,
  async (value) => {
    const editorValue = unref(editorValueRef);
    if (value === editorValue) {
      return;
    }
    editorValueRef.value = value;
    if (unref(computedIsHtml)) {
      htmlContentRef.value = await Vditor.md2html(value, getPreviewOptions());
    } else if (props.mode === 'preview') {
      renderPreview();
    } else {
      if (isEditorHasCreate()) {
        markdownEditor?.setValue(value);
      }
    }
  },
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
  <div v-bind="attrs" v-if="computedIsHtml" v-html="htmlContentRef"></div>
  <div v-bind="attrs" v-else ref="elRef"></div>
</template>

<style></style>
