import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

export default abstract class BaseStorage {
  async createSlug (): Promise<string> {
    return nanoid()
  }

  abstract addLink (url: string, slug?: string): Promise<string>

  abstract addLog (slug: string, ua?: string, ip?: string): Promise<void>

  abstract getUrlBySlug (slug: string): Promise<string | undefined>

  abstract getSlugByUrl (url: string): Promise<string | undefined>
}
