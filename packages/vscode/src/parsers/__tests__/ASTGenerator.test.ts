import { ASTGenerator } from '../ASTGenerator';
import { VRNNode, VRNBindings } from '../VRNParser';

describe('ASTGenerator', () => {
  let generator: ASTGenerator;

  beforeEach(() => {
    generator = new ASTGenerator();
  });

  describe('generateSingleElement', () => {
    it('should generate JSX for a simple Text component', () => {
      const textNode: VRNNode = {
        id: 'text-1',
        type: 'text',
        name: 'Text',
        props: {
          children: 'Hello World',
          variant: 'h1',
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 },
      };

      const result = generator.generateSingleElement(textNode);
      expect(result).toContain('<Text');
      expect(result).toContain('children="Hello World"');
      expect(result).toContain('variant="h1"');
    });

    it('should generate self-closing JSX for components without children', () => {
      const buttonNode: VRNNode = {
        id: 'button-1',
        type: 'button',
        name: 'Button',
        props: {
          children: 'Click me',
          variant: 'primary',
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
      };

      const result = generator.generateSingleElement(buttonNode);
      expect(result).toContain('<Button');
      expect(result).toContain('/>');
      expect(result).not.toContain('</Button>');
    });

    it('should generate JSX with children for container components', () => {
      const stackNode: VRNNode = {
        id: 'stack-1',
        type: 'stack',
        name: 'Stack',
        props: {
          spacing: 4,
        },
        children: [
          {
            id: 'text-1',
            type: 'text',
            name: 'Text',
            props: { children: 'Child 1' },
            children: [],
            position: { x: 0, y: 0 },
            size: { width: 100, height: 20 },
          },
          {
            id: 'text-2',
            type: 'text',
            name: 'Text',
            props: { children: 'Child 2' },
            children: [],
            position: { x: 0, y: 0 },
            size: { width: 100, height: 20 },
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: 200, height: 100 },
      };

      const result = generator.generateSingleElement(stackNode);
      expect(result).toContain('<Stack');
      expect(result).toContain('</Stack>');
      expect(result).toContain('spacing={4}');
    });

    it('should handle boolean props correctly', () => {
      const buttonNode: VRNNode = {
        id: 'button-1',
        type: 'button',
        name: 'Button',
        props: {
          children: 'Click me',
          disabled: true,
          fullWidth: false,
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 40 },
      };

      const result = generator.generateSingleElement(buttonNode);
      expect(result).toContain('disabled');
      expect(result).not.toContain('disabled=');
      expect(result).toContain('fullWidth={false}');
    });

    it('should handle binding expressions', () => {
      const textNode: VRNNode = {
        id: 'text-1',
        type: 'text',
        name: 'Text',
        props: {
          children: 'state.message',
          color: 'state.theme.primary',
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 },
      };

      const result = generator.generateSingleElement(textNode);
      expect(result).toContain('children={state.message}');
      expect(result).toContain('color={state.theme.primary}');
    });
  });

  describe('generateProgram', () => {
    it('should generate a complete React component', () => {
      const tree: VRNNode = {
        id: 'screen-1',
        type: 'screen',
        name: 'Screen',
        props: {
          safe: true,
        },
        children: [
          {
            id: 'text-1',
            type: 'text',
            name: 'Text',
            props: {
              children: 'Hello World',
            },
            children: [],
            position: { x: 0, y: 0 },
            size: { width: 100, height: 20 },
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: 375, height: 812 },
      };

      const bindings: VRNBindings = {
        state: {
          message: {
            name: 'message',
            type: 'string',
            value: 'Hello',
          },
        },
        actions: {
          handleClick: {
            name: 'handleClick',
            type: 'function',
            parameters: [],
          },
        },
      };

      const result = generator.generateProgram(tree, bindings);
      
      // Check for imports
      expect(result).toContain("import React from 'react'");
      expect(result).toContain("import { Screen, Stack, HStack, Grid, Text, Button, Input, Card, Avatar, Image, Divider } from '@visual-rn/core'");
      
      // Check for function declaration
      expect(result).toContain('function ComponentView');
      expect(result).toContain('export default ComponentView');
      
      // Check for JSX
      expect(result).toContain('<Screen');
      expect(result).toContain('<Text');
      
      // Check for bindings comment
      expect(result).toContain('@vrn-bindings');
      expect(result).toContain('message: string');
      expect(result).toContain('handleClick: function');
    });

    it('should handle empty tree', () => {
      const emptyTree: VRNNode = {
        id: 'empty-1',
        type: 'empty',
        name: '',
        props: {},
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
      };

      const bindings: VRNBindings = {
        state: {},
        actions: {},
      };

      const result = generator.generateProgram(emptyTree, bindings);
      expect(result).toContain('import React');
      expect(result).toContain('function ComponentView');
      expect(result).toContain('export default ComponentView');
    });
  });

  describe('validateAST', () => {
    it('should validate a proper AST structure', () => {
      const tree: VRNNode = {
        id: 'text-1',
        type: 'text',
        name: 'Text',
        props: {
          children: 'Hello',
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 },
      };

      const bindings: VRNBindings = {
        state: {},
        actions: {},
      };

      const code = generator.generateProgram(tree, bindings);
      
      // Parse the generated code back to AST to validate structure
      const parser = require('@babel/parser');
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      const isValid = generator.validateAST(ast);
      expect(isValid).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined values', () => {
      const nodeWithNulls: VRNNode = {
        id: 'test-1',
        type: 'test',
        name: 'Test',
        props: {
          nullValue: null,
          undefinedValue: undefined,
          emptyString: '',
          zero: 0,
          false: false,
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 },
      };

      const result = generator.generateSingleElement(nodeWithNulls);
      expect(result).toContain('nullValue={null}');
      expect(result).toContain('undefinedValue={undefined}');
      expect(result).toContain('emptyString=""');
      expect(result).toContain('zero={0}');
      expect(result).toContain('false={false}');
    });

    it('should handle complex nested objects', () => {
      const nodeWithComplexProps: VRNNode = {
        id: 'test-1',
        type: 'test',
        name: 'Test',
        props: {
          complexObject: {
            nested: {
              value: 'deep',
              array: [1, 2, 3],
            },
          },
          arrayProp: ['a', 'b', 'c'],
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 },
      };

      const result = generator.generateSingleElement(nodeWithComplexProps);
      expect(result).toContain('complexObject={');
      expect(result).toContain('arrayProp={');
    });

    it('should handle invalid binding expressions gracefully', () => {
      const nodeWithInvalidBinding: VRNNode = {
        id: 'test-1',
        type: 'test',
        name: 'Test',
        props: {
          validBinding: 'state.value',
          invalidBinding: 'state.',
          emptyBinding: '',
        },
        children: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 },
      };

      const result = generator.generateSingleElement(nodeWithInvalidBinding);
      expect(result).toContain('validBinding={state.value}');
      expect(result).toContain('invalidBinding={state.unknown}'); // Should handle gracefully
      expect(result).toContain('emptyBinding=""');
    });
  });
});