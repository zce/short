import got from 'got'

import BaseStorage from './base.js'

interface Comment {
  body: string
  author_association: 'OWNER' | 'MEMBER' | 'CONTRIBUTOR' | 'NONE'
}

const { GITHUB_TOKEN = '', GITHUB_OWNER = '', GITHUB_REPO = '', GITHUB_ISSUE_ID = 1 } = process.env

const endpoint = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_ID}/comments`
const whiteList = ['OWNER', 'MEMBER']
const splitter = '||'

const requestOptions = {
  timeout: { request: 5 * 1000 },
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
    accept: 'application/vnd.github.v3+json'
  }
}

export default class GitHub extends BaseStorage {
  private fetchComments (): AsyncIterableIterator<Comment> {
    // fetch all comments from github repo issue
    return got.paginate<Comment>(endpoint, {
      ...requestOptions,
      searchParams: { per_page: 100 }
    })
  }

  async addLink (url: string, slug?: string): Promise<string> {
    slug = slug == null || slug === '' ? await this.createSlug() : slug

    // create github repo issue comment
    await got.post<Comment>(endpoint, {
      ...requestOptions,
      json: { body: slug + splitter + url }
    })

    return slug
  }

  async getUrlBySlug (slug: string): Promise<string | undefined> {
    for await (const item of this.fetchComments()) {
      // ignore items not author added
      if (!whiteList.includes(item.author_association)) continue
      // parse each item to get the mapping
      const [key, value] = item.body.trim().split(splitter)
      // item format checking
      if (value != null && key === slug) return value
    }
  }

  async getSlugByUrl (url: string): Promise<string | undefined> {
    for await (const item of this.fetchComments()) {
      // ignore items not author added
      if (!whiteList.includes(item.author_association)) continue
      // parse each item to get the mapping
      const [key, value] = item.body.trim().split(splitter)
      // item format checking
      if (value === url) return key
    }
  }
}
