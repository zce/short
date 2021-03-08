# short

> A short url service.

## Endpoints

### GET `/new`

Create a new short url.

```shell
$ curl https://t.zce.me/new
```

#### Parameters

- `url`: target url
- `id`: short id, default: `auto`

#### Response Type

```json
{
  "id": "<shortid>",
  "link": "http://t.zce.me/<shortid>"
}
```

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)
