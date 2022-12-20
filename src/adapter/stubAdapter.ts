import { DbAdapter } from "./type";

export function stubAdapter<T>(schema: any): DbAdapter<T> {
  return {
    create: async () => ({} as T),
    update: async () => ([{}] as T[]),
    getOne: async () => ({} as T),
    getMany: async () => ([{}] as T[]),
    removeOne: async () => ({} as T),
    custom: async () => ({} as T),
  }
}
