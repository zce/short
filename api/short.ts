import store from './store'

export const config = { runtime: 'edge' }

export default async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const slug = searchParams.get('slug')

  if (slug == null || slug === '') {
    return new Response('Bad Request', { status: 400 })
  }

  try {
    // get target url by slug
    const url = await store.getUrlBySlug(slug)

    // target url not found
    if (url == null) {
      return new Response('Not Found', { status: 404 })
    }

    // add access log
    await store.addLog(slug, req.headers.get('user-agent'), req.headers.get('x-real-ip'))

    // 307 redirect if target exists
    return Response.redirect(url, 307)
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}
