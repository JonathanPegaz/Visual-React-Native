import path from 'node:path';
import fs from 'fs-extra';
import { execSync } from 'node:child_process';
import inquirer from 'inquirer';
import validateNpmPackageName from 'validate-npm-package-name';
import { logger } from '../utils/logger.js';
import { createFromTemplate } from '../utils/file-utils.js';

export interface CreateProjectOptions {
  template?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
}

export async function createProject(
  projectName: string,
  options: CreateProjectOptions = {}
): Promise<void> {
  // Validate project name
  const validation = validateNpmPackageName(projectName);
  if (!validation.validForNewPackages) {
    throw new Error(`Invalid project name: ${validation.errors?.join(', ')}`);
  }

  const targetPath = path.resolve(projectName);
  
  // Check if directory already exists
  const exists = await fs.pathExists(targetPath);
  if (exists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory "${projectName}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    
    if (!overwrite) {
      logger.info('Project creation cancelled');
      return;
    }
    
    await fs.remove(targetPath);
  }

  logger.startSpinner('Creating project structure...');
  
  try {
    // Create project from template
    const templateName = options.template || 'default';
    await createFromTemplate(templateName, targetPath, projectName);
    
    logger.updateSpinner('Installing dependencies...');
    
    if (!options.skipInstall) {
      process.chdir(targetPath);
      execSync('npm install', { stdio: 'inherit' });
    }
    
    if (!options.skipGit) {
      logger.updateSpinner('Initializing git repository...');
      
      try {
        execSync('git init', { stdio: 'pipe' });
        execSync('git add .', { stdio: 'pipe' });
        execSync('git commit -m "Initial commit"', { stdio: 'pipe' });
      } catch (error) {
        logger.warning('Failed to initialize git repository');
      }
    }
    
    logger.succeedSpinner('Project created successfully!');
    
    // Print next steps
    console.log();
    logger.info('Next steps:');
    console.log(`  cd ${projectName}`);
    if (options.skipInstall) {
      console.log('  npm install');
    }
    console.log('  npm run ios     # or npm run android');
    console.log('  code .          # to open in VS Code');
    console.log();
    logger.info('To start the visual editor:');
    console.log('  1. Open VS Code');
    console.log('  2. Install the "Visual RN Editor" extension');
    console.log('  3. Open any .view.vrn file');
    console.log('  4. Click "Open Visual Editor" in the top bar');
    
  } catch (error) {
    logger.failSpinner('Failed to create project');
    throw error;
  }
}