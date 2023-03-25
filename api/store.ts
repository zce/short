import { Redis } from '@upstash/redis'
import { customAlphabet } from 'nanoid'

const redis = Redis.fromEnv()
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

const getUrlBySlug = async (slug: string): Promise<string | undefined> => {
  const res = await redis.get<string>(slug)
  if (res != null) return res
}

const getSlugByUrl = async (url: string): Promise<string | undefined> => {
  const res = await redis.get<string>(url)
  if (res != null) return res
}

const createSlug = async (): Promise<string> =>{
  const slug = nanoid()
  const exists = await getUrlBySlug(slug)
  if (exists == null) return slug
  return await createSlug()
}

const addLink = async (url: string, slug?: string): Promise<string> => {
  slug = slug == null || slug === '' ? await createSlug() : slug

  // two-way binding
  await redis.set(slug, url)
  await redis.set(url, slug)

  return slug
}

const addLog = async (slug: string, ua?: string, ip?: string): Promise<void> =>{
  console.log({ slug, ua, ip, date: new Date() })
}

export default { getUrlBySlug, getSlugByUrl, addLink, addLog }
