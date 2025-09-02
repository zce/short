import * as store from '../core/store'

export const config = { runtime: 'edge' }

const json = (data: { slug: string; link: string } | { error: string; message: string }, status: number = 200) => {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export default async (req: Request) => {
  // check method
  if (req.method !== 'POST') {
    return json({ error: 'Method Not Allowed', message: 'Only POST method allowed.' }, 405)
  }

  let params = {} as { url?: string; slug?: string }

  try {
    params = await req.json()
  } catch {
    return json({ error: 'Bad Request', message: 'Illegal body: unexpected end of JSON input.' }, 400)
  }

  const { url, slug } = params

  // url is required
  if (url == null || url === '') {
    return json({ error: 'Bad Request', message: 'Missing required parameter: url.' }, 400)
  }

  // url format check
  if (!/^https?:\/\/.{3,}/.test(url)) {
    return json({ error: 'Bad Request', message: 'Illegal format: url.' }, 400)
  }

  // custom slug check if slug customized
  if (slug != null) {
    if (slug.length < 2 || slug.length > 10) {
      return json({ error: 'Bad Request', message: 'Illegal length: slug, (>= 2 && <= 10).' }, 400)
    }

    if (/[^a-zA-Z0-9_-]/.test(slug)) {
      return json({ error: 'Bad Request', message: 'Illegal format: slug, only allow [a-zA-Z0-9_-].' }, 400)
    }
  }

  // get origin from request url
  const { origin } = new URL(req.url)

  try {
    // if slug customized
    if (slug != null) {
      const existingUrl = await store.getUrl(slug)

      // both slug & url match
      if (existingUrl === url) {
        return json({ slug, link: origin + '/' + slug })
      }

      // slug already exists
      if (existingUrl != null) {
        return json({ error: 'Bad Request', message: 'Slug already exists.' }, 400)
      }
    }
    else {
      // check target url exists
      const existingSlug = await store.getSlug(url)

      // url exists & no custom slug
      if (existingSlug != null) {
        return json({ slug: existingSlug, link: origin + '/' + existingSlug })
      }
    }

    // create if not exists or custom slug
    const newSlug = await store.createMapping(url, slug)

    // response
    return json({ slug: newSlug, link: origin + '/' + newSlug })
  } catch (e) {
    if (e instanceof store.MappingConflictError) {
      return json({ error: 'Bad Request', message: 'Slug already exists.' }, 400)
    }
    if (e instanceof Error) {
      console.error(e.message)
      return json({ error: 'Server Error', message: e.message }, 500)
    }
    console.error('Unknown error', e)
    return json({ error: 'Server Error', message: 'Unknown error.' }, 500)
  }
}
