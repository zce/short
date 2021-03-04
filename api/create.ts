import { VercelRequest, VercelResponse } from '@vercel/node'
import { createLink, fetchLinks, formatLink } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const params = req.body ?? req.query
  const { url, slug } = params as { url?: string, slug?: string }

  // `url` is required
  if (url == null || url === '') {
    return res.status(400).send({ error: 'Bad Request', message: 'Missing required parameter: url.' })
  }

  try {
    // existing links
    const links = await fetchLinks()

    // slug customized
    if (slug != null && slug !== '') {
      const exists = links.get(slug)

      if (exists === url) {
        return res.send({ slug, link: formatLink(slug) })
      }

      if (exists != null) {
        return res.status(400).send({ error: 'Bad Request', message: 'Short ID already exists.' })
      }
    }

    // target url exists
    const exists = links.get(url)

    // url & slug exists
    if (exists != null && (slug == null || slug === '' || slug === exists)) {
      return res.send({ slug: exists, link: formatLink(exists) })
    }

    if (!/^https?:\/\/.+/.test(url)) {
      return res.status(400).send({ error: 'Bad Request', message: 'Illegal URL format' })
    }

    // create if not exists
    const newSlug = await createLink(url, slug)
    res.send({ slug: newSlug, link: formatLink(newSlug) })
  } catch (e) {
    return res.status(400).send({ error: 'Bad Request', message: e.message })
  }
}
