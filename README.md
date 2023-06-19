# changelog

changelog auto-generation tool

## Install:

```sh
npm i npm-changelog -D
```

## How does it work?

The package generates pre-push git hook, that one'll generate new changelog with appropriate version on each git push command

## Features: 
- generates changelog based on npm versions from commit names
- filters for useless commit names
- custom commit names filters is possible
- supports titled and listed views and converts from other to each other
- fully automatic turnkey changelog generation
- you can change changelog (except last feature) and the changes will keeping

## Usage: 

First of all you need initialize pre-push hook:
```sh
npx Sanshain/changelog --config
```

Next step: add custom script to package.json: 

```json
{
  "scripts": {
    "changelog": "changelog --titled"
  }
}
```

And finally just work with git as usual:

```sh
git add . 
git commit -m "some commit"
git push origin main
```

And watch how your `CHANGELOG.md` is changing

## Options

- `--filter=` - allows you to add custom filters (will useing as regexps) that will not skip matching commit names in changelog. By default, all short names (less then six symbols) are ignored, as well as names consisting of only one word, and also containing words in the name 
`gitignore`, `readme`, `merge` and `npmignore`
- `--titled` - selects to use the changelog view with headers
- `--convert` - allows convert among `titled` and `lined` views

