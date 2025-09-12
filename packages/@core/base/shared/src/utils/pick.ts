import { isFunction } from './inference';

const pick = (obj: any, keys: ((key: string) => boolean) | string[]) => {
  const ret: any = {};
  if (isFunction(keys)) {
    Object.keys(obj).forEach((key) => {
      if (keys(key)) {
        ret[key] = obj[key];
      }
    });
  } else {
    keys.forEach((key) => {
      if (key in obj) {
        ret[key] = obj[key];
      }
    });
  }
  return ret;
};

export { pick };
