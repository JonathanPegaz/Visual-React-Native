import { z } from 'zod';

// ==================== BASE SCHEMAS ====================

// Basic VRN prop types
export const VRNValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined(),
]);

// Theme color references
export const ThemeColorSchema = z.enum([
  'primary', 'primaryDark', 'secondary',
  'success', 'warning', 'danger', 'info',
  'text', 'textLight', 'surface', 'background', 'border'
]);

// Spacing scale (0-16)
export const SpacingScaleSchema = z.union([
  z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4),
  z.literal(5), z.literal(6), z.literal(8), z.literal(10), z.literal(12), z.literal(16)
]);

// Text variants
export const TextVariantSchema = z.enum(['h1', 'h2', 'h3', 'body', 'caption', 'label']);

// Button variants
export const ButtonVariantSchema = z.enum(['primary', 'secondary', 'ghost', 'danger']);

// Button sizes
export const ButtonSizeSchema = z.enum(['sm', 'md', 'lg']);

// ==================== COMPONENT PROPS SCHEMAS ====================

// Screen component props
export const ScreenPropsSchema = z.object({
  safe: z.boolean().optional(),
  scroll: z.boolean().optional(),
  bg: ThemeColorSchema.optional(),
  p: SpacingScaleSchema.optional(),
}).strict();

// Stack component props
export const StackPropsSchema = z.object({
  spacing: SpacingScaleSchema.optional(),
  align: z.enum(['stretch', 'flex-start', 'flex-end', 'center', 'baseline']).optional(),
  justify: z.enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']).optional(),
  p: SpacingScaleSchema.optional(),
  dividers: z.boolean().optional(),
}).strict();

// HStack component props
export const HStackPropsSchema = z.object({
  spacing: SpacingScaleSchema.optional(),
  align: z.enum(['stretch', 'flex-start', 'flex-end', 'center', 'baseline']).optional(),
  justify: z.enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']).optional(),
  wrap: z.boolean().optional(),
}).strict();

// Grid component props
export const GridPropsSchema = z.object({
  cols: z.number().min(1).max(12),
  gap: SpacingScaleSchema.optional(),
  colsMd: z.number().min(1).max(12).optional(),
  colsLg: z.number().min(1).max(12).optional(),
}).strict();

// Text component props
export const TextPropsSchema = z.object({
  variant: TextVariantSchema.optional(),
  color: ThemeColorSchema.optional(),
  align: z.enum(['left', 'center', 'right', 'justify']).optional(),
  weight: z.enum(['normal', 'medium', 'semibold', 'bold']).optional(),
  numberOfLines: z.number().min(0).optional(),
}).strict();

// Button component props
export const ButtonPropsSchema = z.object({
  variant: ButtonVariantSchema.optional(),
  size: ButtonSizeSchema.optional(),
  fullWidth: z.boolean().optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
}).strict();

// Input component props
export const InputPropsSchema = z.object({
  placeholder: z.string().optional(),
  type: z.enum(['text', 'email', 'password', 'number', 'phone']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  variant: z.enum(['outline', 'filled', 'underline']).optional(),
  error: z.boolean().optional(),
  disabled: z.boolean().optional(),
}).strict();

// Image component props
export const ImagePropsSchema = z.object({
  source: z.string(),
  ratio: z.string().regex(/^\d+:\d+$/).optional(), // e.g., "16:9"
  fit: z.enum(['cover', 'contain', 'stretch', 'repeat', 'center']).optional(),
  rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
  loading: z.enum(['lazy', 'eager']).optional(),
}).strict();

// Avatar component props
export const AvatarPropsSchema = z.object({
  source: z.string().optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  fallback: z.string().max(2).optional(), // Initials
  shape: z.enum(['circle', 'square']).optional(),
}).strict();

// Card component props
export const CardPropsSchema = z.object({
  p: SpacingScaleSchema.optional(),
  shadow: z.enum(['none', 'sm', 'md', 'lg']).optional(),
  rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  border: z.boolean().optional(),
}).strict();

// Divider component props
export const DividerPropsSchema = z.object({
  orientation: z.enum(['horizontal', 'vertical']).optional(),
  thickness: z.number().min(1).max(10).optional(),
  color: ThemeColorSchema.optional(),
  spacing: SpacingScaleSchema.optional(),
}).strict();

// ==================== VRN COMPONENT SCHEMA ====================

// Define the recursive type first
type VRNComponentType = {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: VRNComponentType[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
};

// Base component schema
const BaseVRNComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.unknown()).optional(),
  children: z.array(z.lazy(() => VRNComponentSchema)).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  size: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
});

// Component-specific schemas using refinement
export const VRNComponentSchema: z.ZodType<VRNComponentType> = BaseVRNComponentSchema.refine(
  (data) => {
    // Validate component type
    const validTypes = ['Screen', 'Stack', 'HStack', 'Grid', 'Text', 'Button', 'Input', 'Image', 'Avatar', 'Card', 'Divider'];
    return validTypes.includes(data.type);
  },
  { message: "Invalid component type" }
);

// ==================== BINDINGS SCHEMA ====================

// State binding schema
export const StateBindingSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  value: z.unknown().optional(),
}).strict();

// Action binding schema
export const ActionBindingSchema = z.object({
  name: z.string(),
  type: z.literal('function'),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
  })).optional(),
}).strict();

// Logic file bindings
export const LogicBindingsSchema = z.object({
  state: z.record(z.string(), StateBindingSchema),
  actions: z.record(z.string(), ActionBindingSchema),
}).strict();

// ==================== FILE SCHEMAS ====================

// VRN file structure
export const VRNFileSchema = z.object({
  tree: VRNComponentSchema.nullable(),
  bindings: LogicBindingsSchema.optional(),
  raw: z.string(),
  imports: z.array(z.string()).optional(),
  exports: z.array(z.string()).optional(),
}).strict();

// Component metadata
export const ComponentMetadataSchema = z.object({
  name: z.string(),
  category: z.enum(['Layout', 'Typography', 'Inputs', 'Media', 'Containers']),
  icon: z.string().optional(),
  description: z.string().optional(),
  props: z.record(z.string(), z.object({
    type: z.string(),
    default: z.unknown().optional(),
    required: z.boolean().optional(),
    description: z.string().optional(),
    options: z.array(z.unknown()).optional(),
  })).optional(),
  bindable: z.array(z.string()).optional(),
  acceptsChildren: z.boolean().optional(),
  maxChildren: z.number().optional(),
}).strict();

// ==================== TYPE EXPORTS ====================

export type VRNComponent = VRNComponentType;
export type VRNFile = z.infer<typeof VRNFileSchema>;
export type LogicBindings = z.infer<typeof LogicBindingsSchema>;
export type StateBinding = z.infer<typeof StateBindingSchema>;
export type ActionBinding = z.infer<typeof ActionBindingSchema>;
export type ComponentMetadata = z.infer<typeof ComponentMetadataSchema>;

// Component-specific prop types
export type ScreenProps = z.infer<typeof ScreenPropsSchema>;
export type StackProps = z.infer<typeof StackPropsSchema>;
export type HStackProps = z.infer<typeof HStackPropsSchema>;
export type GridProps = z.infer<typeof GridPropsSchema>;
export type TextProps = z.infer<typeof TextPropsSchema>;
export type ButtonProps = z.infer<typeof ButtonPropsSchema>;
export type InputProps = z.infer<typeof InputPropsSchema>;
export type ImageProps = z.infer<typeof ImagePropsSchema>;
export type AvatarProps = z.infer<typeof AvatarPropsSchema>;
export type CardProps = z.infer<typeof CardPropsSchema>;
export type DividerProps = z.infer<typeof DividerPropsSchema>;

// ==================== VALIDATION HELPERS ====================

/**
 * Validate a VRN component with detailed error messages
 */
export function validateVRNComponent(component: unknown): { success: true; data: VRNComponent } | { success: false; errors: string[] } {
  try {
    const data = VRNComponentSchema.parse(component);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate VRN file structure
 */
export function validateVRNFile(file: unknown): { success: true; data: VRNFile } | { success: false; errors: string[] } {
  try {
    const data = VRNFileSchema.parse(file);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate component props based on component type
 */
export function validateComponentProps(componentType: string, props: unknown): { success: true; data: any } | { success: false; errors: string[] } {
  const schemas: Record<string, z.ZodSchema> = {
    Screen: ScreenPropsSchema,
    Stack: StackPropsSchema,
    HStack: HStackPropsSchema,
    Grid: GridPropsSchema,
    Text: TextPropsSchema,
    Button: ButtonPropsSchema,
    Input: InputPropsSchema,
    Image: ImagePropsSchema,
    Avatar: AvatarPropsSchema,
    Card: CardPropsSchema,
    Divider: DividerPropsSchema,
  };

  const schema = schemas[componentType];
  if (!schema) {
    return { success: false, errors: [`Unknown component type: ${componentType}`] };
  }

  try {
    const data = schema.parse(props);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Get available props for a component type
 */
export function getComponentPropsSchema(componentType: string): z.ZodSchema | null {
  const schemas: Record<string, z.ZodSchema> = {
    Screen: ScreenPropsSchema,
    Stack: StackPropsSchema,
    HStack: HStackPropsSchema,
    Grid: GridPropsSchema,
    Text: TextPropsSchema,
    Button: ButtonPropsSchema,
    Input: InputPropsSchema,
    Image: ImagePropsSchema,
    Avatar: AvatarPropsSchema,
    Card: CardPropsSchema,
    Divider: DividerPropsSchema,
  };

  return schemas[componentType] || null;
}

/**
 * Check if a component type accepts children
 */
export function componentAcceptsChildren(componentType: string): boolean {
  const noChildrenTypes = ['Text', 'Button', 'Input', 'Image', 'Avatar', 'Divider'];
  return !noChildrenTypes.includes(componentType);
}