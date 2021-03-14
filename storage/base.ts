import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

export default abstract class BaseStorage {
  async createSlug (): Promise<string> {
    return nanoid()
  }

  async addLog (slug: string, ua?: string, ip?: string): Promise<void> {
    console.log({ slug, ua, ip, timestamp: Date.now() })
  }

  abstract addLink (url: string, slug?: string): Promise<string>

  abstract getUrlBySlug (slug: string): Promise<string | undefined>

  abstract getSlugByUrl (url: string): Promise<string | undefined>
}
