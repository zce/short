import { Redis } from '@upstash/redis'
import { customAlphabet } from 'nanoid'

const redis = Redis.fromEnv()
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

// url2slug
const getUrlBySlug = async (slug: string): Promise<string | null> => {
  return await redis.get<string>('u2s_' + slug)
}

// slug2url
const getSlugByUrl = async (url: string): Promise<string | null> => {
  return await redis.get<string>('s2u_' + url)
}

// generate slug (recursive if exists)
const generateSlug = async (): Promise<string> => {
  const slug = nanoid()
  const exists = await redis.exists(slug)
  return exists === 0 ? slug : await generateSlug()
}

const addLink = async (url: string, slug?: string): Promise<string> => {
  slug = slug == null || slug === '' ? await generateSlug() : slug

  // two-way binding
  await redis.set('s2u_' + slug, url) // slug2url
  await redis.set('u2s_' + url, slug) // url2slug

  return slug
}

const addLog = async (slug: string, ua?: string, ip?: string): Promise<void> => {
  console.log({ slug, ua, ip, date: new Date() })
  await redis.lpush('v_' + slug, JSON.stringify({ ua, ip, date: new Date() }))
}

export default { getUrlBySlug, getSlugByUrl, addLink, addLog }
