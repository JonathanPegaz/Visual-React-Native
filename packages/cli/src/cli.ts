#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createScreen } from './commands/create-screen.js';
import { createComponent } from './commands/create-component.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(await readFile(join(__dirname, '../package.json'), 'utf-8'));
const version = packageJson.version;

program
  .name('visual-rn')
  .description('Visual React Native development tools')
  .version(version);

program
  .command('create')
  .description('Create new Visual RN resources')
  .argument('<type>', 'Type of resource (screen, component)')
  .argument('<name>', 'Name of the resource')
  .option('-d, --directory <dir>', 'Output directory')
  .action(async (type: string, name: string, options) => {
    console.log(chalk.blue.bold('🎨 Visual React Native Generator'));
    console.log();
    
    try {
      switch (type.toLowerCase()) {
        case 'screen':
          await createScreen(name, options);
          break;
        case 'component':
          await createComponent(name, options);
          break;
        default:
          console.error(chalk.red(`Unknown resource type: ${type}`));
          console.log(chalk.gray('Available types: screen, component'));
          process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize Visual RN in existing project')
  .option('--force', 'Overwrite existing configuration')
  .action(async (_options) => {
    console.log(chalk.blue.bold('🎨 Visual React Native Initialization'));
    console.log();
    
    // TODO: Implement init command
    console.log(chalk.yellow('Init command not yet implemented'));
  });

program.parse();