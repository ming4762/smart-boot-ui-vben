import { $t as t } from '#/locales';

/**
 * 获取启用停用下拉列
 */
export const getUseYnSelectOptions = () => {
  return [
    {
      label: t('common.form.use'),
      value: 1,
    },
    {
      label: t('common.form.noUse'),
      value: 0,
    },
  ];
};
