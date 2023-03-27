import type { VercelRequest, VercelResponse } from '@vercel/node'
import store from './store.js'

interface Params {
  url?: string
  slug?: string
}

/**
 * { url: 'https://example.com', slug: 'example' }
 * { url: 'https://example.com', slug: '' }
 * { url: 'https://example.com' }
 * { url: '' }
 * {}
 */
export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  // params from request body or querystring
  const { url, slug } = Object.assign({}, req.body, req.query) as Params

  // url is required
  if (url == null || url === '')
    return res.status(400).send({ message: 'Missing required parameter: url.' })

  // url format check
  if (!/^https?:\/\/.{3,}/.test(url))
    return res.status(400).send({ message: 'Illegal format: url.' })

  // custom slug length check if slug customized
  if (slug != null && (slug.length < 2 || slug.length > 10))
    return res.status(400).send({ message: 'Illegal length: slug, (>= 2 && <= 10).' })

  console.log(req.headers)

  // request origin url
  const getForwarded = (name: string): string => req.headers[`x-forwarded-${name}`]?.toString() ?? ''
  const origin = `${getForwarded('proto')}://${getForwarded('host')}/`

  try {
    // if slug customized
    if (slug != null) {
      const existUrl = await store.getUrlBySlug(slug)

      // both slug & url match
      if (existUrl === url)
        return res.send({ slug, link: origin + slug })

      // slug already exists
      if (existUrl != null)
        return res.status(400).send({ message: 'Slug already exists.' })
    }

    // check target url exists
    const existSlug = await store.getSlugByUrl(url)

    // url exists & no custom slug
    if (existSlug != null && slug == null)
      return res.send({ slug: existSlug, link: origin + existSlug })

    // create if not exists or custom slug
    const newSlug = await store.addLink(url, slug)

    // response
    res.send({ slug: newSlug, link: origin + newSlug })
  } catch (e) {
    const err = e as Error
    return res.status(500).send({ message: err.message })
  }
}
