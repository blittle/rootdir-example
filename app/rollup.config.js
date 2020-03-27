import lwc from '@lwc/rollup-plugin';
import replace from 'rollup-plugin-replace';
import visualizer from 'rollup-plugin-visualizer';
import path from 'path';

const outputDir = path.resolve(__dirname, `./src/dist`);
const input = path.resolve(__dirname, './src/index.js');
const output = path.join(outputDir, 'app.js');
const env = process.env.NODE_ENV || 'development';

const node_modules = 'node_modules';
const lwcPlugin = lwc({
  rootDir: './src/modules',
});

export default {
  input,
  output: {
    format: 'iife',
    file: path.join(outputDir, 'app.js'),
  },
  plugins: [
    {
      resolveId(importee, importer) {
        const result = lwcPlugin.resolveId(importee, importer);

        if (importee === 'lwc') {
          return require.resolve(
            result.substring(
              result.lastIndexOf(node_modules) + node_modules.length + 1,
            ),
          );
        }
        return result;
      },
    },
    lwcPlugin,
    replace({'process.env.NODE_ENV': JSON.stringify(env)}),
    visualizer(),
  ],
};
