export type MaybeReadonly<T> = T | Readonly<T>;

export type MaybePromiseReturnType<T = void> = T | Promise<T>;
