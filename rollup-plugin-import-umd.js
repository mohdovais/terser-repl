import { readFileSync } from "fs";
import { isRegExp } from "util";
import { parse } from "acorn";

export default function importUMD(modules, config) {
  const _config = Object.assign({ ecmaVersion: 2020 }, config);
  const _modules = (Array.isArray(modules) ? modules : [modules]).map((item) =>
    isRegExp(item) ? item : new RegExp(item, "i")
  );

  return {
    name: "import-umd",
    load(id) {
      if (_modules.some((module) => module.test(id))) {
        const content = readFileSync(id, "utf8");
        const ast = parse(content, _config);
        const { start, end } = ast.body[0].expression.arguments[0];
        return `export default ${content.substring(start, end)}`;
      }
      return null;
    },
  };
}
