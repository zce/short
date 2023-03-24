// // install @cloudbase/node-sdk
// import { init } from '@cloudbase/node-sdk'

// import BaseStorage from './base.js'

// const { TCB_ENV_ID, TCB_SECRET_ID, TCB_SECRET_KEY } = process.env

// const app = init({ env: TCB_ENV_ID, secretId: TCB_SECRET_ID, secretKey: TCB_SECRET_KEY })

// const db = app.database()

// export default class Redis extends BaseStorage {
//   async addLog (slug: string, ua?: string, ip?: string): Promise<void> {
//     const collection = db.collection('logs')
//     await collection.add({ slug, ua, ip, date: new Date() })
//   }

//   async addLink (url: string, slug?: string): Promise<string> {
//     slug = slug == null || slug === '' ? await this.createSlug() : slug
//     const collection = db.collection('links')
//     await collection.add({ slug, url })
//     return slug
//   }

//   async getUrlBySlug (slug: string): Promise<string | undefined> {
//     const collection = db.collection('links')
//     const { data } = await collection.where({ slug }).get()
//     if (data[0] == null) return
//     return data[0].url
//   }

//   async getSlugByUrl (url: string): Promise<string | undefined> {
//     const collection = db.collection('links')
//     const { data } = await collection.where({ url }).get()
//     if (data[0] == null) return
//     return data[0].slug
//   }
// }
