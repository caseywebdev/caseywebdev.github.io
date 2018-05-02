const {env} = process;

const MINIFY = env.MINIFY === '1';

module.exports = {
  transformers: [].concat(
    {name: 'sass', only: 'styles/**/*.scss'},
    {name: 'autoprefixer', only: '**/*.scss'},
    MINIFY ? {name: 'clean-css', only: '**/*.scss'} : [],
    {
      name: 'babel',
      only: 'scripts/**/*.js',
      options: {
        plugins: ['transform-runtime'],
        presets: ['env', 'stage-0', 'react']
      }
    },
    {
      name: 'concat-commonjs',
      only: '**/*.js',
      options: {entry: 'scripts/index.js'}
    },
    MINIFY ? {
      name: 'uglify-js',
      only: '**/*.js',
      except: '**/*+(-|_|.)min.js'
    } : []
  ),
  builds: {
    'scripts/index.js': {base: 'scripts', dir: 'public'},
    'styles/index.scss': {base: 'styles', dir: 'public', ext: {'.scss': '.css'}}
  }
};
