import path from 'node:path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';

export interface CreateComponentOptions {
  directory?: string;
}

export async function createComponent(
  componentName: string,
  options: CreateComponentOptions = {}
): Promise<void> {
  const componentNamePascal = toPascalCase(componentName);
  
  // Determine output directory
  const outputDir = options.directory || path.join(process.cwd(), 'src', 'components');
  const componentPath = path.join(outputDir, `${componentNamePascal}.js`);
  
  // Check if component already exists
  const exists = await fs.pathExists(componentPath);
  if (exists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Component "${componentNamePascal}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    
    if (!overwrite) {
      logger.info('Component creation cancelled');
      return;
    }
  }

  logger.startSpinner(`Creating component ${componentNamePascal}...`);
  
  try {
    await fs.ensureDir(outputDir);
    
    // Ask for component type
    const { componentType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'componentType',
        message: 'What type of component?',
        choices: [
          { name: 'Functional Component', value: 'functional' },
          { name: 'Visual RN Component (with metadata)', value: 'vrn' },
        ],
        default: 'functional',
      },
    ]);
    
    const componentContent = componentType === 'vrn' 
      ? generateVRNComponent(componentNamePascal)
      : generateFunctionalComponent(componentNamePascal);
      
    await fs.writeFile(componentPath, componentContent);
    
    logger.succeedSpinner(`Component ${componentNamePascal} created successfully!`);
    
    logger.info('File created:');
    console.log(`  ${path.relative(process.cwd(), componentPath)}`);
    
    if (componentType === 'vrn') {
      console.log();
      logger.info('This component includes Visual RN metadata and can be used in the visual editor.');
    }
    
  } catch (error) {
    logger.failSpinner('Failed to create component');
    throw error;
  }
}

function generateFunctionalComponent(componentName: string): string {
  return `import React from 'react';
import { View } from 'react-native';

export const ${componentName} = ({ children, ...props }) => {
  return (
    <View {...props}>
      {children}
    </View>
  );
};

export default ${componentName};
`;
}

function generateVRNComponent(componentName: string): string {
  return `import React from 'react';
import { View, ViewStyle } from 'react-native';

export interface ${componentName}Props {
  children?: React.ReactNode;
  style?: ViewStyle;
  // Add your custom props here
}

export const ${componentName} = ({ 
  children, 
  style,
  ...props 
}: ${componentName}Props) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

// Visual RN metadata for the visual editor
${componentName}.__vrn__ = {
  type: '${componentName}',
  category: 'Custom',
  props: {
    // Define editable props here
    // Example:
    // spacing: {
    //   type: 'number',
    //   default: 0,
    // },
  },
  container: true,
  acceptsChildren: true,
};

export default ${componentName};
`;
}

function toPascalCase(str: string): string {
  return str.replace(/(?:^|[\s-_])([a-z])/g, (_, char) => char.toUpperCase());
}