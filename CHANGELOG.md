# CHANGELOG

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
