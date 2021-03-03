import { VercelRequest, VercelResponse } from '@vercel/node'
import { getUrlByShort, getShortByUrl, createShort, formatLink } from './utils'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const params = req.body ?? req.query
  const { url, id } = params

  if (typeof url !== 'string' || url === '') {
    return res.status(400).send({ message: 'Bad Request' })
  }

  const customId = typeof id === 'string' && id !== ''

  if (customId) {
    const exists = await getUrlByShort(id)
    if (exists === url) {
      return res.send({ id, link: formatLink(id) })
    } else if (exists != null) {
      return res.status(400).send({ message: 'Short ID already exists' })
    }
  }

  let shortId = await getShortByUrl(url)

  if (shortId != null && (!customId || shortId === id)) {
    return res.send({ id: shortId, link: formatLink(shortId) })
  }

  shortId = await createShort(url, id)

  res.send({ id: shortId, link: formatLink(shortId) })
}
