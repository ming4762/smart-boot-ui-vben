enum Api {
  readFrontI18n = '/api/i18n/readFrontI18n',
}

/**
 * 读取国际化信息
 */
export const readFrontI18nApi = async (locale: string) => {
  const result: any = await $fetch(Api.readFrontI18n, {
    method: 'POST',
    body: { locale },
  });
  return result.data;
};
