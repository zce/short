import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

const epoch = new Date('2025-01-01').getTime()
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const genSlug = () => {
  const toBase62 = (n: number) => {
    if (n === 0) return '0'
    let s = ''
    while (n > 0) { s = alphabet[n % 62] + s; n = Math.floor(n / 62) }
    return s
  }
  const random = Math.floor(Math.random() * 3844)
  return toBase62(Date.now() - epoch) + alphabet[Math.floor(random / 62)] + alphabet[random % 62]
}

const urlKey = (url: string) => 'u_' + encodeURIComponent(url)
const slugKey = (slug: string) => 's_' + encodeURIComponent(slug)
const logKey = (slug: string) => 'l_' + encodeURIComponent(slug)

export const createMapping = async (url: string, slug?: string) => {
  if (slug == null || slug.length === 0) {
    // reuse if url already mapped
    const existing = await getSlug(url)
    if (existing) return existing

    do {
      // generate until we can atomically reserve the slug key
      const candidate = genSlug()
      const ok = await redis.set(slugKey(candidate), url, { nx: true })
      if (ok === 'OK') slug = candidate
    } while (slug == null || slug.length === 0)
  } else {
    // user provided slug: ensure not taken
    const ok = await redis.set(slugKey(slug), url, { nx: true })
    if (ok !== 'OK') throw new MappingConflictError()
  }

  // two-way binding
  // keep the first-created slug as the primary url->slug; do not overwrite
  await redis.set(urlKey(url), slug, { nx: true }) // url2slug

  return slug
}

export const getUrl = async (slug: string) => {
  // slug2url
  return await redis.get<string>(slugKey(slug))
}

export const getSlug = async (url: string) => {
  // url2slug
  return await redis.get<string>(urlKey(url))
}

export const logAccess = async (slug: string, ua: string | null, ip: string | null) => {
  // console.log({ slug, ua, ip, date: new Date() })
  await redis.lpush(logKey(slug), JSON.stringify({ ua, ip, date: new Date() }))
}

export class MappingConflictError extends Error {}
