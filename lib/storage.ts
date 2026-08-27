export const readIds = (key: string) => { if (typeof window === 'undefined') return [] as string[]; try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] as string[] } }
export const writeIds = (key: string, ids: string[]) => { try { localStorage.setItem(key, JSON.stringify(ids)) } catch {} }
