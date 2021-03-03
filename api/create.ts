import { VercelRequest, VercelResponse } from '@vercel/node'
import { createLink } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const params = req.body ?? req.query
  const { url, id } = params

  if (typeof url !== 'string' || url === '') {
    return res.status(400).send('Bad Request')
  }

  const link = await createLink(url, id)

  res.send(link)
}
