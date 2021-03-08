import { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchLinks } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  if (typeof req.query.slug !== 'string' || req.query.slug === '') {
    return res.status(400).send('Bad Request')
  }

  try {
    const links = await fetchLinks()

    // get target url by slug
    const url = links.get(req.query.slug)

    // target url not found
    if (url == null) return res.status(404).send('Not Found')

    // 307 redirect if target exists
    res.redirect(url)
  } catch (e) {
    return res.status(400).send(e.message)
  }
}
