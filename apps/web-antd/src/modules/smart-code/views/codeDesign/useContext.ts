import { inject, provide, type Ref, ref, unref } from 'vue';

const KEY = Symbol('smart-code-design-context');
const HANDLER_KEY = Symbol('smart-code-design-handler');

interface EditConfigData {
  codePageConfigList: any[];
  codeFormConfigList: any[];
  codeSearchConfigList: any[];
}

interface CodeDesignContextData {
  tableData: any[];
  editConfigData?: EditConfigData;
  dbData: any;
  isSyncDb: boolean;
}

interface CodeDesignContext {
  contextData: Ref<CodeDesignContextData>;
  setContext: (data: Partial<CodeDesignContextData>) => void;
}

interface CodeDesignHandler {
  handleSyncTableData?: () => Promise<void>;
  loadConfigData?: () => Promise<void>;
  // 保存数据handler
  saveDataHandler: Array<() => any | Promise<any>>;
}

interface CodeDesignHandlerContext {
  registerHandler: (handler: Partial<CodeDesignHandler>) => void;
  getHandlerContext: () => CodeDesignHandler;
  registerSaveDataHandler: (handler: () => any | Promise<any>) => void;
}

const useProvideCodeDesignContext = () => {
  const injectData = ref<CodeDesignContextData>({
    tableData: [],
    dbData: {},
    isSyncDb: false,
  });

  const setInjectData = (context: Partial<CodeDesignContextData>) => {
    injectData.value = {
      ...unref(injectData),
      ...context,
    };
  };
  const handlerContext: CodeDesignHandler = {
    saveDataHandler: [],
  };
  const registerHandler = (handler: Partial<CodeDesignHandler>) => {
    Object.assign(handlerContext, handler);
  };
  const registerSaveDataHandler = (handler: () => any | Promise<any>) => {
    handlerContext.saveDataHandler.push(handler);
  };
  const getHandlerContext = () => {
    return handlerContext;
  };

  const provideCodeDesignContext = () => {
    provide<CodeDesignContext>(KEY, {
      contextData: injectData,
      setContext: setInjectData,
    });
    provide(HANDLER_KEY, {
      getHandlerContext,
      registerHandler,
      registerSaveDataHandler,
    });
  };

  return {
    setInjectData,
    provideCodeDesignContext,
    getHandlerContext,
    contextData: injectData,
  };
};

const injectCodeDesignContext = (): CodeDesignContext => {
  return inject<CodeDesignContext>(KEY) as CodeDesignContext;
};

const injectCodeDesignHandler = (): CodeDesignHandlerContext => {
  return inject<CodeDesignHandlerContext>(
    HANDLER_KEY,
  ) as CodeDesignHandlerContext;
};

export {
  injectCodeDesignContext,
  injectCodeDesignHandler,
  useProvideCodeDesignContext,
};
export type { CodeDesignContextData, CodeDesignHandler, EditConfigData };
