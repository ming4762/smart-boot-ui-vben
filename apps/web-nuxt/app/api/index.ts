const $api = $fetch.create({
  baseURL: '/api',
  async onRequest({ options }) {
    const token = useCookie('Authorization').value;
    options.headers = options.headers || {};
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }
  },
  onResponse({ response }) {
    const data = response._data;
    if (data && data.code !== 200) {
      throw new Error(data);
    }
    response._data = data.data;
  },
  onResponseError() {
    // todo
  },
});

export { $api };
