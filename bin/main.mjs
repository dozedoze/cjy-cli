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

    // const packagePath = path.join(filepath, "/package.json");
    // const targetPackage = await readJSON(packagePath);

    // fse.writeFile(path.join(filepath, ))

    console.log(result);
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
