import { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchLinks } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  if (typeof req.query.id !== 'string' || req.query.id === '') {
    return res.status(400).send('Bad Request')
  }

  const links = await fetchLinks()

  const url = links.get(req.query.id)

  if (url == null) return res.status(404).send('Not Found')

  res.redirect(url)
}
