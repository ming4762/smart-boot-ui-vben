import { inject, provide, type Ref, ref, unref } from 'vue';

const KEY = Symbol('smart-code-design');

interface CodeDesignContextData {
  tableData: any[];
}

interface CodeDesignContext {
  contextData: Ref<CodeDesignContextData>;
  setContext: (data: Partial<CodeDesignContextData>) => void;
}

const useProvideCodeDesignContext = () => {
  const injectData = ref<CodeDesignContextData>({
    tableData: [],
  });

  const setInjectData = (context: Partial<CodeDesignContextData>) => {
    injectData.value = {
      ...unref(injectData),
      ...context,
    };
  };

  const provideCodeDesignContext = () => {
    provide<CodeDesignContext>(KEY, {
      contextData: injectData,
      setContext: setInjectData,
    });
  };

  return {
    setInjectData,
    provideCodeDesignContext,
  };
};

const injectCodeDesignContext = (): CodeDesignContext => {
  return inject<CodeDesignContext>(KEY) as CodeDesignContext;
};

export { injectCodeDesignContext, useProvideCodeDesignContext };
