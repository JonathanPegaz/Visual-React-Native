import type { ComponentDefinition } from '../webview/types';

export const VRN_COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // Layout Components
  {
    name: 'Screen',
    category: 'Layout',
    icon: '🖥️',
    props: {
      safe: {
        type: 'boolean',
        default: false,
        required: false,
      },
      scroll: {
        type: 'boolean',
        default: false,
        required: false,
      },
      bg: {
        type: 'string',
        default: 'transparent',
        required: false,
        options: ['primary', 'primaryDark', 'secondary', 'success', 'warning', 'danger', 'info', 'text', 'textLight', 'surface', 'background', 'border'],
      },
      p: {
        type: 'number',
        default: 0,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
    },
    bindable: ['bg'],
  },
  {
    name: 'Stack',
    category: 'Layout',
    icon: '📚',
    props: {
      spacing: {
        type: 'number',
        default: 0,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
      align: {
        type: 'string',
        default: 'stretch',
        required: false,
        options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
      },
      justify: {
        type: 'string',
        default: 'flex-start',
        required: false,
        options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      },
      p: {
        type: 'number',
        default: 0,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
      dividers: {
        type: 'boolean',
        default: false,
        required: false,
      },
    },
    bindable: ['spacing', 'align', 'justify'],
  },
  {
    name: 'HStack',
    category: 'Layout',
    icon: '↔️',
    props: {
      spacing: {
        type: 'number',
        default: 0,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
      align: {
        type: 'string',
        default: 'center',
        required: false,
        options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
      },
      justify: {
        type: 'string',
        default: 'flex-start',
        required: false,
        options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      },
      wrap: {
        type: 'boolean',
        default: false,
        required: false,
      },
    },
    bindable: ['spacing', 'align', 'justify'],
  },
  {
    name: 'Grid',
    category: 'Layout',
    icon: '⚏',
    props: {
      cols: {
        type: 'number',
        default: 2,
        required: true,
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      gap: {
        type: 'number',
        default: 4,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
      colsMd: {
        type: 'number',
        required: false,
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      colsLg: {
        type: 'number',
        required: false,
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    },
    bindable: ['cols', 'gap'],
  },

  // Typography Components
  {
    name: 'Text',
    category: 'Typography',
    icon: '📝',
    props: {
      children: {
        type: 'string',
        default: 'Text Content',
        required: true,
      },
      variant: {
        type: 'string',
        default: 'body',
        required: false,
        options: ['h1', 'h2', 'h3', 'body', 'caption', 'label'],
      },
      color: {
        type: 'string',
        default: 'text',
        required: false,
        options: ['primary', 'primaryDark', 'secondary', 'success', 'warning', 'danger', 'info', 'text', 'textLight', 'surface', 'background', 'border'],
      },
      align: {
        type: 'string',
        default: 'left',
        required: false,
        options: ['left', 'center', 'right', 'justify'],
      },
      weight: {
        type: 'string',
        default: 'normal',
        required: false,
        options: ['normal', 'medium', 'semibold', 'bold'],
      },
      numberOfLines: {
        type: 'number',
        required: false,
      },
    },
    bindable: ['children', 'color', 'variant'],
  },

  // Input Components
  {
    name: 'Button',
    category: 'Inputs',
    icon: '🔘',
    props: {
      children: {
        type: 'string',
        default: 'Button',
        required: true,
      },
      variant: {
        type: 'string',
        default: 'primary',
        required: false,
        options: ['primary', 'secondary', 'ghost', 'danger'],
      },
      size: {
        type: 'string',
        default: 'md',
        required: false,
        options: ['sm', 'md', 'lg'],
      },
      fullWidth: {
        type: 'boolean',
        default: false,
        required: false,
      },
      disabled: {
        type: 'boolean',
        default: false,
        required: false,
      },
      loading: {
        type: 'boolean',
        default: false,
        required: false,
      },
    },
    bindable: ['children', 'disabled', 'loading'],
  },
  {
    name: 'Input',
    category: 'Inputs',
    icon: '📝',
    props: {
      placeholder: {
        type: 'string',
        default: 'Enter text...',
        required: false,
      },
      type: {
        type: 'string',
        default: 'text',
        required: false,
        options: ['text', 'email', 'password', 'number', 'phone'],
      },
      size: {
        type: 'string',
        default: 'md',
        required: false,
        options: ['sm', 'md', 'lg'],
      },
      variant: {
        type: 'string',
        default: 'outline',
        required: false,
        options: ['outline', 'filled', 'underline'],
      },
      error: {
        type: 'boolean',
        default: false,
        required: false,
      },
      disabled: {
        type: 'boolean',
        default: false,
        required: false,
      },
    },
    bindable: ['placeholder', 'disabled', 'error'],
  },

  // Media Components
  {
    name: 'Image',
    category: 'Media',
    icon: '🖼️',
    props: {
      source: {
        type: 'string',
        default: 'https://via.placeholder.com/150',
        required: true,
      },
      alt: {
        type: 'string',
        default: 'Image',
        required: false,
      },
      ratio: {
        type: 'string',
        required: false,
      },
      fit: {
        type: 'string',
        default: 'cover',
        required: false,
        options: ['cover', 'contain', 'stretch', 'repeat', 'center'],
      },
      rounded: {
        type: 'string',
        default: 'none',
        required: false,
        options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      },
      loading: {
        type: 'string',
        default: 'lazy',
        required: false,
        options: ['lazy', 'eager'],
      },
    },
    bindable: ['source', 'alt'],
  },
  {
    name: 'Avatar',
    category: 'Media',
    icon: '👤',
    props: {
      source: {
        type: 'string',
        required: false,
      },
      size: {
        type: 'string',
        default: 'md',
        required: false,
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      fallback: {
        type: 'string',
        default: 'U',
        required: false,
      },
      shape: {
        type: 'string',
        default: 'circle',
        required: false,
        options: ['circle', 'square'],
      },
    },
    bindable: ['source', 'fallback'],
  },

  // Container Components
  {
    name: 'Card',
    category: 'Containers',
    icon: '🃏',
    props: {
      p: {
        type: 'number',
        default: 4,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
      shadow: {
        type: 'string',
        default: 'md',
        required: false,
        options: ['none', 'sm', 'md', 'lg'],
      },
      rounded: {
        type: 'string',
        default: 'md',
        required: false,
        options: ['none', 'sm', 'md', 'lg', 'xl'],
      },
      border: {
        type: 'boolean',
        default: false,
        required: false,
      },
    },
    bindable: ['p', 'shadow'],
  },
  {
    name: 'Divider',
    category: 'Containers',
    icon: '➖',
    props: {
      orientation: {
        type: 'string',
        default: 'horizontal',
        required: false,
        options: ['horizontal', 'vertical'],
      },
      thickness: {
        type: 'number',
        default: 1,
        required: false,
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      color: {
        type: 'string',
        default: 'border',
        required: false,
        options: ['primary', 'primaryDark', 'secondary', 'success', 'warning', 'danger', 'info', 'text', 'textLight', 'surface', 'background', 'border'],
      },
      spacing: {
        type: 'number',
        default: 2,
        required: false,
        options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
      },
    },
    bindable: ['color', 'spacing'],
  },
];

export function getComponentDefinition(componentName: string): ComponentDefinition | undefined {
  return VRN_COMPONENT_DEFINITIONS.find(def => def.name === componentName);
}

export function getComponentsByCategory(category: ComponentDefinition['category']): ComponentDefinition[] {
  return VRN_COMPONENT_DEFINITIONS.filter(def => def.category === category);
}

export function getAllCategories(): ComponentDefinition['category'][] {
  const categories = new Set(VRN_COMPONENT_DEFINITIONS.map(def => def.category));
  return Array.from(categories);
}

export function getComponentProps(componentName: string): ComponentDefinition['props'] | undefined {
  const definition = getComponentDefinition(componentName);
  return definition?.props;
}

export function getBindableProps(componentName: string): string[] {
  const definition = getComponentDefinition(componentName);
  return definition?.bindable || [];
}

export function validateComponentProp(componentName: string, propName: string, value: unknown): boolean {
  const props = getComponentProps(componentName);
  if (!props || !props[propName]) {
    return false;
  }

  const propDef = props[propName];
  
  // Type validation
  switch (propDef.type) {
    case 'string':
      if (typeof value !== 'string') return false;
      break;
    case 'number':
      if (typeof value !== 'number') return false;
      break;
    case 'boolean':
      if (typeof value !== 'boolean') return false;
      break;
    default:
      return false;
  }

  // Options validation
  if (propDef.options && !propDef.options.includes(value)) {
    return false;
  }

  return true;
}