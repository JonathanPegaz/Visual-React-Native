import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function copyTemplate(
  templatePath: string,
  targetPath: string,
  replacements: Record<string, string> = {}
): Promise<void> {
  const templateExists = await fs.pathExists(templatePath);
  if (!templateExists) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  await fs.copy(templatePath, targetPath);
  
  // Replace placeholders in all text files
  await replaceInFiles(targetPath, replacements);
}

export async function replaceInFiles(
  dirPath: string,
  replacements: Record<string, string>
): Promise<void> {
  const files = await getTextFiles(dirPath);
  
  for (const filePath of files) {
    let content = await fs.readFile(filePath, 'utf-8');
    
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      content = content.replace(new RegExp(placeholder, 'g'), replacement);
    }
    
    await fs.writeFile(filePath, content);
  }
}

async function getTextFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      files.push(...await getTextFiles(fullPath));
    } else if (isTextFile(item.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function isTextFile(fileName: string): boolean {
  const textExtensions = [
    '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.yml', '.yaml',
    '.vrn', '.css', '.scss', '.html', '.xml', '.gitignore', '.env'
  ];
  
  const ext = path.extname(fileName).toLowerCase();
  return textExtensions.includes(ext) || fileName.startsWith('.');
}

export async function createFromTemplate(
  templateName: string,
  targetPath: string,
  projectName: string,
  additionalReplacements: Record<string, string> = {}
): Promise<void> {
  const templatePath = path.join(__dirname, '../../templates', templateName);
  
  const replacements = {
    '{{PROJECT_NAME}}': projectName,
    '{{PROJECT_NAME_KEBAB}}': toKebabCase(projectName),
    '{{PROJECT_NAME_CAMEL}}': toCamelCase(projectName),
    '{{PROJECT_NAME_PASCAL}}': toPascalCase(projectName),
    ...additionalReplacements,
  };
  
  await copyTemplate(templatePath, targetPath, replacements);
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function toPascalCase(str: string): string {
  return toCamelCase(str).replace(/^[a-z]/, char => char.toUpperCase());
}