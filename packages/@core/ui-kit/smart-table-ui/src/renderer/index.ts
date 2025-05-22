const renderers = import.meta.glob('./modules/*.ts', {
  eager: true,
});

export const initSmartTableRender = () => {
  for (const path in renderers) {
    const handler = (renderers[path] as any)?.default;

    handler && handler();
  }
};
