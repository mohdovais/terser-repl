import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

import { readFileSync } from "fs";
import acorn from "acorn";

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
    umdExpression(),
    terser(),
  ],
};

function umdExpression() {
  return {
    name: "umd-expression",
    load(id) {
      if (/codemirror\/mode\/javascript\/javascript.js$/.test(id)) {
        const content = readFileSync(id, "utf8");
        const ast = acorn.parse(content, { ecmaVersion: 2020 });
        const { start, end } = ast.body[0].expression.arguments[0];
        return `export default ${content.substring(start, end)}`;
      }
      return null;
    },
  };
}
