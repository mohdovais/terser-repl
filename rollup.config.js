import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import umd from "./rollup-plugin-import-umd";

export default {
  input: "src/main.js",
  preserveEntrySignatures: false,
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    postcss({ extract: true, minimize: true, sourceMap: true }),
    resolve(),
    commonjs(),
    umd("codemirror/mode/javascript/javascript.js"),
    terser(),
  ],
};
