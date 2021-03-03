import { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchLinks } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const { id } = req.query

  if (typeof id !== 'string' || id === '') {
    return res.status(400).send('Bad Request')
  }

  const links = await fetchLinks()

  const url = links.get(id)

  if (url == null) return res.status(404).send('Not Found')

  res.redirect(url)
}
