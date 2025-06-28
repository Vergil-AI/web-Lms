let editor;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.38.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: `console.log("Hello, Altair Edu!");`,
    language: 'javascript',
    theme: 'vs-dark'
  });
});

function runCode() {
  const userCode = editor.getValue();
  const outputElement = document.getElementById("consoleOutput");
  outputElement.textContent = "";

  try {
    const log = console.log;
    const output = [];
    console.log = (...args) => output.push(args.join(" "));
    eval(userCode);
    console.log = log;
    outputElement.textContent = output.join("\n");
  } catch (error) {
    outputElement.textContent = "❌ Error: " + error.message;
  }
}
