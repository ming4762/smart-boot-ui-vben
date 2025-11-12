export interface ModulePathMapping {
  filePath: string;
  moduleName: string;
}

export const MODULE_PATH_MAPPING: Map<string, ModulePathMapping> = new Map<
  string,
  ModulePathMapping
>([
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
