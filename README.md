# Platform for lots of applications
A fast mechanism for taking code and ideas and shipping them

# Multi SPA React


with cloudflare deploys to https://feneky.pages.dev/

steps to add a new SPA

```
apps/mynewthing/
├── package.json
├── vite.config.js
├── index.html
└── src/
    └── index.jsx
```

## Build details

/package.json already runs /scripts "build-all-apps.js" and "collect-builds.js"

bootstrapped with vite
[https://vitejs.dev/guide/build.html](https://vitejs.dev/guide/build.html)

## Development

`cd apps/mynewthing`

`npm install`

`npm run dev`

http://localhost:5173

# References

To learn Vitest, a Vite-native testing framework, go to [Vitest documentation](https://vitest.dev/guide/)

To learn React, check out the [React documentation](https://reactjs.org/).


## Old

We've already run this for you in the `Codespaces: server` terminal window below. If you need to stop the server for any reason you can just run `npm start` again to bring it back online.

Runs the app in the development mode.

Open [http://localhost:3000/](http://localhost:3000/) in the built-in Simple Browser (`Cmd/Ctrl + Shift + P > Simple Browser: Show`) to view your running application.

The page will reload automatically when you make changes. You may also see any lint errors in the console.

`npm test` Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests)


`npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance; the build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

