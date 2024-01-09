# short

> A short url service.

## Online Services

- https://zvu.cc
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

## REST API Test

### Bad request

```http
POST http://localhost:3000/create HTTP/1.1

# {
#   "error": "Bad Request",
#   "message": "Illegal body: unexpected end of JSON input."
# }
```

### No parameters

```http
POST http://localhost:3000/create HTTP/1.1
content-type: application/json

{}

# {
#   "error": "Bad Request",
#   "message": "Missing required parameter: url."
# }
```

### Request with url parameter

```http
POST http://localhost:3000/create HTTP/1.1
content-type: application/json

{
  "url": "https://www.google.com"
}

# {
#   "slug": "bPVp",
#   "link": "http://localhost:3000/bPVp"
# }
```

### Request with url & slug parameters

```http
POST http://localhost:3000/create HTTP/1.1
content-type: application/json

{
  "url": "https://www.google.com",
  "slug": "google"
}

# {
#   "slug": "google",
#   "link": "http://localhost:3000/google"
# }
```

### Request with url & exist slug parameters

```http
POST http://localhost:3000/create HTTP/1.1
content-type: application/json

{
  "url": "https://www.google1.com",
  "slug": "google"
}
```

# {
#   "error": "Bad Request",
#   "message": "Slug already exists."
# }
```

### Redirect to url

```http
GET http://localhost:3000/google HTTP/1.1
```

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)
