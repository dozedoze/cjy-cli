import { ESLint } from "eslint";
import { getCwdPath, countTime } from "../util";

// 1. Create an instance.
const eslint = new ESLint({
  fix: true,
  extensions: [".js", ".ts"],
  useEslintrc: false,
  overrideConfig: {
    env: {
      browser: true,
      es2021: true,
    },
    parser: getRePath("@typescript-eslint/parser"),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
  },
  resolvePluginsRelativeTo: getDirPath("../../node_modules"), // 指定 loader 加载路径
});

export const getEslint = async (path: string = "src") => {
  try {
    countTime("Eslint 校验");
    // 2. Lint files.
    const results = await eslint.lintFiles([`${getCwdPath()}/${path}`]);

    // 3. Modify the files with the fixed code.
    await ESLint.outputFixes(results);

    // 4. Format the results.
    const formatter = await eslint.loadFormatter("stylish");

    const resultText = formatter.format(results);

    // 5. Output it.
    if (resultText) {
      console.log("请检查===》", resultText);
    } else {
      console.log("完美！");
    }
  } catch (error) {
    process.exitCode = 1;
    console.error("error===>", error);
  } finally {
    countTime("Eslint 校验", false);
  }
};
