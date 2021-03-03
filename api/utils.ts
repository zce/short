import shortid from 'shortid'
import got from 'got'

interface Comment {
  body: string
  author_association: 'OWNER' | 'MEMBER' | 'CONTRIBUTOR' | 'NONE'
}

const { API_BASE, GITHUB_TOKEN, GITHUB_OWNER = '', GITHUB_REPO = '', GITHUB_ISSUE_ID = 1 } = process.env

const endpoint = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_ID}/comments`
const authorization = `token ${GITHUB_TOKEN}`

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

    const [id, url] = item.body.trim().split(':')
    if (url == null) continue

    storage.set(id, url)
  }

  return storage
}

export const createLink = async (url: string, id: string = shortid.generate()): Promise<string> => {
  await got.post(endpoint, {
    ...requestOptions,
    json: { body: `${id}:${url}` }
  })

  return `${API_BASE}/${id}`
}
