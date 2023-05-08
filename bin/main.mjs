#!/usr/bin/env node
import { Command } from "commander";
import ora from "ora";
import inquirer from "inquirer";
import path from "path";
import semver from "semver";
import fse from "fs-extra";
import chalk from "chalk";
import { fileURLToPath } from "url";

const program = new Command();
const __dirname = fileURLToPath(import.meta.url);
const filepath = process.cwd();

program
  .version("0.1.0")
  .description("开始测试")
  .action(async (value) => {
    // 判断当前 node 是否符合环境
    const cliPackPath = path.join(__dirname, "../../package.json");
    const cliPackage = await fse.readJSON(cliPackPath);
    // 检查 node 版本
    checkNodeVersion(cliPackage.engines.node, cliPackage.name);

    fse.readFile(
      path.join(__dirname, "../../src/copy-content/prettier.js"),
      (err, data) => {
        if (err) throw "prettier 配置文件写入失败";
        const perttierPath = path.join(filepath, "/.prettierrc.cjs");
        fse.writeFile(perttierPath, data);
      }
    );

    // fse.readFile(
    //   path.join(__dirname, "../../src/copy-content/commitlint.js"),
    //   (err, data) => {
    //     if (err) throw "commitlintrc 配置文件写入失败";
    //     const perttierPath = path.join(filepath, "/.commitlintrc.cjs");
    //     fse.writeFile(perttierPath, data);
    //   }
    // );
    const perttierPath = path.join(filepath, "/.commitlintrc.cjs");
    fse.copyFile(
      path.join(__dirname, "../../src/copy-content/commitlint.js"),
      perttierPath,
      (err) => {
        if (err) {
          console.log(chalk.red("commitlint 配置失败"));
        }
      }
    );

    // const packagePath = path.join(filepath, "/package.json");
    // const targetPackage = await readJSON(packagePath);
  });
program.parse(process.argv);

function checkNodeVersion(requireNodeVersion, frameworkName = "auge") {
  if (!semver.satisfies(process.version, requireNodeVersion)) {
    console.log();
    console.log(chalk.red(`  You are using Node ${process.version}`));
    console.log(
      chalk.red(
        `  ${frameworkName} requires Node ${requireNodeVersion}, please update Node.`
      )
    );
    console.log();
    console.log();
    // 失败退出
    process.exit(1);
  }
}
