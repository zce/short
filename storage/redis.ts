import { promisify } from 'util'
import { createClient } from 'redis'

import BaseStorage from './base'

const client = createClient({ url: process.env.REDIS_URL })

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

export default class Redis extends BaseStorage {
  async addLink (url: string, slug?: string): Promise<string> {
    slug = slug == null || slug === '' ? await this.createSlug() : slug

    // two-way binding
    await set(slug, url)
    await set(url, slug)

    return slug
  }

  async getUrlBySlug (slug: string): Promise<string | undefined> {
    const res = await get(slug)
    if (res != null) return res
  }

  async getSlugByUrl (url: string): Promise<string | undefined> {
    const res = await get(url)
    if (res != null) return res
  }
}
