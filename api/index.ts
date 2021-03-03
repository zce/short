import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (req: VercelRequest, res: VercelResponse): Promise<any> => {
  const { name, host = 'zce.me' } = req.query // from querystring or pathinfo
  // const { name, host = 'zce.me' } = req.body // from request body

  if (typeof name !== 'string' || name === '') {
    // return if without redirect url.
    return res.status(400).send({ message: 'Bad Request' })
  }

  res.send({ name, email: `${name}@${host}` })
}
