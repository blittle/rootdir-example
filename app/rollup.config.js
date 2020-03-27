import lwc from '@lwc/rollup-plugin';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import path from 'path';

const outputDir = path.resolve(__dirname, `./src/dist`);
const input = path.resolve(__dirname, './src/index.js');
const output = path.join(outputDir, 'app.js');
const env = process.env.NODE_ENV || 'development';

export default {
  input,
  output: {
    format: 'iife',
    file: path.join(outputDir, 'app.js'),
  },
  plugins: [
    resolve({
      mainFields: ['module', 'main'],
      browser: true,
    }),
    lwc({
      rootDir: "./src",
      modules: [
        {
          dir: 'modules',
        },
        {
          npm: 'my-dependency',
        },
      ],
    }),
    replace({'process.env.NODE_ENV': JSON.stringify(env)}),
  ],
};
