# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Changelog Categories

- `BREAKING` for breaking changes.
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

---
## [3.0.1] - 2026-03-15
### Fixed
- CJS `require('proxifly')` now works directly without `.default`

### Changed
- Added CommonJS import example to README
- Bumped wonderful-fetch to 2.0.4, prepare-package to 2.0.7
- Expanded test suite from 3 to 13 tests

---
## [3.0.0] - 2026-03-15
### BREAKING
- Replaced UMD module format with ESM/CJS/IIFE via prepare-package v2
- Simplified `getProxy()` and `getPublicIp()` method signatures (removed format/config nesting)
- Switched API host to `api.proxifly.dev` with GET requests and Bearer token auth
- Removed deprecated `verifyProxy` and `isProxyOrVPN` methods

### Changed
- Replaced manual `https`/`XMLHttpRequest` with `wonderful-fetch`
- Added configurable `url` option to constructor
- Updated all dependencies to latest versions
- Bumped minimum Node version to 16
- Modernized README with updated API examples
- Expanded test suite from 3 to 13 tests (constructor, static, error handling, multiple instances)
- CJS `require('proxifly')` now works directly without `.default` (prepare-package footer)

### Removed
- Removed `.npmignore` and `CNAME` in favor of `files` field in `package.json`

---
## [1.0.0] - 2024-06-19
### Added
- Initial release of the project 🚀
