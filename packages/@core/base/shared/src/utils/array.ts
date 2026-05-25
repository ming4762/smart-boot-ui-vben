import { remove as doRemove } from 'vue';

export const remove = <T>(array: T[], predicate: (item: T) => boolean) => {
  array.forEach((item) => {
    if (predicate(item)) {
      doRemove(array, item);
    }
  });
};
