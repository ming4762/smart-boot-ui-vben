export const remove = <T>(array: T[], predicate: (item: T) => boolean) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i];
    if (item !== undefined && predicate(item)) {
      array.splice(i, 1);
    }
  }
};
