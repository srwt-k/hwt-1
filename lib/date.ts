export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const subtractMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() - minutes * 60 * 1000);