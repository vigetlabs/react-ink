# CHANGELOG

## 6.3.0

- Replace legacy string refs
- Allow className to be overriden

## 6.2.0

- Remove PropTypes and createClass usage to prevent deprecation
  warnings with React 15.5.x

## 6.1.1

- Fix case where ink would hang when switching windows. [Thanks @hhaidar](https://github.com/vigetlabs/react-ink/pull/30)

## v6.1.0

- Add TypeScript definitions

## v6.0.1

- Removed some dependencies that should not have been included in production

## v6.0.0

- Remove React as a peer dependency
- Remove onTouchLeave event, which is no longer supported
- Upgrade Babel to Babel 6

## v5.1.1

- Use inline source-map to avoid warnings with including external map.

## v5.1.0

- Moved babel compilation configuration from package.json into webpack
  config to avoid cross-project babel compilation issues

## v5.0.2

- Lower minimum peerDependency to 0.12. Turns it that we can support
  it.

## v5.0.1

- Fix case in React 0.13.3 where DOM node could not be found

## v5.0.0

- Updates to internals to support React 0.14.0
- Breaking peer dependency update to React 0.13.0
