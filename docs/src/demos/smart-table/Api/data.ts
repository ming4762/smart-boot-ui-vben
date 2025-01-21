import { reactive } from 'vue';

const data: any[] = reactive([
  {
    description: '参数',
    field: 'Props',
    children: [
      {
        description: '列配置(只说明与vx-table不同项)',
        field: 'columns',
        children: [
          {
            description: '自动样式配置，会自动生成列样式',
            field: 'autoClass',
            type: 'string',
            options: 'Boolean',
          },
          {
            description: '组件，简化一些常用组件插槽',
            field: 'component',
            type: 'string',
            options: 'booleanTag|button|switch|tag|useYnTag',
          },
          {
            description: '组件Props',
            field: 'componentProps',
            type: 'Record<string, any>|(params) => Record<string, any>',
          },
          {
            description: '动态class',
            field: 'dynamicClass',
            type: 'string|(params: {$columnIndex, $rowIndex, $table, _columnIndex, _rowIndex, column, columnIndex, row, rowIndex}) => null | string | { [key: string]: boolean }',
          },
          {
            description: '动态style',
            field: 'dynamicStyle',
            type: 'any|(params: {$columnIndex, $rowIndex, $table, _columnIndex, _rowIndex, column, columnIndex, row, rowIndex}) => null | string | { [key: string]: boolean }',
          },
          {
            description: '编辑配置',
            field: 'editRender',
            children: [
              {
                description: 'autofocus',
                field: 'autofocus',
                type: 'boolean',
              },
              {
                description: '可编辑表格组件',
                field: 'name',
              },
              {
                description: '编辑组件Props',
                field: 'props',
                type: 'any|(row) => any',
              },
              {
                description: '是否必填',
                field: 'required',
                type: 'boolean',
              },
              {
                description: '校验规则',
                field: 'rules',
                type: 'VxeTableDefines.ValidatorRule[]',
              },
              {
                description: '是否阻止回车键事件冒泡',
                field: 'stopEnterBubbling',
                type: 'boolean',
                default: 'true',
              },
            ],
          },
        ],
      },
      {
        description: '添加修改表单配置',
        field: 'addEditConfig',
        children: [
          {
            description:
              '编辑加载完数据执行，返回false或Promise<false>停止后续执行',
            field: 'afterLoadData',
            type: 'data => boolean|Promise<boolean|undefined>|undefined',
          },
          {
            description: '保存之后操作，默认query',
            field: 'afterSave',
            type: 'saveResult => boolean|Promise<boolean>',
          },
          {
            description: '保存之前对数据进行处理',
            field: 'beforeSave',
            type: 'data => data|Promise<data>',
          },
          {
            description: '添加修改表单配置，参考vben-form文档',
            field: 'formConfig',
            children: [
              {
                description: '表单尺寸',
                field: 'size',
              },
              {
                description: '表单插槽',
                field: 'slots',
                type: 'string[]|Record<string, (data: any) => VNode | VNode[]>',
              },
            ],
          },
          {
            description: '添加修改modal配置，参考vben-modal文档',
            field: 'modalConfig',
            children: [
              {
                description: 'slots',
                field: 'slots',
                type: 'append-footer,prepend-footer：string|(data: SmartTableModalSlotProps) => VNode | VNode[]',
              },
            ],
          },
          {
            description: '自定义弹窗事件',
            field: 'openModalHandler',
            type: '(row: any, formData?: Record<string, any>) => void',
          },
          {
            description: '添加修改前的校验',
            field: 'saveUpdateValidate',
            type: '(isAdd, selectData, formData) => boolean|Promise<boolean>',
          },
        ],
      },
      {
        description: '权限配置',
        field: 'authConfig',
        children: [
          {
            description: '判断权限函数',
            field: 'authHandler',
            type: '(auth?: SmartAuthType) => boolean',
          },
          {
            description: '默认的显示模式',
            field: 'displayMode',
            type: 'string',
            options: 'disabled | hide',
            default: 'disabled',
          },
        ],
      },
      {
        description: 'checkbox配置，true使用默认配置',
        field: 'checkboxConfig',
        type: 'boolean|SmartCheckboxConfig',
        children: [
          {
            description: '是否支持ctrl选中，rowTrigger必须为single',
            field: 'rowCtrl',
            type: 'boolean',
            default: 'true',
          },
          {
            description: '是否禁用',
            field: 'rowShift',
            type: 'boolean',
            default: 'true',
          },
          {
            description: '是否支持行触发选中',
            field: 'rowTrigger',
            type: 'string',
            options: 'single | multiple',
            default: 'single',
          },
        ],
      },
      {
        description: '分页配置，true使用默认配置',
        field: 'pagerConfig',
        type: 'boolean|VxeGridPropTypes.PagerConfig',
      },
      {
        description: '数据代理配置项（基于 Promise API）',
        field: 'proxyConfig',
        children: [
          {
            description: '删除数据后执行',
            field: 'afterDelete',
            type: '(result?: any) => void',
          },
          {
            description: '启用停用后执行',
            field: 'afterUserYn',
            type: '(result?: any) => void',
          },
          {
            description: 'ajax配置（与vxe-table不同部分）',
            field: 'ajax',
            children: [
              {
                description: '启用停用',
                field: 'useYn',
                type: '(rows, useYn, params) => Promise',
              },
            ],
          },
        ],
      },
      {
        description: '查询表单配置',
        field: 'searchFormConfig',
        children: [
          {
            description: '搜索表单默认显示状态',
            field: 'defaultVisible',
            type: 'boolean',
            default: 'true',
          },
          {
            description: `向后台发送的参数是否带有符号，true组件会自动拼接参数 参数名@符号`,
            field: 'searchWithSymbol',
          },
          {
            description: '搜索表单配置（参考vben-form，只展示不同部分）',
            field: 'schema',
            type: 'SmartSearchFormSchema[]',
            children: [
              {
                description: '向后台发送的符号，优先级低',
                field: 'searchSymbol',
              },
              {
                description: '自定义符号，优先级高',
                field: 'customSymbol',
                type: '({model, schema, value}) => Record<string, any>',
              },
            ],
          },
          {
            description: '搜索表单尺寸，默认跟随表格尺寸',
            field: 'size',
            type: 'string',
          },
          {
            description: '搜索表单显示状态',
            field: 'visible',
            type: 'boolean',
            default: 'true',
          },
        ],
      },
      {
        description: '序号列配置，只列出不同部分',
        field: 'seqConfig',
        children: [
          {
            description:
              '序号是否绑定分页，默认每页都是从1开始，true则会根据当前页进行计算',
            field: 'seqBindPage',
            type: 'boolean',
            default: 'false',
          },
        ],
      },
      {
        description: '表格工具栏配置，只列出不同部分',
        field: 'toolbarConfig',
        children: [
          {
            description: '按钮配置，表格左侧按钮',
            field: 'buttons',
            type: 'SmartTableButton[]',
          },
          {
            description: '隐藏显示搜索栏按钮',
            field: 'showSearch',
            type: 'boolean|SmartTableToolbarTool',
          },
          {
            description: '表格尺寸调整按钮',
            field: 'sizeSetting',
            type: 'boolean|SmartTableToolbarSizeSetting',
          },
          {
            description: '右侧工具栏配置',
            field: 'tools',
            type: 'SmartTableToolbarTool[]',
          },
        ],
      },
      {
        description: '是否显示查询表单',
        field: 'useSearchForm',
        type: 'boolean',
        default: 'true',
      },
    ],
  },
  {
    description: '事件',
    field: 'Events',
  },
  {
    description: '方法',
    field: 'Methods',
    children: [
      {
        description: '删除checkbox选中的数据',
        field: 'deleteByCheckbox',
        type: 'Promise<boolean>',
      },
      {
        description: '删除指定行数据',
        field: 'deleteByRow',
        type: 'Promise<boolean>',
        default: 'row: any | any[]',
      },
      {
        description: '编辑checkbox选中的数据',
        field: 'editByCheckbox',
        type: 'boolean | Promise<boolean>',
      },
      {
        description: '编辑指定行数据',
        field: 'editByRowModal',
        type: 'boolean | Promise<boolean>',
        default: 'row: any, formData?: Record<string, any>',
      },
      {
        description: '获取添加修改表单',
        field: 'getAddEditForm',
        type: 'ExtendedFormApi | null',
      },
      {
        description: '获取表格实例',
        field: 'getGrid',
        type: 'VxeGridInstance',
      },
      {
        description: '获取查询表单',
        field: 'getSearchForm',
        type: 'ExtendedFormApi',
      },
      {
        description: '重新加载数据',
        field: 'query',
        type: 'Promise<void>',
        default: 'params?: SmartTableFetchParams',
      },
      {
        description: '设置表格loading',
        field: 'setLoading',
        type: 'setLoading(loading: boolean)',
      },
      {
        description: '设置分页配置',
        field: 'setPagerConfig',
        type: 'setPagerConfig(pagerConfig: Partial<VxeGridPropTypes.PagerConfig>)',
      },
      {
        description: '启用禁用checkbox选中的数据',
        field: 'setUseYnByCheckbox',
        type: 'Promise<boolean>',
        default: 'useYn: boolean, params?: Record<string, any>',
      },
      {
        description: '启用禁用指定行数据',
        field: 'setUseYnByRow',
        type: 'Promise<boolean>',
        default:
          'row: any | any[], useYn: boolean, params?: Record<string, any>',
      },
      {
        description: '打开添加modal',
        field: 'showAddModal',
        type: 'void',
        default:
          'selectData?: Record<string, any>, formData?: Record<string, any>',
      },
    ],
  },
]);

export { data };
