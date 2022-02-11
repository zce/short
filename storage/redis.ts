import { createClient } from 'redis'

import BaseStorage from './base'

const client = createClient({ url: process.env.REDIS_URL })

export default class Redis extends BaseStorage {
  async addLink (url: string, slug?: string): Promise<string> {
    slug = slug == null || slug === '' ? await this.createSlug() : slug

    // two-way binding
    await client.set(slug, url)
    await client.set(url, slug)

    return slug
  }

  async getUrlBySlug (slug: string): Promise<string | undefined> {
    const res = await client.get(slug)
    if (res != null) return res
  }

  async getSlugByUrl (url: string): Promise<string | undefined> {
    const res = await client.get(url)
    if (res != null) return res
  }
}
