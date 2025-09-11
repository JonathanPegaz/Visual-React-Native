import * as babel from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { 
  validateVRNComponent, 
  validateVRNFile, 
  VRNComponent,
  VRNFile 
} from '../schemas/VRNSchemas';
import { ASTGenerator } from './ASTGenerator';

export interface VRNNode {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children: VRNNode[];
  bindings: {
    state: string[];
    actions: string[];
  };
  metadata: {
    line: number;
    column: number;
    editable: boolean;
  };
}

export interface VRNBindings {
  state: Record<string, {
    type: string;
    description?: string;
  }>;
  actions: Record<string, {
    type: string;
    parameters?: any[];
    description?: string;
  }>;
}

export interface ParsedVRNFile {
  tree: VRNNode;
  bindings: VRNBindings;
  imports: string[];
  exports: string[];
  raw: string;
  ast: t.File;
}

export class VRNParser {
  private nodeIdCounter = 0;
  private astGenerator = new ASTGenerator();

  parse(content: string): ParsedVRNFile {
    try {
      // Parse JSX content with Babel
      const ast = babel.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      const imports: string[] = [];
      const exports: string[] = [];
      let mainComponent: t.Node | null = null;
      let bindings: VRNBindings = { state: {}, actions: {} };

      // Traverse AST to extract information
      traverse(ast, {
        ImportDeclaration: (path) => {
          imports.push(path.node.source.value);
        },
        
        ExportDefaultDeclaration: (path) => {
          mainComponent = path.node.declaration;
          exports.push('default');
        },

        // Extract bindings from JSDoc comments
        FunctionDeclaration: (path) => {
          if (path.node.id?.name && path.node.id.name.endsWith('View')) {
            bindings = this.extractBindingsFromComments(path.node.leadingComments || []);
          }
        },

        ArrowFunctionExpression: (path) => {
          const parent = path.parent;
          if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id) && 
              parent.id.name.endsWith('View')) {
            bindings = this.extractBindingsFromComments(path.node.leadingComments || []);
          }
        },
      });

      // Build component tree from main component
      const tree = this.buildComponentTree(mainComponent);

      return {
        tree,
        bindings,
        imports,
        exports,
        raw: content,
        ast,
      };
    } catch (error) {
      throw new Error(`Failed to parse VRN file: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  private buildComponentTree(node: t.Node | null): VRNNode {
    this.nodeIdCounter = 0;
    return this.traverseJSXElement(node);
  }

  private traverseJSXElement(node: t.Node | null): VRNNode {
    if (!node) {
      return this.createEmptyNode();
    }

    if (t.isFunctionDeclaration(node) || t.isArrowFunctionExpression(node)) {
      // Find the return statement
      const returnStatement = this.findReturnStatement(node);
      if (returnStatement) {
        return this.traverseJSXElement(returnStatement);
      }
    }

    if (t.isReturnStatement(node)) {
      return this.traverseJSXElement(node.argument || null);
    }

    if (t.isJSXElement(node)) {
      return this.parseJSXElement(node);
    }

    if (t.isJSXFragment(node)) {
      const children = node.children.map(child => this.traverseJSXElement(child));
      return {
        id: this.generateId(),
        type: 'Fragment',
        name: 'Fragment',
        props: {},
        children: children.filter(child => child.type !== 'empty'),
        bindings: { state: [], actions: [] },
        metadata: {
          line: node.loc?.start.line || 0,
          column: node.loc?.start.column || 0,
          editable: true,
        },
      };
    }

    return this.createEmptyNode();
  }

  private parseJSXElement(element: t.JSXElement): VRNNode {
    const name = this.getElementName(element.openingElement.name);
    const props = this.parseProps(element.openingElement.attributes);
    const children = element.children
      .map(child => this.traverseJSXElement(child))
      .filter(child => child.type !== 'empty');

    const bindings = this.extractElementBindings(props);

    return {
      id: this.generateId(),
      type: 'Element',
      name,
      props,
      children,
      bindings,
      metadata: {
        line: element.loc?.start.line || 0,
        column: element.loc?.start.column || 0,
        editable: true,
      },
    };
  }

  private getElementName(name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName): string {
    if (t.isJSXIdentifier(name)) {
      return name.name;
    }
    if (t.isJSXMemberExpression(name)) {
      return `${this.getElementName(name.object)}.${name.property.name}`;
    }
    if (t.isJSXNamespacedName(name)) {
      return `${name.namespace.name}:${name.name.name}`;
    }
    return 'Unknown';
  }

  private parseProps(attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]): Record<string, any> {
    const props: Record<string, any> = {};

    for (const attr of attributes) {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const key = attr.name.name;
        const value = this.parseAttributeValue(attr.value);
        props[key] = value;
      }
    }

    return props;
  }

  private parseAttributeValue(value: t.JSXAttribute['value']): any {
    if (!value) return true;
    
    if (t.isStringLiteral(value)) {
      return value.value;
    }

    if (t.isJSXExpressionContainer(value)) {
      const expression = value.expression;
      
      if (t.isStringLiteral(expression) || t.isNumericLiteral(expression) || t.isBooleanLiteral(expression)) {
        return expression.value;
      }

      if (t.isMemberExpression(expression)) {
        return generate(expression).code;
      }

      return generate(expression).code;
    }

    return null;
  }

  private extractElementBindings(props: Record<string, any>): { state: string[]; actions: string[] } {
    const state: string[] = [];
    const actions: string[] = [];

    for (const [, value] of Object.entries(props)) {
      if (typeof value === 'string') {
        if (value.startsWith('state.')) {
          state.push(value);
        } else if (value.startsWith('actions.')) {
          actions.push(value);
        }
      }
    }

    return { state, actions };
  }

  private extractBindingsFromComments(comments: t.Comment[]): VRNBindings {
    const bindings: VRNBindings = { state: {}, actions: {} };

    for (const comment of comments) {
      if (comment.type === 'CommentBlock' && comment.value.includes('@vrn-bindings')) {
        // Parse JSDoc-style bindings
        const lines = comment.value.split('\n');
        let currentSection: 'state' | 'actions' | null = null;

        for (const line of lines) {
          const trimmed = line.trim().replace(/^\*\s?/, '');
          
          if (trimmed.startsWith('state:')) {
            currentSection = 'state';
            continue;
          } else if (trimmed.startsWith('actions:')) {
            currentSection = 'actions';
            continue;
          }

          if (currentSection && trimmed.includes(':')) {
            const [name, type] = trimmed.split(':').map(s => s.trim());
            if (name && type && !name.startsWith('*') && !name.startsWith('}')) {
              bindings[currentSection][name] = { type: type.replace(/[,}]/g, '').trim() };
            }
          }
        }
      }
    }

    return bindings;
  }

  private findReturnStatement(func: t.FunctionDeclaration | t.ArrowFunctionExpression): t.Node | null {
    if (t.isArrowFunctionExpression(func) && !t.isBlockStatement(func.body)) {
      return func.body;
    }

    const body = t.isFunctionDeclaration(func) ? func.body : 
                 t.isBlockStatement(func.body) ? func.body : null;

    if (!body) return null;

    for (const statement of body.body) {
      if (t.isReturnStatement(statement)) {
        return statement.argument || null;
      }
    }

    return null;
  }

  private generateId(): string {
    return `node-${++this.nodeIdCounter}`;
  }

  /**
   * Validate a VRN component tree using Zod schemas
   */
  validateComponent(component: unknown): { success: true; data: VRNComponent } | { success: false; errors: string[] } {
    return validateVRNComponent(component);
  }

  /**
   * Validate a complete VRN file structure
   */
  validateFile(file: unknown): { success: true; data: VRNFile } | { success: false; errors: string[] } {
    return validateVRNFile(file);
  }

  /**
   * Convert VRNNode to VRNComponent and validate
   */
  private validateAndConvertNode(node: VRNNode): VRNComponent | null {
    const component: VRNComponent = {
      id: node.id,
      type: node.type as any, // Type will be validated by Zod
      props: node.props,
      children: node.children.map(child => this.validateAndConvertNode(child)).filter(Boolean) as VRNComponent[],
      position: node.metadata ? { x: 0, y: 0 } : undefined,
      size: undefined,
    };

    const validation = this.validateComponent(component);
    if (!validation.success) {
      console.warn(`Component validation failed for ${node.type}:`, validation.errors);
      return null;
    }

    return validation.data;
  }

  private createEmptyNode(): VRNNode {
    return {
      id: this.generateId(),
      type: 'empty',
      name: '',
      props: {},
      children: [],
      bindings: { state: [], actions: [] },
      metadata: {
        line: 0,
        column: 0,
        editable: false,
      },
    };
  }

  updateNode(tree: VRNNode, nodeId: string, updates: Partial<VRNNode>): VRNNode {
    if (tree.id === nodeId) {
      return { ...tree, ...updates };
    }

    return {
      ...tree,
      children: tree.children.map(child => this.updateNode(child, nodeId, updates)),
    };
  }

  serialize(tree: VRNNode, bindings: VRNBindings): string {
    // Generate JSX from tree structure
    const imports = this.generateImports();
    const bindingsComment = this.generateBindingsComment(bindings);
    const component = this.generateComponent(tree, bindingsComment);

    return `${imports}\n\n${component}`;
  }

  // New AST-based serialization method
  serializeAST(tree: VRNNode, bindings: VRNBindings): string {
    return this.astGenerator.generateProgram(tree, bindings);
  }

  private generateImports(): string {
    return `import React from 'react';
import { Screen, Stack, HStack, Text, Button, Input, Card, Avatar, Image, Divider } from '@visual-rn/core';`;
  }

  private generateBindingsComment(bindings: VRNBindings): string {
    const stateLines = Object.entries(bindings.state)
      .map(([name, info]) => ` *   ${name}: ${info.type}`)
      .join(',\n');
    
    const actionLines = Object.entries(bindings.actions)
      .map(([name, info]) => ` *   ${name}: ${info.type}`)
      .join(',\n');

    return `/**
 * @vrn-bindings
 * state: {
${stateLines}
 * }
 * actions: {
${actionLines}
 * }
 */`;
  }

  private generateComponent(tree: VRNNode, bindingsComment: string): string {
    const jsx = this.generateJSX(tree);
    
    return `${bindingsComment}
export default function ComponentView({ state, actions }) {
  return (
    ${jsx}
  );
}`;
  }

  private generateJSX(node: VRNNode, depth = 0): string {
    if (node.type === 'empty') return '';

    const indent = '  '.repeat(depth + 2);
    const props = Object.entries(node.props)
      .map(([key, value]) => {
        if (typeof value === 'string' && (value.startsWith('state.') || value.startsWith('actions.'))) {
          return `${key}={${value}}`;
        } else if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean' && value) {
          return key;
        } else {
          return `${key}={${JSON.stringify(value)}}`;
        }
      })
      .join(' ');

    const propsStr = props ? ` ${props}` : '';

    if (node.children.length === 0) {
      return `<${node.name}${propsStr} />`;
    }

    const children = node.children
      .map(child => this.generateJSX(child, depth + 1))
      .filter(jsx => jsx)
      .map(jsx => `${indent}  ${jsx}`)
      .join('\n');

    return `<${node.name}${propsStr}>
${children}
${indent}</${node.name}>`;
  }
}