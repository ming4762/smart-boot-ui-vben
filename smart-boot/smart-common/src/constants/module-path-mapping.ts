export interface ModulePathMapping {
  filePath: string;
  moduleName: string;
}

export const MODULE_PATH_MAPPING: Map<string, ModulePathMapping> = new Map<
  string,
  ModulePathMapping
>([
  [
    '/modules/smart-code',
    {
      filePath: '/smart-boot/smart-modules/smart-module-code/src',
      moduleName: '@smart-module/code',
    },
  ],
  [
    '/modules/smart-file',
    {
      filePath: '/smart-boot/smart-modules/smart-module-file/src',
      moduleName: '@smart-module/file',
    },
  ],
  [
    '/modules/smart-message',
    {
      filePath: '/smart-boot/smart-modules/smart-module-message/src',
      moduleName: '@smart-module/message',
    },
  ],
  [
    '/modules/smart-system',
    {
      filePath: '/smart-boot/smart-modules/smart-module-system/src',
      moduleName: '@smart-module/system',
    },
  ],
]);
