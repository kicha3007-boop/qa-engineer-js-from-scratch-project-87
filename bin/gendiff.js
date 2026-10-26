#!/usr/bin/env node

import { program } from "commander";
import genDiff from "../index.js";

program
  .name("gendiff")
  .description("Compares two configuration files and shows a difference.")
  .version("1.0.0")
  .arguments("<filepath1> <filepath2>")
  .option("-f, --format <type>", "output format", "stylish")
  .action((filepath1, filepath2, options) => {
    try {
      console.log(genDiff(filepath1, filepath2, options.format));
    } catch (error) {
      console.error(`gendiff: ${error.message}`);
      process.exitCode = 1;
    }
  });

program.parse();
