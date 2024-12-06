<script setup lang="ts">
import type { EditorViewConfig } from '@codemirror/view';

import type { Theme } from './types';

import {
  nextTick,
  onMounted,
  onUnmounted,
  unref,
  useTemplateRef,
  watch,
} from 'vue';

import { type Extension, StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';

import {
  DarkTheme,
  getLanguagePackage,
  Language,
  LightTheme,
} from './constants';

interface Props {
  bordered?: boolean;
  config?: Omit<EditorViewConfig, 'parent'>;
  disabled?: boolean;
  language: Language;
  readonly?: boolean;
  theme?: Theme;
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  bordered: false,
  config: () => ({}),
  disabled: false,
  readonly: false,
  theme: 'light',
  value: '',
});

const emit = defineEmits<{ change: [string]; 'update:value': [string] }>();

const el = useTemplateRef<HTMLElement>('el');

let editor: EditorView | null = null;

const handleUpdateValue = (value: string) => {
  emit('update:value', value);
  emit('change', value);
};

/**
 * 创建更新监听器
 */
const createUpdateListener = (): Extension => {
  return EditorView.updateListener.of((viewUpdate) => {
    if (viewUpdate.docChanged) {
      handleUpdateValue(viewUpdate.state.doc.toString());
    }
  });
};

/**
 * 获取样式扩展
 */
const getThemeExtension = (): Extension => {
  const isDark = props.theme === 'dark';
  return EditorView.theme(isDark ? DarkTheme : LightTheme, { dark: isDark });
};

/**
 * 默认的扩展
 */
const getDefaultExtensions = (): Extension[] => {
  return [
    basicSetup,
    createUpdateListener(),
    EditorView.editable.of(!props.disabled),
  ];
};

/**
 * 获取内容
 */
const getContent = () => {
  if (!editor) {
    return '';
  }
  return editor.state.doc.toString();
};

/**
 * 更新内容
 */
const updateContent = (content: string = '') => {
  if (!editor) {
    return;
  }
  if (content === getContent()) {
    return;
  }
  editor.dispatch({
    changes: {
      from: 0,
      insert: content ?? '',
      to: editor.state.doc.length,
    },
  });
};

/**
 * 获取语言
 */
const getLanguage = async () => {
  const languagePackage = await getLanguagePackage(props.language)();
  return languagePackage[props.language]();
};

/**
 * 更新扩展
 */
const updateExtension = async () => {
  if (!editor) {
    return;
  }
  const language = await getLanguage();
  editor.dispatch({
    effects: StateEffect.appendConfig.of([
      ...getDefaultExtensions(),
      language,
      getThemeExtension(),
    ]),
  });
};

watch(
  () => props.disabled,
  () => {
    editor?.dispatch({
      effects: StateEffect.appendConfig.of([
        EditorView.editable.of(!props.disabled),
      ]),
    });
  },
);

/**
 * 内容变更后更新
 */
watch(
  () => props.value,
  async (value) => {
    await nextTick();
    updateContent(value);
  },
  { flush: 'post' },
);

watch([() => props.theme, () => props.language], () => {
  updateExtension();
});

/**
 * 初始化函数
 */
const init = async () => {
  const language = await getLanguage();
  editor = new EditorView({
    doc: props.value,
    extensions: [...getDefaultExtensions(), language, getThemeExtension()],
    parent: unref(el) ?? document.body,
    ...props.config,
  });
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  editor?.destroy();
});
</script>

<template>
  <div ref="el" class="relative !h-full w-full overflow-hidden"></div>
</template>

<style scoped></style>
