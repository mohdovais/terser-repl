const { minify } = Terser;
const getElementById = id => document.getElementById(id);
const sourceEl = getElementById("source");
const targetEl = getElementById("minified");
const sourceBytesEl = getElementById("source-size");
const targetBytesEl = getElementById("minified-size");
const terserConfig = {
  toplevel: true,
};

const cm = (textArea, isMinified) =>
  CodeMirror.fromTextArea(textArea, {
    mode: "javascript",
    lineNumbers: !isMinified,
    readOnly: isMinified,
    lineWrapping: isMinified,
  });

const sourceCodeMirror = cm(sourceEl, false);
const targetCodeMirror = cm(targetEl, true);

function byteLength(str) {
  const blob = new Blob([str]);
  return blob.length.toLocaleString() + ' bytes';
}

/**
 *
 */
function doMinify() {
  const source = sourceCodeMirror.getValue();
  sourceBytesEl.innerText = byteLength(source);
  minify(source, terserConfig)
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
