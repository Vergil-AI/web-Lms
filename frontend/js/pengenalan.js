import { isMatch } from './utils/validator.js';

let editor;

// Konfigurasi editor
require.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.38.0/min/vs" } });

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: `// Coba ubah teks di bawah ini dan klik "Jalankan Kode"\nconsole.log("Halo dunia!");`,
    language: "javascript",
    theme: "vs-dark",
    fontSize: 14,
    automaticLayout: true,
  });
});

// Fungsi jalankan kode + validasi
window.runCode = function () {
  const userCode = editor.getValue();
  const outputElement = document.getElementById("consoleOutput");
  const msg = document.getElementById("progressMsg");

  outputElement.textContent = "";
  msg.textContent = "";

  try {
    const originalLog = console.log;
    const output = [];
    console.log = (...args) => output.push(args.join(" "));
    eval(userCode);
    console.log = originalLog;

    const result = output.join("\n") || "// Tidak ada output";
    outputElement.textContent = result;

    // 🎯 Validasi otomatis
    const expectedOutput = "Halo dunia!";
    if (isMatch(result, expectedOutput)) {
      msg.textContent = "✅ Output sesuai! Menyimpan progress...";
      markProgress("javascript", "pengenalan-javascript", true);
    } else {
      msg.textContent = "❌ Output belum sesuai. Coba lagi.";
    }

  } catch (err) {
    outputElement.textContent = "❌ Error: " + err.message;
  }
};

// Simpan progress
window.markProgress = function (topik, submodul, auto = false) {
  const btn = document.getElementById("progressBtn");
  const msg = document.getElementById("progressMsg");

  if (!auto) {
    btn.disabled = true;
    btn.textContent = "⏳ Menyimpan...";
  }

  fetch(`/update_progress/${topik}/${submodul}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Gagal menyimpan.");
      return res.text();
    })
    .then(() => {
      if (!auto) btn.textContent = "✅ Selesai";
      msg.textContent = "✅ Progress berhasil disimpan!";
    })
    .catch((err) => {
      if (!auto) {
        btn.disabled = false;
        btn.textContent = "✔️ Coba Lagi";
      }
      msg.textContent = "❌ Gagal menyimpan progress.";
      console.error(err);
    });
};
