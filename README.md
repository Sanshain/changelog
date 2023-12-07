# changelog

[![npm](https://img.shields.io/npm/v/npm-changelog)](https://www.npmjs.com/package/npm-changelog)
[![npm](https://img.shields.io/npm/dm/npm-changelog)](https://www.npmjs.com/package/npm-changelog)

Changelog auto-generation tool

## Install:

```sh
npm i npm-changelog -D
```

## How does it work?

The package generates pre-push git hook, that one'll generate new changelog with appropriate version on each git push command

## Features: 
- full programmatically changelog generation ordered by npm versions and based on filtered commit names
- gives the opportunity of custom [commits names] filters tuning to changelog auto generation
- supports titled and listed views and convertation from other to each other
- gives the opportunity of log changing after generation (except last note!) and keeps the changes after subsequent auto-regeneration

## Usage: 

**First of all:** you need initialize pre-push hook:
```sh
npx npm-changelog --config
```

**Next step**: add custom script to package.json: 

```json
{
  "scripts": {
    "changelog": "changelog --titled"
  }
}
```

**And finally:** just work with git as usual:

```sh
git add . 
git commit -m "some commit"
git push origin main
```

And watch how your `CHANGELOG.md` is changing

## Options

- `--config [--pre-commit]` - config initialization on current project (by default used `pre-push` hook)
- `--filter=[version]` - allows you to add custom filters (will useing as regexps) that will not skip matching commit names in changelog. By default, all short names (less then six symbols) are ignored, as well as names consisting of only one word, and also containing words in the name 
`gitignore`, `readme`, `merge` and `npmignore`. Usage example (following command should be specified with **"chanhelog"** command with-in scripts sections inside package.json file):

  ```
  changelog --filter=version --filter=--skip
  ```
  
- `--titled` - selects to use the changelog view with headers
- `--convert [--titled]` - allows convert among `titled` and `lined` views

## Views

### --titled

```markdown
# changelog

## 1.0.6

 - feature: added d

## 1.0.5

 - feature: added c

## 1.0.4

 - feature: added b
 - feature: a is 2
```

### --lined (by default)

```markdown
# changelog

**1.0.6** - feature: added d

**1.0.5** - feature: added c

**1.0.4** - feature: added b. feature: a is 2
```

## Using via API

Using via API availible also:

```ts
import { default as changelog } from 'npm-changelog';
changelog({})
```
