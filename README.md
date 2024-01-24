# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### TO-DO

- Wrap "/list" path in a auth path that will only call the loaders of "/list" if the user is authenticated. So, new path should be "_auth/list" and _auth.tsx file.

### Question

- Why did I have to put the list item in a separate function for fetcher to work correctly, is it because there was another form element within the same function component? See: "We can't have variable number of hooks." This is somehow related to this condition.