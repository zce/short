import * as store from '../core/store'

export const config = { runtime: 'edge' }

export default async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const slug = searchParams.get('slug')

  if (slug == null || slug === '') {
    return new Response('Bad Request', { status: 400 })
  }

  try {
    // get target url by slug
    const url = await store.getUrl(slug)

    // target url not found
    if (url == null) {
      return new Response('Not Found', { status: 404 })
    }

    // add access log
    await store.logAccess(slug, req.headers.get('user-agent'), req.headers.get('x-real-ip'))

    // 307 redirect if target exists
    return Response.redirect(url, 307)
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 500 })
    }
    console.error('Unknown error', e)
    return new Response('Internal Server Error', { status: 500 })
  }
}
