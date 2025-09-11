import {
  validateVRNComponent,
  validateVRNFile,
  validateComponentProps,
  VRNComponentSchema,
  TextPropsSchema,
  ButtonPropsSchema,
  ScreenPropsSchema,
} from '../VRNSchemas';

describe('VRNSchemas', () => {
  describe('validateVRNComponent', () => {
    it('should validate a valid Screen component', () => {
      const validComponent = {
        id: 'screen-1',
        type: 'Screen',
        props: {
          safe: true,
          bg: 'primary',
        },
        children: [],
      };

      const result = validateVRNComponent(validComponent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('Screen');
        expect(result.data.id).toBe('screen-1');
      }
    });

    it('should validate a valid Text component', () => {
      const validComponent = {
        id: 'text-1',
        type: 'Text',
        props: {
          variant: 'h1',
          color: 'primary',
          children: 'Hello World',
        },
      };

      const result = validateVRNComponent(validComponent);
      expect(result.success).toBe(true);
    });

    it('should reject invalid component type', () => {
      const invalidComponent = {
        id: 'invalid-1',
        type: 'InvalidComponent',
        props: {},
      };

      const result = validateVRNComponent(invalidComponent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should reject component without id', () => {
      const invalidComponent = {
        type: 'Screen',
        props: {},
      };

      const result = validateVRNComponent(invalidComponent);
      expect(result.success).toBe(false);
    });

    it('should validate nested components', () => {
      const nestedComponent = {
        id: 'stack-1',
        type: 'Stack',
        props: {
          spacing: 4,
        },
        children: [
          {
            id: 'text-1',
            type: 'Text',
            props: {
              children: 'Hello',
            },
          },
          {
            id: 'button-1',
            type: 'Button',
            props: {
              children: 'Click me',
              variant: 'primary',
            },
          },
        ],
      };

      const result = validateVRNComponent(nestedComponent);
      expect(result.success).toBe(true);
    });
  });

  describe('validateComponentProps', () => {
    it('should validate Text component props', () => {
      const validProps = {
        variant: 'h1',
        color: 'primary',
        align: 'center',
        children: 'Hello World',
      };

      const result = validateComponentProps('Text', validProps);
      expect(result.success).toBe(true);
    });

    it('should reject invalid Text variant', () => {
      const invalidProps = {
        variant: 'invalid-variant',
        children: 'Hello',
      };

      const result = validateComponentProps('Text', invalidProps);
      expect(result.success).toBe(false);
    });

    it('should validate Button component props', () => {
      const validProps = {
        variant: 'primary',
        size: 'md',
        fullWidth: true,
        children: 'Click me',
      };

      const result = validateComponentProps('Button', validProps);
      expect(result.success).toBe(true);
    });

    it('should reject invalid Button size', () => {
      const invalidProps = {
        size: 'invalid-size',
        children: 'Click me',
      };

      const result = validateComponentProps('Button', invalidProps);
      expect(result.success).toBe(false);
    });

    it('should validate Screen component props', () => {
      const validProps = {
        safe: true,
        scroll: false,
        bg: 'primary',
        p: 4,
      };

      const result = validateComponentProps('Screen', validProps);
      expect(result.success).toBe(true);
    });

    it('should reject unknown component type', () => {
      const result = validateComponentProps('UnknownComponent', {});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain('Unknown component type');
      }
    });
  });

  describe('Individual Schema Validation', () => {
    describe('TextPropsSchema', () => {
      it('should accept valid text props', () => {
        const validProps = {
          variant: 'h1',
          color: 'primary',
          align: 'center',
          weight: 'bold',
          numberOfLines: 2,
        };

        const result = TextPropsSchema.safeParse(validProps);
        expect(result.success).toBe(true);
      });

      it('should reject invalid variant', () => {
        const invalidProps = {
          variant: 'invalid',
        };

        const result = TextPropsSchema.safeParse(invalidProps);
        expect(result.success).toBe(false);
      });
    });

    describe('ButtonPropsSchema', () => {
      it('should accept valid button props', () => {
        const validProps = {
          variant: 'primary',
          size: 'lg',
          fullWidth: true,
          disabled: false,
          loading: true,
        };

        const result = ButtonPropsSchema.safeParse(validProps);
        expect(result.success).toBe(true);
      });

      it('should reject extra properties', () => {
        const invalidProps = {
          variant: 'primary',
          extraProp: 'not allowed',
        };

        const result = ButtonPropsSchema.safeParse(invalidProps);
        expect(result.success).toBe(false);
      });
    });

    describe('ScreenPropsSchema', () => {
      it('should accept valid screen props', () => {
        const validProps = {
          safe: true,
          scroll: true,
          bg: 'background',
          p: 8,
        };

        const result = ScreenPropsSchema.safeParse(validProps);
        expect(result.success).toBe(true);
      });

      it('should reject invalid spacing value', () => {
        const invalidProps = {
          p: 15, // Not in allowed spacing scale
        };

        const result = ScreenPropsSchema.safeParse(invalidProps);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('validateVRNFile', () => {
    it('should validate a complete VRN file', () => {
      const validFile = {
        tree: {
          id: 'root-1',
          type: 'Screen',
          props: {
            safe: true,
          },
          children: [
            {
              id: 'text-1',
              type: 'Text',
              props: {
                children: 'Hello World',
              },
            },
          ],
        },
        bindings: {
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
        },
        raw: 'export default function ComponentView() { return null; }',
      };

      const result = validateVRNFile(validFile);
      expect(result.success).toBe(true);
    });

    it('should accept null tree', () => {
      const fileWithNullTree = {
        tree: null,
        bindings: {
          state: {},
          actions: {},
        },
        raw: '',
      };

      const result = validateVRNFile(fileWithNullTree);
      expect(result.success).toBe(true);
    });
  });
});