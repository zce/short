import shortid from 'shortid'
import got from 'got'

interface Comment {
  body: string
  author_association: 'OWNER' | 'MEMBER' | 'CONTRIBUTOR' | 'NONE'
}

const { API_BASE, GITHUB_TOKEN, GITHUB_OWNER = '', GITHUB_REPO = '', GITHUB_ISSUE_ID = 1 } = process.env

const endpoint = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_ID}/comments`
const authorization = `token ${GITHUB_TOKEN}`
const splitter = '|'

const requestOptions = {
  headers: { authorization, accept: 'application/vnd.github.v3+json' },
  timeout: 5 * 1000
}

const whiteList = ['OWNER', 'MEMBER']

const storage = new Map()

export const fetchLinks = async (): Promise<Map<string, string>> => {
  if (storage.size > 0) return storage

  const iterator = got.paginate<Comment>(endpoint, {
    ...requestOptions,
    searchParams: { per_page: 100 }
  })

  for await (const item of iterator) {
    if (!whiteList.includes(item.author_association)) continue

    const [id, url] = item.body.trim().split(splitter)
    if (url == null) continue

    storage.set(id, url)
    storage.set(url, id)
  }

  return storage
}

export const getUrlByShort = async (id: string): Promise<string | undefined> => {
  const links = await fetchLinks()
  return links.get(id)
}

export const getShortByUrl = async (url: string): Promise<string | undefined> => {
  const links = await fetchLinks()
  return links.get(url)
}

export const createShort = async (url: string, id: string = shortid.generate()): Promise<string> => {
  await got.post(endpoint, {
    ...requestOptions,
    json: { body: id + splitter + url }
  })

  return id
}

export const formatLink = (id: string) => `${API_BASE}/${id}`
