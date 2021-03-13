import got from 'got'

import BaseStorage from './base'

interface Comment {
  body: string
  author_association: 'OWNER' | 'MEMBER' | 'CONTRIBUTOR' | 'NONE'
}

const { GITHUB_TOKEN = '', GITHUB_OWNER = '', GITHUB_REPO = '', GITHUB_ISSUE_ID = 1 } = process.env

const endpoint = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_ID}/comments`
const whiteList = ['OWNER', 'MEMBER']
const splitter = '||'

const requestOptions = {
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
    accept: 'application/vnd.github.v3+json'
  },
  timeout: 5 * 1000 // 5s
}

export default class GitHub extends BaseStorage {
  private async fetchCache (): Promise<void> {
    // from cache priority
    if (this.cache.size > 0) return

    // fetch all comments from github repo issue
    const comments = got.paginate<Comment>(endpoint, {
      ...requestOptions,
      searchParams: { per_page: 100 }
    })

    for await (const item of comments) {
      // ignore items not author added
      if (!whiteList.includes(item.author_association)) continue

      // parse each item to get the mapping
      const [slug, url] = item.body.trim().split(splitter)

      // item format checking
      if (url == null) continue

      // two-way map
      this.cache.set(slug, url)
      this.cache.set(url, slug)
    }
  }

  async addLink (url: string, slug?: string): Promise<string> {
    slug = slug == null || slug === '' ? await this.createSlug() : slug

    // create github repo issue comment
    await got.post<Comment>(endpoint, {
      ...requestOptions,
      json: { body: slug + splitter + url }
    })

    // two-way map
    this.cache.set(slug, url)
    this.cache.set(url, slug)

    return slug
  }

  async addLog (slug: string, ua?: string, ip?: string): Promise<void> {
    console.log({ slug, ua, ip, timestamp: Date.now() })
  }

  async getUrlBySlug (slug: string): Promise<string | undefined> {
    await this.fetchCache()
    return this.cache.get(slug)
  }

  async getSlugByUrl (url: string): Promise<string | undefined> {
    await this.fetchCache()
    return this.cache.get(url)
  }
}
