import { VercelRequest, VercelResponse } from '@vercel/node'
import { clearCache, fetchLinks } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  clearCache()
  await fetchLinks()
  res.send({ message: 'OK' })
}
