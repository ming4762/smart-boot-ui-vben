<script setup lang="ts">
import type {
  Editor,
  EditorEvent,
  RawEditorOptions,
  SmartTinymceEditorEvents,
  SmartTinymceEditorProps,
} from './types';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  useAttrs,
  watch,
} from 'vue';

import { i18n } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { buildShortUUID, isNumber, isString } from '@vben-core/shared/utils';

import tinymce from 'tinymce/tinymce';

import {
  DEFAULT_PLUGINS,
  DEFAULT_TINYMCE_CONFIG,
  DEFAULT_TOOLBAR,
  LANGUAGE_IMPORT_MAP,
  LANGUAGE_MAP,
  SHIN_IMPORT_MAP,
  TINYMCE_PLUGIN_PATH,
} from './constants';
import { bindHandlers } from './events';

import 'tinymce/icons/default';
import 'tinymce/themes/silver';
// import 'tinymce/plugins/link';
import 'tinymce/models/dom';

import './style.css';

const props = withDefaults(defineProps<SmartTinymceEditorProps>(), {
  id: buildShortUUID('tinymce'),
  language: LANGUAGE_MAP[unref(i18n.global.locale)],
  licenseKey: () => 'gpl',
  modelEvents: () => ['change', 'keyup', 'undo', 'redo'],
  outputFormat: () => 'html',
  width: () => '100%',
  height: () => 400,
  toolbar: () => DEFAULT_TOOLBAR,
  plugins: () => DEFAULT_PLUGINS,
});

const emit = defineEmits<SmartTinymceEditorEvents>();
const attrs = useAttrs();

/**
 * 编辑器实例
 */
const editorRef = ref<Editor | null>(null);

/**
 * 编辑器皮肤
 */
const getShin = computed(() => {
  if (props.skin) {
    return props.skin;
  }
  const { theme } = usePreferences();
  const themeValue = unref(theme);
  if (themeValue === 'dark') {
    return 'oxide-dark';
  }
  return 'oxide';
});

watch(getShin, () => {
  destroy();
  initEditor();
});

const getInitConfig = computed<RawEditorOptions>(() => {
  const { id, options, height, plugins, licenseKey, language, toolbar } = props;
  const editorOptions: RawEditorOptions = {
    selector: `#${id}`,
    ...DEFAULT_TINYMCE_CONFIG,
    ...options,
    height,
    plugins: plugins || [],
    license_key: licenseKey,
    toolbar,
    setup: (editor) => {
      editorRef.value = editor;
      editor.on('init', (e) => initSetup(e));
    },
  };
  // 加载国际化信息
  if (language) {
    editorOptions.language = language;
  }
  return editorOptions;
});
watch(getInitConfig, () => {
  destroy();
  initEditor();
});

/**
 * 加载资源
 * 1. 加载语言包
 * 2. 加载插件
 * 3. 加载主题
 */
const loadResource = async () => {
  const resources: Array<Promise<unknown> | undefined> = [
    import('tinymce/plugins/link' as any),
  ];
  // 加载插件
  const { plugins } = unref(getInitConfig);
  let pluginList: string[] = [];
  if (plugins && plugins.length > 0) {
    pluginList = isString(plugins) ? plugins.split(' ') : plugins;
    pluginList.forEach((plugin) => {
      const pluginImportFunction = TINYMCE_PLUGIN_PATH[plugin.trim()];
      if (pluginImportFunction) {
        const pluginImport = pluginImportFunction();
        resources.push(
          ...(Array.isArray(pluginImport) ? pluginImport : [pluginImport]),
        );
      } else {
        console.warn(
          `The plugin ${plugin} is not found, please check the plugin name`,
        );
      }
    });
  }
  // 加载语言包
  if (props.language) {
    const languageImport = LANGUAGE_IMPORT_MAP[props.language];
    if (languageImport) {
      resources.push(...languageImport(pluginList));
    } else {
      console.warn(
        `The language ${props.language} is not found, please check the language name`,
      );
    }
  }
  // 加载主题
  const shin = unref(getShin);
  const shimImports = SHIN_IMPORT_MAP[shin];
  if (shimImports) {
    resources.push(...shimImports());
  } else {
    console.warn(`The skin ${shin} is not found, please check the skin name`);
  }
  await Promise.all(resources.filter((item) => item !== undefined));
};

/**
 * 初始化编辑器
 */
const initEditor = async () => {
  await loadResource();
  tinymce
    .init(unref(getInitConfig))
    .then((editor) => {
      emit('afterInit', editor);
    })
    .catch((error) => {
      emit('initError', error);
    });
};

/**
 * 初始化后函数
 */
const initSetup = (e: EditorEvent<any>) => {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  const value = props.value;
  editor.setContent(value ?? '');
  bindModelHandlers(editor as Editor);
  bindHandlers(e, attrs, unref(editorRef));
};

/**
 * 绑定v-model事件
 * @param editor
 */
const bindModelHandlers = (editor: Editor) => {
  watch(
    () => props.value,
    (value, oldValue) => {
      setValue(oldValue, value);
    },
  );

  const modelEvents = props.modelEvents ?? [];
  const normalizedEvents = modelEvents.join(' ');
  editor.on(normalizedEvents, () => {
    const content = editor
      .getContent({ format: props.outputFormat })
      .toString();
    emit('update:value', content);
    emit('change', content);
  });
};

const setValue = (
  oldValue: string | undefined,
  newValue: string | undefined,
) => {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  if (newValue === undefined) {
    newValue = '';
  }
  if (
    oldValue !== newValue &&
    newValue !== editor.getContent({ format: props.outputFormat }).toString()
  ) {
    editor.setContent(newValue);
  }
};

/**
 * 销毁编辑器
 */
const destroy = () => {
  if (tinymce !== null) {
    tinymce.get(props.id)?.remove();
  }
};

onMounted(() => {
  initEditor();
});
onBeforeUnmount(() => {
  destroy();
});

/**
 * 容器样式
 */
const getContainerStyle = computed(() => {
  const width = props.width;
  if (isNumber(width)) {
    return {
      width: `${width}px`,
    };
  }
  return {
    width,
  };
});
</script>

<template>
  <div class="smart-tinymce-container" :style="getContainerStyle">
    <textarea class="hidden" :id="props.id"></textarea>
  </div>
</template>

<style scoped></style>
