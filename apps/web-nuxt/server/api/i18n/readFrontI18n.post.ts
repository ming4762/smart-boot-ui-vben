export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const data = await $fetch(`${config.serverUrl}/public/i18n/readFrontI18n`, {
    method: 'POST',
    body,
  });
  return data;
});
