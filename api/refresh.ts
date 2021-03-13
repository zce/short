import { VercelRequest, VercelResponse } from '@vercel/node'
import storage from './storage'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  await storage.clearCache()
  await storage.getUrlBySlug('zce') // recache
  res.redirect('/')
}
