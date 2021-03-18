import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

export default abstract class BaseStorage {
  async createSlug (): Promise<string> {
    const slug = nanoid()
    const exists = await this.getUrlBySlug(slug)
    if (exists == null) return slug
    return await this.createSlug()
  }

  async addLog (slug: string, ua?: string, ip?: string): Promise<void> {
    console.log({ slug, ua, ip, date: new Date() })
  }

  abstract addLink (url: string, slug?: string): Promise<string>

  abstract getUrlBySlug (slug: string): Promise<string | undefined>

  abstract getSlugByUrl (url: string): Promise<string | undefined>
}
