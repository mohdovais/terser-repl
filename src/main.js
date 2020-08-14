(function () {
  const { minify } = Terser;
  const doc = document;
  const getElementById = doc.getElementById.bind(doc);
  const sourceEl = getElementById("source");
  const targetEl = getElementById("target");
  const sourceBytesEl = getElementById("source-bytes");
  const targetBytesEl = getElementById("target-bytes");
  const terserConfig = {
    toplevel: true,
  };

  const sourceCodeMirror = CodeMirror.fromTextArea(sourceEl, {
    mode: "javascript",
    lineNumbers: true,
  });
  const targetCodeMirror = CodeMirror.fromTextArea(targetEl, {
    mode: "javascript",
    lineWrapping: true,
    readOnly: true,
  });

  /**
   * https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript/34332105#34332105#answer-23329386
   * @param {string} str
   */
  function byteLength(str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);
      if (code > 0x7f && code <= 0x7ff) s++;
      else if (code > 0x7ff && code <= 0xffff) s += 2;
      if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
    }
    return s.toLocaleString() + " bytes";
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
        targetCodeMirror.setValue(
          `\n/**\n * ${name}: ${message} at ${line}:${col}\n */`
        );
      });
  }

  sourceCodeMirror.on("change", doMinify);
})();
