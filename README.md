# short

> A short url service.

## Online Services

- https://toas.cc

## Getting Started

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fzce%2Fshort&env=GITHUB_OWNER,GITHUB_REPO,GITHUB_ISSUE_ID,GITHUB_TOKEN&demo-url=https%3A%2F%2Ftoas.cc)

### Environment Variables

- `GITHUB_OWNER`: GitHub Repo owner.
- `GITHUB_REPO`: GitHub Repo name.
- `GITHUB_ISSUE_ID`: GitHub Repo issue id for storage.
- `GITHUB_TOKEN`: GitHub access_token with `repo` scope.

> Tips. Using a closed & locked issue will be more reliable.

## Endpoints

### GET `/create`

Create a new short url.

```shell
$ curl https://toas.cc/create
```

#### Parameters

- `url`: target url
- `slug`: short id, default: `auto nanoid`

#### Response Type

```json
{
  "slug": "<slug>",
  "link": "http://toas.cc/<slug>"
}
```

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)
