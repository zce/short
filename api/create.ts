import { IncomingHttpHeaders } from 'http'
import { VercelRequest, VercelResponse } from '@vercel/node'
import storage from './storage'

const getForwarded = (headers: IncomingHttpHeaders, name: string): string => headers[`x-forwarded-${name}`]?.toString() ?? ''

const formatLink = ({ headers }: VercelRequest, slug: string): string => `${getForwarded(headers, 'proto')}://${getForwarded(headers, 'host')}/${slug}`

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

  try {
    // if slug customized
    if (slug !== '') {
      const existUrl = await storage.getUrlBySlug(slug)
      // url & slug are the same.
      if (existUrl === url) {
        return res.send({ slug, link: formatLink(req, slug) })
      }
      // slug already exists
      if (existUrl != null) {
        return res.status(400).send({ message: 'Slug already exists.' })
      }
    }

    // target url exists
    const existSlug = await storage.getSlugByUrl(url)

    // url exists & no custom slug
    if (existSlug != null && slug === '') {
      return res.send({ slug: existSlug, link: formatLink(req, existSlug) })
    }

    // create if not exists
    const newSlug = await storage.addLink(url, slug)

    // response
    res.send({ slug: newSlug, link: formatLink(req, newSlug) })
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }
}
