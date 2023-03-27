import store from './store.js'

interface Params {
  url?: string
  slug?: string
}

type Data = {
  slug: string
  link: string
} | {
  error: string
  message: string
}

export const config = {
  runtime: 'edge'
}

const response = (data: Data, status: number = 200) => {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export default async (req: Request) => {
  // check method
  if (req.method !== 'POST') {
    return response({ error: 'Method Not Allowed', message: 'Only POST method allowed.' }, 405)
  }

  let params: Params = {}

  try {
    params = await req.json() as Params
  } catch (e) {
    return response({ error: 'Bad Request', message: 'Illegal body: unexpected end of JSON input.' }, 400)
  }

  const { url, slug } = params

  // url is required
  if (url == null || url === '') {
    return response({ error: 'Bad Request', message: 'Missing required parameter: url.' }, 400)
  }

  // url format check
  if (!/^https?:\/\/.{3,}/.test(url)) {
    return response({ error: 'Bad Request', message: 'Illegal format: url.' }, 400)
  }

  // custom slug check if slug customized
  if (slug != null) {
    if (slug.length < 2 || slug.length > 10) {
      return response({ error: 'Bad Request', message: 'Illegal length: slug, (>= 2 && <= 10).' }, 400)
    }

    if (/[^a-zA-Z0-9_-]/.test(slug)) {
      return response({ error: 'Bad Request', message: 'Illegal format: slug, only allow [a-zA-Z0-9_-].' }, 400)
    }
  }

  // get origin from request url
  const { origin } = new URL(req.url)

  try {
    // if slug customized
    if (slug != null) {
      const existUrl = await store.getUrlBySlug(slug)

      // both slug & url match
      if (existUrl === url) {
        return response({ slug, link: origin + '/' + slug })
      }

      // slug already exists
      if (existUrl != null) {
        return response({ error: 'Bad Request', message: 'Slug already exists.' }, 400)
      }
    }

    // check target url exists
    const existSlug = await store.getSlugByUrl(url)

    // url exists & no custom slug
    if (existSlug != null && slug == null) {
      return response({ slug: existSlug, link: origin + '/' + existSlug })
    }

    // create if not exists or custom slug
    const newSlug = await store.addLink(url, slug)

    // response
    return response({ slug: newSlug, link: origin + '/' + newSlug })
  } catch (e) {
    console.error(e.name)
    return response({ error: 'Server Error', message: e.message }, 500)
  }
}
