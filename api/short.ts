import type { VercelRequest, VercelResponse } from '@vercel/node'
import store from './store.js'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const { slug } = req.query

  if (typeof slug !== 'string' || slug === '')
    return res.status(400).send('Bad Request')

  try {
    // get target url by slug
    const url = await store.getUrlBySlug(slug)

    // target url not found
    if (url == null) return res.status(404).send('Not Found')

    // add access log
    await store.addLog(slug, req.headers['user-agent'], req.headers['x-real-ip']?.toString())

    // 307 redirect if target exists
    res.redirect(url)
  } catch (e) {
    const err = e as Error
    return res.status(500).send(err.message)
  }
}
