import got from 'got'
import { nanoid } from 'nanoid'

interface Comment {
  body: string
  author_association: 'OWNER' | 'MEMBER' | 'CONTRIBUTOR' | 'NONE'
}

const { API_BASE = '', GITHUB_TOKEN = '', GITHUB_OWNER = '', GITHUB_REPO = '', GITHUB_ISSUE_ID = 1 } = process.env

const splitter = '||'
const accept = 'application/vnd.github.v3+json'
const endpoint = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_ID}/comments`
const authorization = `token ${GITHUB_TOKEN}`
const whiteList = ['OWNER', 'MEMBER']
const reservedList = ['new', 'create', 'admin', 'feed', 'home', 'about', 'contact', 'blog']

const requestOptions = {
  headers: { authorization, accept },
  timeout: 5 * 1000 // 5s
}

const cache = new Map()

export const fetchLinks = async (): Promise<Map<string, string>> => {
  // from cache priority
  if (cache.size > 0) return cache

  // fetch all comments from github repo issue
  const comments = got.paginate<Comment>(endpoint, { ...requestOptions, searchParams: { per_page: 100 } })

  for await (const item of comments) {
    // ignore items not author added
    if (!whiteList.includes(item.author_association)) continue

    // parse each item to get the mapping
    const [slug, url] = item.body.trim().split(splitter)

    // item format checking
    if (url == null) continue

    // two-way map
    cache.set(slug, url)
    cache.set(url, slug)
  }

  return cache
}

export const createLink = async (url: string, slug?: string): Promise<string> => {
  if (slug == null || slug === '') slug = nanoid(6)

  // slug reserved
  if (reservedList.includes(slug) || slug.length === 1) {
    throw new Error(`Slug '${slug}' is reserved.`)
  }

  // create github repo issue comment
  await got.post<Comment>(endpoint, { ...requestOptions, json: { body: slug + splitter + url } })

  // two-way map
  cache.set(slug, url)
  cache.set(url, slug)

  return slug
}

export const formatLink = (slug: string): string => `${API_BASE}/${slug}`

export const clearCache = (): void => cache.clear()
