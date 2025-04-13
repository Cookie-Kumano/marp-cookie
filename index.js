import * as sass from "sass";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";

// 入力ファイルと出力ディレクトリを指定
const inputFile = "theme/marp-cookie.scss"; // SCSS 入力ファイル
const outputDir = "public"; // 出力ディレクトリ
const outputFile = path.join(outputDir, "marp-cookie.css"); // 出力ファイル

// 固定文字列（ヘッダーとして挿入する文字列）
const fixedHeader = `/* @theme cookie */\n@import 'default';\n`;

// Sass をコンパイルする関数
function compile() {
  try {
    // Sass をコンパイル
    const result = sass.compile(inputFile);

    // 出力ディレクトリを作成（存在しない場合）
    fs.mkdirSync(outputDir, { recursive: true });

    // 固定文字列 + Sass 出力をファイルに書き込み
    fs.writeFileSync(outputFile, fixedHeader + result.css);

    console.log(
      `[${new Date().toLocaleTimeString()}] CSS compiled and saved to ${outputFile}`
    );
  } catch (error) {
    console.error(
      `[${new Date().toLocaleTimeString()}] Error compiling Sass:`,
      error
    );
  }
}

// ファイル監視モード
function watch() {
  // 初回コンパイル
  compile();

  // ファイルを監視して変更があれば再コンパイル
  const watcher = chokidar.watch(inputFile, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", (filePath) => {
    console.log(
      `[${new Date().toLocaleTimeString()}] File changed: ${filePath}`
    );
    compile();
  });

  console.log(`Watching ${inputFile} for changes...`);
}

// コマンドライン引数でモードを判定
const mode = process.argv[2];

if (mode === "watch") {
  watch();
} else if (mode === "compile") {
  compile();
} else {
  console.log("Usage: node compile-sass.js [watch|compile]");
}
