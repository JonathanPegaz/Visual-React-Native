#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createProject } from './commands/create-project.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(await readFile(join(__dirname, '../package.json'), 'utf-8'));
const version = packageJson.version;

program
  .name('create-visual-rn')
  .description('CLI to create Visual React Native projects')
  .version(version)
  .argument('<project-name>', 'Name of the project to create')
  .option('-t, --template <template>', 'Template to use', 'default')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-install', 'Skip dependency installation')
  .action(async (projectName: string, options) => {
    console.log(chalk.blue.bold('🎨 Visual React Native Project Creator'));
    console.log();
    
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program.parse();