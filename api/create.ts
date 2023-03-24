import type { VercelRequest, VercelResponse } from '@vercel/node'
import store from './store.js'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  // params from request body or querystring
  const params = req.body ?? req.query
  const { url = '', slug = '' } = params as { url?: string, slug?: string }

  // url is required
  if (url === '') {
    return res.status(400).send({ message: 'Missing required parameter: url.' })
  }

  // url format check
  if (!/^https?:\/\/.{3,}/.test(url)) {
    return res.status(400).send({ message: 'Illegal format: url.' })
  }

  // custom slug length check
  if (slug.length !== 0 && (slug.length < 2 || slug.length > 10)) {
    return res.status(400).send({ message: 'Illegal length: slug, (>= 2 && <= 10).' })
  }

  const getForwarded = (name: string): string => req.headers[`x-forwarded-${name}`]?.toString() ?? ''

  try {
    // request origin url
    const origin = `${getForwarded('proto')}://${getForwarded('host')}/`

    // if slug customized
    if (slug !== '') {
      const existUrl = await store.getUrlBySlug(slug)

      // url & slug are the same.
      if (existUrl === url) {
        return res.send({ slug, link: origin + slug })
      }

      // slug already exists
      if (existUrl != null) {
        return res.status(400).send({ message: 'Slug already exists.' })
      }
    }

    // target url exists
    const existSlug = await store.getSlugByUrl(url)

    // url exists & no custom slug
    if (existSlug != null && slug === '') {
      return res.send({ slug: existSlug, link: origin + existSlug })
    }

    // create if not exists
    const newSlug = await store.addLink(url, slug)

    // response
    res.send({ slug: newSlug, link: origin + newSlug })
  } catch (e) {
    const err = e as Error
    return res.status(500).send({ message: err.message })
  }
}
