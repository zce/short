# short

> A short url service.

## Online Services

- https://t.zce.me

## Getting Started

```shell
$ git clone https://github.com/zce/short.git
$ cd short
$ cp .env.example .env
$ vi .env # add your upstash redis url & token
$ npm install
$ npm run develop
```

### Environment Variables

- `UPSTASH_REDIS_REST_URL`: Upstash redis rest url.
- `UPSTASH_REDIS_REST_TOKEN`: Upstash redis rest token.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fzce%2Fshort&env=GITHUB_OWNER,GITHUB_REPO,GITHUB_ISSUE_ID,GITHUB_TOKEN&demo-url=https%3A%2F%2Ft.zce.me)

## Endpoints

### POST `/create`

Create a new short url.

```shell
$ curl https://t.zce.me/create -d "url=https://zce.me" -d "slug=zce"
```

#### Parameters

- `url`: target url
- `slug`: short slug, optional, default: `auto nanoid`

#### Response Type

```json
{
  "slug": "<slug>",
  "link": "http://t.zce.me/<slug>"
}
```

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)
