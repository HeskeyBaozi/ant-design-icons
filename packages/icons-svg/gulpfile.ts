import { series, parallel } from 'gulp';
import { clean, copy, generateIcons, generateEntry } from './tasks/creators';
import { generalConfig, remainFillConfig } from './plugins/svgo/presets';
import {
  assignAttrsAtTag,
  adjustViewBox,
  setDefaultColorAtPathTag
} from './plugins/svg2Definition/transforms';
import { twotoneStringify } from './plugins/svg2Definition/stringify';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getIdentifier } from './build/helpers';
import { ThemeTypeUpperCase } from './build/templates/types';
import { MapToInterpolate } from './plugins/useTemplate';

const iconTemplate = readFileSync(
  resolve(__dirname, './build/templates/icon.ts.ejs'),
  'utf8'
);

export default series(
  clean(['src', 'inline-svg', 'es', 'lib']),
  parallel(
    copy({
      from: ['build/templates/*.ts'],
      toDir: 'src'
    }),
    generateIcons({
      theme: 'filled',
      from: ['svg/filled/*.svg'],
      toDir: 'src/asn',
      svgoConfig: generalConfig,
      extraNodeTransformFactories: [
        assignAttrsAtTag('svg', { focusable: 'false' }),
        adjustViewBox
      ],
      stringify: JSON.stringify,
      template: iconTemplate,
      mapToInterpolate: getMapToInterpolateByTheme('Filled'),
      filename: ({ name }) => getIdentifier({ name, themeSuffix: 'Filled' })
    }),
    generateIcons({
      theme: 'outlined',
      from: ['svg/outlined/*.svg'],
      toDir: 'src/asn',
      svgoConfig: generalConfig,
      extraNodeTransformFactories: [
        assignAttrsAtTag('svg', { focusable: 'false' }),
        adjustViewBox
      ],
      stringify: JSON.stringify,
      template: iconTemplate,
      mapToInterpolate: getMapToInterpolateByTheme('Outlined'),
      filename: ({ name }) => getIdentifier({ name, themeSuffix: 'Outlined' })
    }),
    generateIcons({
      theme: 'twotone',
      from: ['svg/twotone/*.svg'],
      toDir: 'src/asn',
      svgoConfig: remainFillConfig,
      extraNodeTransformFactories: [
        assignAttrsAtTag('svg', { focusable: 'false' }),
        adjustViewBox,
        setDefaultColorAtPathTag('#333')
      ],
      stringify: twotoneStringify,
      template: iconTemplate,
      mapToInterpolate: getMapToInterpolateByTheme('TwoTone'),
      filename: ({ name }) => getIdentifier({ name, themeSuffix: 'TwoTone' })
    })
  ),
  generateEntry({
    entryName: 'index.ts',
    from: ['src/asn/*.ts'],
    toDir: 'src',
    banner: `// This index.ts file is generated automatically.\n`,
    template: `export { default as <%= identifier %> } from '<%= path %>';`,
    mapToInterpolate: ({ name: identifier }) => ({
      identifier,
      path: `./asn/${identifier}`
    })
  })
);

function getMapToInterpolateByTheme(
  theme: ThemeTypeUpperCase
): MapToInterpolate {
  return ({ name, content }) => ({
    identifier: getIdentifier({ name, themeSuffix: theme }),
    content
  });
}
