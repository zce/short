// import path from 'path'
// import fs from 'fs/promises'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { clearCache, fetchLinks } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  try {
    clearCache()

    await fetchLinks()

    // const links = await fetchLinks()
    // if (process.env.NODE_ENV === 'development') {
    //   const rules = ['location / { return 307 https://zce.me; }']
    //   for (const [key, value] of links.entries()) {
    //     if (/^https?:\/\/.+/.test(key)) continue
    //     rules.push(`location /${key} { return 307 ${value}; }`)
    //   }
    //   await fs.writeFile(path.join(__dirname, '../nginx/rules.conf'), rules.join('\n'))
    // }

    res.redirect('/')
  } catch (e) {
    return res.status(400).send({ message: e.message })
  }
}
