import { createVNode, onMounted, reactive, ref, unref } from 'vue';
import type { Ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { ApiServiceEnum, requestClient } from '#/api/request';

const defaultSearchModel = {
  groupCode: '',
  groupName: '',
  useYn: 1,
};

/**
 * 加载数据
 */
export const vueLoadData = () => {
  const sortData = reactive({
    sortName: 'seq',
    sortOrder: 'asc',
  });
  // 数据
  const data = ref([]);
  // 数据加载状态
  const loading = ref(false);
  // 搜索表单
  const searchModel = ref<any>(Object.assign({}, defaultSearchModel));
  // 分页信息
  const tablePage = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 500,
  });
  /**
   * 加载数据函数
   */
  const loadData = async () => {
    // 构建参数
    const allParameter: any = {
      ...sortData,
      limit: tablePage.pageSize,
      page: tablePage.currentPage,
    };
    // 自定义参数
    const customParameter: any = {
      QUERY_CREATE_UPDATE_USER: true,
    };
    Object.keys(searchModel.value).forEach((key) => {
      const value = searchModel.value[key];
      if (value !== null && value !== '') {
        if (typeof value === 'string') {
          if (value.trim() !== '') {
            customParameter[`${key}@like`] = value;
          }
        } else {
          customParameter[`${key}@=`] = value;
        }
      }
    });
    allParameter.parameter = customParameter;
    loading.value = true;
    try {
      const { rows, total } = await requestClient.post(
        'sys/userGroup/list',
        allParameter,
        {
          service: ApiServiceEnum.SMART_SYSTEM,
        },
      );
      tablePage.total = total;
      data.value = rows;
    } finally {
      loading.value = false;
    }
  };
  /**
   * 排序变化时触发
   */
  const handleSortChange = ({ property, order }: any) => {
    sortData.sortOrder = order;
    sortData.sortName = property;
    loadData();
  };
  /**
   * 分页触发事件
   */
  const handlePageChange = ({ currentPage, pageSize }: any) => {
    tablePage.currentPage = currentPage;
    tablePage.pageSize = pageSize;
    loadData();
  };
  /**
   * 重置搜索表单
   */
  const resetSearch = () => {
    searchModel.value = Object.assign({}, defaultSearchModel);
  };
  onMounted(loadData);
  return {
    data,
    loading,
    searchModel,
    tablePage,
    handlePageChange,
    resetSearch,
    loadData,
    handleSortChange,
  };
};

const defaultAddEditModel = {
  useYn: true,
  seq: 1,
};

/**
 * 添加修改编码验证规则
 */
const addEditFormRules = (t: (code: string) => string) => {
  return {
    groupCode: [
      {
        required: true,
        trigger: 'blur',
        message: t('system.views.userGroup.validate.groupCode'),
      },
    ],
    groupName: [
      {
        required: true,
        trigger: 'blur',
        message: t('system.views.userGroup.validate.groupName'),
      },
    ],
  };
};

export const vueAddUpdate = (loadData: any) => {
  // 保存加载状态
  const saveLoading = ref(false);
  // 查询加载状态
  const getLoading = ref(false);
  // 弹窗状态
  const addEditModalVisible = ref(false);
  // 是否是添加
  const isAdd = ref(false);
  // 添加修改表单
  const addEditModel = ref<any>(Object.assign({}, defaultAddEditModel));
  /**
   * 添加操作
   */
  const handleShowAdd = () => {
    addEditModel.value = Object.assign({}, defaultAddEditModel);
    isAdd.value = true;
    addEditModalVisible.value = true;
  };
  /**
   * 编辑操作
   * @param id
   */
  const handleShowEdit = async (id: number) => {
    isAdd.value = false;
    addEditModalVisible.value = true;
    getLoading.value = true;
    try {
      addEditModel.value = await requestClient.post('sys/userGroup/list', id, {
        service: ApiServiceEnum.SMART_SYSTEM,
      });
    } finally {
      getLoading.value = false;
    }
  };
  /**
   * 保存操作
   */
  const handleSave = async () => {
    saveLoading.value = true;
    try {
      await requestClient.post(
        'sys/userGroup/saveUpdate',
        unref(addEditModel),
        { service: ApiServiceEnum.SMART_SYSTEM },
      );
      addEditModalVisible.value = false;
      loadData();
    } finally {
      saveLoading.value = false;
    }
  };
  return {
    saveLoading,
    getLoading,
    addEditModalVisible,
    isAdd,
    addEditModel,
    handleShowAdd,
    handleShowEdit,
    handleSave,
    formRules: reactive(addEditFormRules(t)),
  };
};

/**
 * 删除操作
 */
export const vueDelete = (gridRef: Ref, loadData: any) => {
  /**
   * 删除操作
   */
  const handleDelete = () => {
    // 获取选中行
    const selectRows = gridRef.value.getCheckboxRecords();
    if (selectRows.length === 0) {
      message.error('请选择要删除的数据');
      return false;
    }
    Modal.confirm({
      title: '确认',
      icon: createVNode(
        createIconifyIcon('ant-design:exclamation-circle-outlined'),
      ),
      content: '确定要删除吗？',
      onOk: async () => {
        await requestClient.post(
          'sys/userGroup/batchDeleteById',
          selectRows.map((item: any) => item.groupId),
          { service: ApiServiceEnum.SMART_SYSTEM },
        );
        loadData();
      },
    });
  };
  return {
    handleDelete,
  };
};

/**
 * 设置用户
 */
export const vueSetUser = () => {
  const loadUserLoading = ref(false);
  const setUserLoading = ref(false);
  const setUserModalVisible = ref(false);
  // 所有用户数据
  const allUserData = ref<Array<any>>([]);
  // 选中的key
  const targetKeys = ref<Array<string>>([]);
  let selectRow: any = null;
  /**
   * 设置用户操作
   */
  const handleShowSetUser = async (row: any) => {
    selectRow = row;
    setUserModalVisible.value = true;
    loadUserLoading.value = true;
    try {
      loadUserLoading.value = true;
      // 加载所有用户数据
      if (allUserData.value.length === 0) {
        const result = await requestClient.post<any[]>(
          'sys/user/list',
          {
            sortName: 'seq',
            parameter: {
              'useYn@=': true,
            },
          },
          { service: ApiServiceEnum.SMART_SYSTEM },
        );

        allUserData.value = result.map(
          ({ userId, fullName, username }: any) => {
            return {
              key: `${userId}`,
              title: `${fullName}[${username}]`,
            };
          },
        );
      }
      // 加载用户关联数据
      const result = await requestClient.post<number[]>(
        'sys/userGroup/listUserIdById',
        selectRow.groupId,
        { service: ApiServiceEnum.SMART_SYSTEM },
      );

      targetKeys.value = result.map((item) => `${item}`);
    } finally {
      loadUserLoading.value = false;
    }
  };
  const handleTransChange = (targetKeyList: Array<string>) => {
    targetKeys.value = targetKeyList;
  };
  /**
   * 设置用户操作
   */
  const handleSetUser = async () => {
    try {
      setUserLoading.value = true;
      await requestClient.post(
        'sys/userGroup/saveUserGroupByGroupId',
        {
          groupId: selectRow.groupId,
          userIdList: targetKeys.value,
        },
        { service: ApiServiceEnum.SMART_SYSTEM },
      );

      setUserModalVisible.value = false;
    } finally {
      setUserLoading.value = false;
    }
  };
  return {
    loadUserLoading,
    setUserLoading,
    handleShowSetUser,
    setUserModalVisible,
    handleSetUser,
    allUserData,
    targetKeys,
    handleTransChange,
  };
};
