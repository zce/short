import { IncomingHttpHeaders } from 'http'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { nanoid, createLink, fetchLinks } from './utils'

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
  if (slug.length !== 0 &&( slug.length < 2 || slug.length > 10)) {
    return res.status(400).send({ message: 'Illegal length: slug, (>= 2 && <= 10).' })
  }

  try {
    // fetch all existing links
    const links = await fetchLinks()

    // if slug customized
    if (slug !== '') {
      const exists = links.get(slug)

      // url & slug are the same.
      if (exists === url) {
        return res.send({ slug, link: formatLink(req, slug) })
      }

      // slug already exists
      if (exists != null) {
        return res.status(400).send({ message: 'Slug already exists.' })
      }
    }

    // target url exists
    const exists = links.get(url)

    // url exists & no custom slug
    if (exists != null && slug === '') {
      return res.send({ slug: exists, link: formatLink(req, exists) })
    }

    // create if not exists
    const result = await createLink(url, slug === '' ? nanoid() : slug)
    res.send({ slug: result, link: formatLink(req, result) })
  } catch (e) {
    return res.status(400).send({ message: e.message })
  }
}
