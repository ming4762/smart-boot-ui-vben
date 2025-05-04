import type { RawEditorOptions } from 'tinymce';

/**
 * TinyMCE插件路径
 */
export const TINYMCE_PLUGIN_PATH: Record<
  string,
  () => Array<Promise<unknown>> | Promise<unknown>
> = {
  accordion: () => import('tinymce/plugins/accordion' as any),
  advlist: () => import('tinymce/plugins/advlist' as any),
  anchor: () => import('tinymce/plugins/anchor' as any),
  autolink: () => import('tinymce/plugins/autolink' as any),
  autoresize: () => import('tinymce/plugins/autoresize' as any),
  autosave: () => import('tinymce/plugins/autosave' as any),
  charmap: () => import('tinymce/plugins/charmap' as any),
  code: () => import('tinymce/plugins/code' as any),
  codesample: () => import('tinymce/plugins/codesample' as any),
  directionality: () => import('tinymce/plugins/directionality' as any),
  emoticons: () => [
    import('tinymce/plugins/emoticons' as any),
    import('tinymce/plugins/emoticons/js/emojis.js' as any),
  ],
  fullscreen: () => import('tinymce/plugins/fullscreen' as any),
  help: () => import('tinymce/plugins/help' as any),
  image: () => import('tinymce/plugins/image' as any),
  importcss: () => import('tinymce/plugins/importcss' as any),
  insertdatetime: () => import('tinymce/plugins/insertdatetime' as any),
  link: () => import('tinymce/plugins/link' as any),
  lists: () => import('tinymce/plugins/lists' as any),
  media: () => import('tinymce/plugins/media' as any),
  nonbreaking: () => import('tinymce/plugins/nonbreaking' as any),
  pagebreak: () => import('tinymce/plugins/pagebreak' as any),
  preview: () => import('tinymce/plugins/preview' as any),
  quickbars: () => import('tinymce/plugins/quickbars' as any),
  save: () => import('tinymce/plugins/save' as any),
  searchreplace: () => import('tinymce/plugins/searchreplace' as any),
  table: () => import('tinymce/plugins/table' as any),
  visualblocks: () => import('tinymce/plugins/visualblocks' as any),
  visualchars: () => import('tinymce/plugins/visualchars' as any),
  wordcount: () => import('tinymce/plugins/wordcount' as any),
};

/**
 * TinyMCE语言包
 */
export const LANGUAGE_IMPORT_MAP: Record<
  string,
  (plugins?: string[]) => Promise<unknown>[]
> = {
  zh_CN: (pluginList) => {
    const importList = [import('tinymce-i18n/langs7/zh_CN.js' as any)];
    if (pluginList?.includes('help')) {
      importList.push(
        import('tinymce/plugins/help/js/i18n/keynav/zh_CN.js' as any),
      );
    }
    return importList;
  },
};

export const DEFAULT_TOOLBAR = [
  'fontsizeselect lineheight searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
  'hr bullist numlist link  preview anchor pagebreak insertdatetime media  forecolor backcolor fullscreen',
];

export const DEFAULT_PLUGINS = [
  'accordion',
  'advlist',
  'anchor',
  'autolink',
  // 'autoresize',
  'autosave',
  'charmap',
  'code',
  'codesample',
  'directionality',
  'emoticons',
  'fullscreen',
  // 'help',
  'image',
  'importcss',
  'insertdatetime',
  'link',
  'lists',
  'media',
  'nonbreaking',
  'pagebreak',
  'preview',
  'quickbars',
  'save',
  'searchreplace',
  'table',
  'visualblocks',
  'visualchars',
  'wordcount',
];

/**
 * 默认的TinyMCE配置
 */
export const DEFAULT_TINYMCE_CONFIG: Partial<RawEditorOptions> = {
  // 移除右下角品牌标识
  branding: false,
  // 移除升级推广按钮
  promotion: false,
  skin: false,
  content_css: false,
};

export const LANGUAGE_MAP: Record<string, string> = {
  'zh-CN': 'zh_CN',
};

/**
 * TinyMCE皮肤
 */
export const SHIN_IMPORT_MAP: Record<string, () => Array<Promise<unknown>>> = {
  oxide: () => [
    import('tinymce/skins/ui/oxide/skin.min.css'),
    // import('tinymce/skins/content/default/content.css'),
  ],
  'oxide-dark': () => [
    import('tinymce/skins/ui/oxide-dark/skin.min.css'),
    // import('tinymce/skins/content/dark/content.css'),
  ],
};
