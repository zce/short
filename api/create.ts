import { VercelRequest, VercelResponse } from '@vercel/node'
import { createLink } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const params = req.body ?? req.query
  const { url, link, id } = params

  if ((typeof url !== 'string' || url === '') && (typeof link !== 'string' || link === '')) {
    return res.status(400).send('Bad Request')
  }

  const result = await createLink(url || link, id)

  res.send(result)
}
