import type { App } from 'vue';

import { register as registerDateFormat } from './date-format-directive';

export const registerDirective = (app: App) => {
  registerDateFormat(app);
};
