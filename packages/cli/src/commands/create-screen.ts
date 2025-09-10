import path from 'node:path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';

export interface CreateScreenOptions {
  directory?: string;
}

export async function createScreen(
  screenName: string,
  options: CreateScreenOptions = {}
): Promise<void> {
  const screenNamePascal = toPascalCase(screenName);
  const screenNameCamel = toCamelCase(screenName);
  
  // Determine output directory
  const outputDir = options.directory || path.join(process.cwd(), 'src', 'screens', screenNamePascal);
  
  // Check if screen already exists
  const exists = await fs.pathExists(outputDir);
  if (exists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Screen "${screenNamePascal}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    
    if (!overwrite) {
      logger.info('Screen creation cancelled');
      return;
    }
  }

  logger.startSpinner(`Creating screen ${screenNamePascal}...`);
  
  try {
    await fs.ensureDir(outputDir);
    
    // Create .view.vrn file
    const viewContent = generateViewFile(screenNamePascal);
    await fs.writeFile(path.join(outputDir, `${screenNamePascal}.view.vrn`), viewContent);
    
    // Create .logic.js file
    const logicContent = generateLogicFile(screenNamePascal, screenNameCamel);
    await fs.writeFile(path.join(outputDir, `${screenNamePascal}.logic.js`), logicContent);
    
    // Create connector .js file
    const connectorContent = generateConnectorFile(screenNamePascal, screenNameCamel);
    await fs.writeFile(path.join(outputDir, `${screenNamePascal}.js`), connectorContent);
    
    // Create index.js for easy imports
    const indexContent = `export { default } from './${screenNamePascal}';\n`;
    await fs.writeFile(path.join(outputDir, 'index.js'), indexContent);
    
    logger.succeedSpinner(`Screen ${screenNamePascal} created successfully!`);
    
    logger.info('Files created:');
    console.log(`  ${path.relative(process.cwd(), path.join(outputDir, `${screenNamePascal}.view.vrn`))}`);
    console.log(`  ${path.relative(process.cwd(), path.join(outputDir, `${screenNamePascal}.logic.js`))}`);
    console.log(`  ${path.relative(process.cwd(), path.join(outputDir, `${screenNamePascal}.js`))}`);
    console.log(`  ${path.relative(process.cwd(), path.join(outputDir, 'index.js'))}`);
    
  } catch (error) {
    logger.failSpinner('Failed to create screen');
    throw error;
  }
}

function generateViewFile(screenName: string): string {
  return `import React from 'react';
import { Screen, Stack, Text, Button } from '@visual-rn/core';

/**
 * @vrn-bindings
 * state: {
 *   loading: boolean
 * }
 * actions: {
 *   handleAction: () => void
 * }
 */
export default function ${screenName}View({ state, actions }) {
  return (
    <Screen safe bg="background">
      <Stack spacing={5} p={5} justify="center" flex={1}>
        <Text variant="h1" align="center">
          ${screenName}
        </Text>
        
        <Text variant="body" align="center" color="textLight">
          Welcome to your new screen!
        </Text>
        
        <Button
          variant="primary"
          onPress={actions.handleAction}
          loading={state.loading}
        >
          Get Started
        </Button>
      </Stack>
    </Screen>
  );
}
`;
}

function generateLogicFile(screenName: string, screenNameCamel: string): string {
  return `import { useState } from 'react';

export function use${screenName}Logic() {
  const [loading, setLoading] = useState(false);
  
  const handleAction = async () => {
    setLoading(true);
    
    try {
      // Add your business logic here
      console.log('${screenName} action triggered');
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error in ${screenNameCamel} action:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    state: {
      loading,
    },
    actions: {
      handleAction,
    },
  };
}
`;
}

function generateConnectorFile(screenName: string, _screenNameCamel: string): string {
  return `import React from 'react';
import ${screenName}View from './${screenName}.view.vrn';
import { use${screenName}Logic } from './${screenName}.logic';

export default function ${screenName}() {
  const { state, actions } = use${screenName}Logic();
  
  return <${screenName}View state={state} actions={actions} />;
}
`;
}

function toPascalCase(str: string): string {
  return str.replace(/(?:^|[\s-_])([a-z])/g, (_, char) => char.toUpperCase());
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}