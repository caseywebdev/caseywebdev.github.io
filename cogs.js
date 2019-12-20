const { env } = process;

const MINIFY = env.MINIFY === '1';

module.exports = {
  main: {
    transformers: [].concat(
      {
        name: 'babel',
        only: 'src/**/*.js',
        options: {
          caller: { name: 'cogs', supportsDynamicImport: true },
          plugins: ['@babel/plugin-proposal-class-properties'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 ChromeAndroid versions',
                    'last 2 Edge versions',
                    'last 2 Firefox versions',
                    'last 2 iOS versions',
                    'last 2 Safari versions'
                  ]
                }
              }
            ],
            '@babel/preset-react'
          ]
        }
      },
      {
        name: 'concat-commonjs',
        only: '**/*.js',
        options: { entry: 'src/index.js' }
      },
      MINIFY
        ? {
            name: 'terser',
            only: '**/*.+js',
            except: '**/*+(-|_|.)min.js'
          }
        : []
    ),
    builds: { 'src/index.js': { base: 'src', dir: 'docs' } }
  }
};
