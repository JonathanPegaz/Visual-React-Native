import * as t from '@babel/types';
import generate from '@babel/generator';
import { VRNNode, VRNBindings } from './VRNParser';

export class ASTGenerator {
  generateProgram(tree: VRNNode, bindings: VRNBindings): string {
    const program = t.program([
      ...this.generateImports(),
      this.generateBindingsComment(bindings),
      this.generateComponentDeclaration(tree),
    ]);

    return generate(program, {
      retainLines: false,
      compact: false,
      comments: true,
    }).code;
  }

  private generateImports(): t.ImportDeclaration[] {
    // import React from 'react';
    const reactImport = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier('React'))],
      t.stringLiteral('react')
    );

    // import { Screen, Stack, HStack, Text, Button, Input, Card, Avatar, Image, Divider } from '@visual-rn/core';
    const coreImport = t.importDeclaration(
      [
        'Screen', 'Stack', 'HStack', 'Grid', 'Text', 'Button', 'Input', 
        'Card', 'Avatar', 'Image', 'Divider'
      ].map(name => t.importSpecifier(t.identifier(name), t.identifier(name))),
      t.stringLiteral('@visual-rn/core')
    );

    return [reactImport, coreImport];
  }

  private generateBindingsComment(bindings: VRNBindings): t.Statement {
    const stateLines = Object.entries(bindings.state)
      .map(([name, info]) => ` *   ${name}: ${info.type}`)
      .join(',\n');
    
    const actionLines = Object.entries(bindings.actions)
      .map(([name, info]) => ` *   ${name}: ${info.type}`)
      .join(',\n');

    const commentText = `/**
 * @vrn-bindings
 * state: {
${stateLines}
 * }
 * actions: {
${actionLines}
 * }
 */`;

    // Create an empty statement to attach the comment to
    const emptyStatement = t.emptyStatement();
    emptyStatement.leadingComments = [{
      type: 'CommentBlock',
      value: commentText.slice(3, -2), // Remove /** and */
    }];

    return emptyStatement;
  }

  private generateComponentDeclaration(tree: VRNNode): t.ExportDefaultDeclaration {
    // function ComponentView({ state, actions }) { return (...); }
    const params = [
      t.objectPattern([
        t.objectProperty(t.identifier('state'), t.identifier('state')),
        t.objectProperty(t.identifier('actions'), t.identifier('actions')),
      ])
    ];

    const returnStatement = t.returnStatement(this.generateJSXElement(tree));
    const functionBody = t.blockStatement([returnStatement]);
    
    const functionDeclaration = t.functionDeclaration(
      t.identifier('ComponentView'),
      params,
      functionBody
    );

    return t.exportDefaultDeclaration(functionDeclaration);
  }

  private generateJSXElement(node: VRNNode): t.JSXElement | t.JSXFragment {
    if (node.type === 'empty') {
      return t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), []);
    }

    const tagName = t.jsxIdentifier(node.name);
    const attributes = this.generateJSXAttributes(node.props);
    
    if (node.children.length === 0) {
      // Self-closing element
      return t.jsxElement(
        t.jsxOpeningElement(tagName, attributes, true),
        null,
        [],
        true
      );
    }

    // Element with children
    const children = node.children
      .map(child => this.generateJSXElement(child))
      .filter(Boolean);

    return t.jsxElement(
      t.jsxOpeningElement(tagName, attributes, false),
      t.jsxClosingElement(tagName),
      children,
      false
    );
  }

  private generateJSXAttributes(props: Record<string, any>): t.JSXAttribute[] {
    return Object.entries(props).map(([key, value]) => {
      const name = t.jsxIdentifier(key);
      
      // Handle different value types
      if (typeof value === 'string' && (value.startsWith('state.') || value.startsWith('actions.'))) {
        // Binding expression: {state.something} or {actions.something}
        const expression = this.parseBindingExpression(value);
        return t.jsxAttribute(name, t.jsxExpressionContainer(expression));
      } else if (typeof value === 'string') {
        // String literal: "value"
        return t.jsxAttribute(name, t.stringLiteral(value));
      } else if (typeof value === 'boolean' && value) {
        // Boolean shorthand: just the attribute name for true
        return t.jsxAttribute(name, null);
      } else {
        // Other values: {value}
        const literal = this.createLiteralFromValue(value);
        return t.jsxAttribute(name, t.jsxExpressionContainer(literal));
      }
    });
  }

  private parseBindingExpression(binding: string): t.Expression {
    // Parse expressions like "state.user.name" or "actions.handleClick"
    const parts = binding.split('.');
    
    let expression: t.Expression = t.identifier(parts[0] || 'unknown');
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part) {
        expression = t.memberExpression(expression, t.identifier(part));
      }
    }
    
    return expression;
  }

  private createLiteralFromValue(value: any): t.Expression {
    if (typeof value === 'string') {
      return t.stringLiteral(value);
    } else if (typeof value === 'number') {
      return t.numericLiteral(value);
    } else if (typeof value === 'boolean') {
      return t.booleanLiteral(value);
    } else if (value === null) {
      return t.nullLiteral();
    } else if (Array.isArray(value)) {
      const elements = value.map(item => this.createLiteralFromValue(item));
      return t.arrayExpression(elements);
    } else if (typeof value === 'object') {
      const properties = Object.entries(value).map(([key, val]) =>
        t.objectProperty(t.stringLiteral(key), this.createLiteralFromValue(val))
      );
      return t.objectExpression(properties);
    } else {
      // Fallback to undefined
      return t.identifier('undefined');
    }
  }

  // Generate a single JSX element for testing purposes
  generateSingleElement(node: VRNNode): string {
    const jsxElement = this.generateJSXElement(node);
    return generate(jsxElement).code;
  }

  // Validate the generated AST
  validateAST(program: t.Program): boolean {
    try {
      // Basic validation - check if all nodes have required properties
      const isValid = this.validateNode(program);
      return isValid;
    } catch (error) {
      console.error('AST validation failed:', error);
      return false;
    }
  }

  private validateNode(node: any): boolean {
    if (!node || typeof node !== 'object') {
      return false;
    }

    // Check if the node has a type property
    if (!node.type || typeof node.type !== 'string') {
      return false;
    }

    // Recursively validate child nodes
    for (const key in node) {
      const value = node[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === 'object' && item.type) {
            if (!this.validateNode(item)) {
              return false;
            }
          }
        }
      } else if (value && typeof value === 'object' && value.type) {
        if (!this.validateNode(value)) {
          return false;
        }
      }
    }

    return true;
  }
}