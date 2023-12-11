//@ts-check

// import resolve from 'rollup-plugin-node-resolve';
// import typescript from 'rollup-plugin-typescript2';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from "path";
// import { terser } from "rollup-plugin-terser";

const release = true

export default {
    input: './sources/bin.js',
    output: {
        file: './bin/bin.js',
        format: 'cjs',
        exports: "auto"
    },
    plugins: [
        resolve(),
        commonjs(),
        // typescript({}),
        {
            name: 'rollup-plugin-shebang-insert',
            /**
             * @param {{file: string}} opts - options
             * @param {{[fileName: string]: {code: string}}} bundle 
             */
            generateBundle(opts, bundle) {

                const file = path.parse(opts.file).base
                let code = bundle[file].code;
                bundle[file].code = '#!/usr/bin/env node\n\n' + bundle[file].code
            }
        },
        // terser()
    ]
};
