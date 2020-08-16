import CodeMirror from "codemirror/src/codemirror";
import modeJavaScript from "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "./style.css";

modeJavaScript(CodeMirror);

const doc = document;
const getElementById = doc.getElementById.bind(doc);
const sourceBytesEl = getElementById("source-size");
const targetBytesEl = getElementById("minified-size");

const getFromTextArea = (textArea, isMinified) =>
  CodeMirror.fromTextArea(textArea, {
    mode: "javascript",
    lineNumbers: !isMinified,
    readOnly: isMinified,
    lineWrapping: isMinified,
  });

const sourceCodeMirror = getFromTextArea(getElementById("source"));
const targetCodeMirror = getFromTextArea(getElementById("minified"), true);

/**
 * @param {string} str
 */
function byteLength(str) {
  var blob = new Blob([str]);
  return blob.size.toLocaleString() + " bytes";
}

function doMinify() {
  const source = sourceCodeMirror.getValue();
  sourceBytesEl.innerText = byteLength(source);
  import("terser/main")
    .then(({ minify }) =>
      minify(source, {
        toplevel: true,
      })
    )
    .then(({ code }) => {
      targetBytesEl.innerText = byteLength(code);
      targetCodeMirror.setValue(code);
    })
    .catch(({ line, col, message, name }) => {
      targetBytesEl.innerText = "";
      targetCodeMirror.setValue(
        `\n/**\n * ${name}: ${message} at ${line}:${col}\n */`
      );
    });
}

sourceCodeMirror.on("change", doMinify);
