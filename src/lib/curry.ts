export function curry(func: Function) {
  return function curried(this: any, ...args: any[]) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(this: any, ...args2: any[]) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}
