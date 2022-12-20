export type DbAdapter<T> = {
  create: (data: Omit<T, 'id'>) => Promise<T>,
  update: (where: Partial<T>, data: Partial<T>) => Promise<T[]>,
  getOne: (where: Partial<T>) => Promise<T>,
  getMany: (filters: Partial<T>) => Promise<T[]>,
  removeOne: (where: Partial<T>) => Promise<T>,
  custom: () => any
}
