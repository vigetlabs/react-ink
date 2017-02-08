# Contribution Guidelines

Thanks you for considering a contribution to React Ink!

React Ink is built using tools written for
[nodejs](http://nodejs.org). We recommend installing Node with
[nvm](https://github.com/creationix/nvm). this also means that
dependencies are managed with an [`npm`](https://npmjs.org) `package.json`
file.

You can install dependencies with:

```bash
npm install
```

## Running

A production build can be built by running:

```bash
npm run prepublish
```

However most of the time developing with React Ink, you will want
to reference the example app:

```bash
npm start
```

This will host the demo at `http://localhost:8080`.

## Testing

React Ink uses [Karma](https://karma-runner.github.io). You can run tests
with:

```bash
npm test
```

Be sure to check the `./coverage` folder to verify all code paths are
touched.

## Conventions

**Consider master unsafe**, use [`npm`](https://www.npmjs.com/package/react-ink) for the latest stable version.

### Javascript

React Ink uses ES6 Javascript (compiled using [Babel](babeljs.io)). As
for style, shoot for:

- No semicolons
- Commas last,
- 2 spaces for indentation (no tabs)
- Prefer ' over ", use string interpolation
- 80 character line length
