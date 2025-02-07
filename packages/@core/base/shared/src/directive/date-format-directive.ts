import type { App, Directive, DirectiveBinding } from 'vue';

const handler = (
  el: HTMLElement,
  binding: DirectiveBinding<string | string[]>,
) => {
  el.innerText = binding.value as string;
};

const dateFormatDirective: Directive = {
  mounted: handler,
};

export const register = (app: App) => {
  app.directive('dateformat', dateFormatDirective);
};
