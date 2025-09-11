import {
  VRN_COMPONENT_DEFINITIONS,
  getComponentDefinition,
  getComponentsByCategory,
  getAllCategories,
  getComponentProps,
  getBindableProps,
  validateComponentProp,
} from '../ComponentDefinitions';

describe('ComponentDefinitions', () => {
  describe('VRN_COMPONENT_DEFINITIONS', () => {
    it('should contain all expected component definitions', () => {
      expect(VRN_COMPONENT_DEFINITIONS).toHaveLength(11);
      
      const componentNames = VRN_COMPONENT_DEFINITIONS.map(def => def.name);
      expect(componentNames).toEqual([
        'Screen', 'Stack', 'HStack', 'Grid',
        'Text', 'Button', 'Input', 'Image', 'Avatar',
        'Card', 'Divider'
      ]);
    });

    it('should have valid category assignments', () => {
      const validCategories = ['Layout', 'Typography', 'Inputs', 'Media', 'Containers'];
      
      VRN_COMPONENT_DEFINITIONS.forEach(def => {
        expect(validCategories).toContain(def.category);
      });
    });

    it('should have icons for all components', () => {
      VRN_COMPONENT_DEFINITIONS.forEach(def => {
        expect(def.icon).toBeDefined();
        expect(typeof def.icon).toBe('string');
        expect(def.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have props definitions for all components', () => {
      VRN_COMPONENT_DEFINITIONS.forEach(def => {
        expect(def.props).toBeDefined();
        expect(typeof def.props).toBe('object');
      });
    });
  });

  describe('getComponentDefinition', () => {
    it('should return definition for existing component', () => {
      const textDef = getComponentDefinition('Text');
      expect(textDef).toBeDefined();
      expect(textDef?.name).toBe('Text');
      expect(textDef?.category).toBe('Typography');
    });

    it('should return undefined for non-existing component', () => {
      const nonExistent = getComponentDefinition('NonExistentComponent');
      expect(nonExistent).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const lowercase = getComponentDefinition('text');
      expect(lowercase).toBeUndefined();
    });
  });

  describe('getComponentsByCategory', () => {
    it('should return layout components', () => {
      const layoutComponents = getComponentsByCategory('Layout');
      expect(layoutComponents).toHaveLength(4);
      
      const names = layoutComponents.map(comp => comp.name);
      expect(names).toEqual(['Screen', 'Stack', 'HStack', 'Grid']);
    });

    it('should return typography components', () => {
      const typographyComponents = getComponentsByCategory('Typography');
      expect(typographyComponents).toHaveLength(1);
      expect(typographyComponents[0].name).toBe('Text');
    });

    it('should return input components', () => {
      const inputComponents = getComponentsByCategory('Inputs');
      expect(inputComponents).toHaveLength(2);
      
      const names = inputComponents.map(comp => comp.name);
      expect(names).toEqual(['Button', 'Input']);
    });

    it('should return empty array for non-existing category', () => {
      const nonExistent = getComponentsByCategory('NonExistent' as any);
      expect(nonExistent).toEqual([]);
    });
  });

  describe('getAllCategories', () => {
    it('should return all unique categories', () => {
      const categories = getAllCategories();
      expect(categories).toHaveLength(5);
      expect(categories).toEqual(
        expect.arrayContaining(['Layout', 'Typography', 'Inputs', 'Media', 'Containers'])
      );
    });

    it('should not contain duplicates', () => {
      const categories = getAllCategories();
      const uniqueCategories = [...new Set(categories)];
      expect(categories).toEqual(uniqueCategories);
    });
  });

  describe('getComponentProps', () => {
    it('should return props for Text component', () => {
      const textProps = getComponentProps('Text');
      expect(textProps).toBeDefined();
      expect(textProps).toHaveProperty('children');
      expect(textProps).toHaveProperty('variant');
      expect(textProps).toHaveProperty('color');
    });

    it('should return props for Button component', () => {
      const buttonProps = getComponentProps('Button');
      expect(buttonProps).toBeDefined();
      expect(buttonProps).toHaveProperty('children');
      expect(buttonProps).toHaveProperty('variant');
      expect(buttonProps).toHaveProperty('size');
    });

    it('should return undefined for non-existing component', () => {
      const nonExistent = getComponentProps('NonExistent');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('getBindableProps', () => {
    it('should return bindable props for Text component', () => {
      const bindableProps = getBindableProps('Text');
      expect(bindableProps).toEqual(['children', 'color', 'variant']);
    });

    it('should return bindable props for Button component', () => {
      const bindableProps = getBindableProps('Button');
      expect(bindableProps).toEqual(['children', 'disabled', 'loading']);
    });

    it('should return empty array for component without bindable props', () => {
      const bindableProps = getBindableProps('NonExistent');
      expect(bindableProps).toEqual([]);
    });
  });

  describe('validateComponentProp', () => {
    it('should validate correct Text variant', () => {
      const isValid = validateComponentProp('Text', 'variant', 'h1');
      expect(isValid).toBe(true);
    });

    it('should reject invalid Text variant', () => {
      const isValid = validateComponentProp('Text', 'variant', 'invalid');
      expect(isValid).toBe(false);
    });

    it('should validate correct Button size', () => {
      const isValid = validateComponentProp('Button', 'size', 'md');
      expect(isValid).toBe(true);
    });

    it('should reject invalid Button size', () => {
      const isValid = validateComponentProp('Button', 'size', 'invalid');
      expect(isValid).toBe(false);
    });

    it('should validate string props', () => {
      const isValid = validateComponentProp('Text', 'children', 'Hello World');
      expect(isValid).toBe(true);
    });

    it('should reject wrong type for string prop', () => {
      const isValid = validateComponentProp('Text', 'children', 123);
      expect(isValid).toBe(false);
    });

    it('should validate boolean props', () => {
      const isValid = validateComponentProp('Button', 'disabled', true);
      expect(isValid).toBe(true);
    });

    it('should reject wrong type for boolean prop', () => {
      const isValid = validateComponentProp('Button', 'disabled', 'true');
      expect(isValid).toBe(false);
    });

    it('should validate number props', () => {
      const isValid = validateComponentProp('Stack', 'spacing', 4);
      expect(isValid).toBe(true);
    });

    it('should reject wrong type for number prop', () => {
      const isValid = validateComponentProp('Stack', 'spacing', '4');
      expect(isValid).toBe(false);
    });

    it('should return false for non-existing component', () => {
      const isValid = validateComponentProp('NonExistent', 'prop', 'value');
      expect(isValid).toBe(false);
    });

    it('should return false for non-existing prop', () => {
      const isValid = validateComponentProp('Text', 'nonExistentProp', 'value');
      expect(isValid).toBe(false);
    });
  });

  describe('Component Definitions Structure', () => {
    it('should have consistent prop definition structure', () => {
      VRN_COMPONENT_DEFINITIONS.forEach(componentDef => {
        Object.values(componentDef.props).forEach(propDef => {
          expect(propDef).toHaveProperty('type');
          expect(['string', 'number', 'boolean']).toContain(propDef.type);
          
          if (propDef.required !== undefined) {
            expect(typeof propDef.required).toBe('boolean');
          }
          
          if (propDef.options !== undefined) {
            expect(Array.isArray(propDef.options)).toBe(true);
          }
        });
      });
    });

    it('should have bindable arrays containing only existing props', () => {
      VRN_COMPONENT_DEFINITIONS.forEach(componentDef => {
        if (componentDef.bindable) {
          componentDef.bindable.forEach(bindableProp => {
            expect(componentDef.props).toHaveProperty(bindableProp);
          });
        }
      });
    });

    it('should have required props properly defined', () => {
      const textDef = getComponentDefinition('Text');
      expect(textDef?.props.children?.required).toBe(true);
      
      const gridDef = getComponentDefinition('Grid');
      expect(gridDef?.props.cols?.required).toBe(true);
      
      const imageDef = getComponentDefinition('Image');
      expect(imageDef?.props.source?.required).toBe(true);
    });
  });
});