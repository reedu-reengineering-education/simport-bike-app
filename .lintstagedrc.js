const path = require('path')

const buildBiomeFixCommand = filenames =>
  `biome check --apply --no-errors-on-unmatched ${filenames
    .map(f => path.relative(process.cwd(), f))
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildBiomeFixCommand],
}
