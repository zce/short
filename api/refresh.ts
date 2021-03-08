import { VercelRequest, VercelResponse } from '@vercel/node'
import { clearCache, fetchLinks } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  try {
    clearCache()

    await fetchLinks()

    res.redirect('/')
  } catch (e) {
    return res.status(400).send({ message: e.message })
  }
}
