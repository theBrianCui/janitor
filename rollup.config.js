import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  //entry: 'popup.ts',
  format: 'iife',
  plugins: [
    typescript({
        tsconfig: "tsconfig.json"
    }),
    commonjs({
      include: 'node_modules/**',
      
      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: 'inline',  // Default: true
    }),
    resolve({
      jsnext: true,
      main: true
    })


  ]
};
