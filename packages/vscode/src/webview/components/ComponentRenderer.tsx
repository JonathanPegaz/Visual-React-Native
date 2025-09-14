import React from 'react';
import { useEditorStore, type VRNComponent } from '../store';

interface ComponentRendererProps {
  component: VRNComponent;
  isSelected: boolean;
  onSelect: () => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  onSelect,
}) => {
  const { selectedComponentId, selectComponent, addComponent } = useEditorStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleChildSelect = (childId: string) => {
    selectComponent(childId);
  };

  // Safe props accessor with proper types
  const componentProps = component.props || {};
  
  // Helper functions for type-safe prop access
  const getProp = function<T>(key: string, defaultValue: T): T {
    const value = componentProps[key];
    return value !== undefined ? (value as T) : defaultValue;
  };

  const getStringProp = (key: string, defaultValue: string = ''): string => 
    getProp(key, defaultValue);
  
  const getNumberProp = (key: string, defaultValue: number = 0): number => 
    getProp(key, defaultValue);
  
  const getBooleanProp = (key: string, defaultValue: boolean = false): boolean => 
    getProp(key, defaultValue);

  const renderComponent = () => {
    switch (component.type) {
      case 'Screen':
        return (
          <div 
            className={`vrn-screen ${getBooleanProp('safe') ? 'safe-area' : ''}`}
            style={{
              backgroundColor: getStringProp('bg', 'transparent'),
              padding: getNumberProp('p') ? `${getNumberProp('p') * 4}px` : '0',
            }}
          >
            {component.children?.map((child: VRNComponent) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        );

      case 'Stack':
        return (
          <div 
            className="vrn-stack"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: getNumberProp('spacing') ? `${getNumberProp('spacing') * 4}px` : '0',
              alignItems: getStringProp('align', 'stretch'),
              justifyContent: getStringProp('justify', 'flex-start'),
              padding: getNumberProp('p') ? `${getNumberProp('p') * 4}px` : '0',
            }}
          >
            {component.children?.map((child: VRNComponent) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        );

      case 'HStack':
        return (
          <div 
            className="vrn-hstack"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: getNumberProp('spacing') ? `${getNumberProp('spacing') * 4}px` : '0',
              alignItems: getStringProp('align', 'center'),
              justifyContent: getStringProp('justify', 'flex-start'),
            }}
          >
            {component.children?.map((child: VRNComponent) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        );

      case 'Grid':
        return (
          <div 
            className="vrn-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getNumberProp('cols', 2)}, 1fr)`,
              gap: getNumberProp('gap') ? `${getNumberProp('gap') * 4}px` : '16px',
            }}
          >
            {component.children?.map((child: VRNComponent) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        );

      case 'Text':
        return (
          <span
            style={{
              fontSize: getStringProp('variant') === 'h1' ? '32px' :
                       getStringProp('variant') === 'h2' ? '24px' :
                       getStringProp('variant') === 'h3' ? '20px' :
                       getStringProp('variant') === 'caption' ? '12px' : '16px',
              fontWeight: getStringProp('weight', 'normal'),
              color: getStringProp('color', '#000'),
              textAlign: getStringProp('align', 'left') as any,
            }}
          >
            {getStringProp('children', 'Text Content')}
          </span>
        );

      case 'Button':
        return (
          <button
            className={`vrn-button ${getStringProp('variant', 'primary')} ${getStringProp('size', 'md')}`}
            style={{
              width: getBooleanProp('fullWidth') ? '100%' : 'auto',
              opacity: getBooleanProp('disabled') ? 0.5 : 1,
              cursor: getBooleanProp('disabled') ? 'not-allowed' : 'pointer',
            }}
            disabled={getBooleanProp('disabled')}
          >
            {getStringProp('children', 'Button')}
          </button>
        );

      case 'Input':
        return (
          <input
            className={`vrn-input ${getStringProp('variant', 'outline')} ${getStringProp('size', 'md')}`}
            type={getStringProp('type', 'text') as any}
            placeholder={getStringProp('placeholder', 'Enter text...')}
            disabled={getBooleanProp('disabled')}
            style={{
              borderColor: getBooleanProp('error') ? '#e53e3e' : '#e2e8f0',
            }}
          />
        );

      case 'Image':
        return (
          <img
            src={getStringProp('source', 'https://via.placeholder.com/150')}
            alt={getStringProp('alt', 'Image')}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: getStringProp('fit', 'cover') as any,
              borderRadius: getStringProp('rounded') === 'full' ? '50%' :
                           getStringProp('rounded') === 'lg' ? '12px' :
                           getStringProp('rounded') === 'md' ? '8px' :
                           getStringProp('rounded') === 'sm' ? '4px' : '0',
            }}
          />
        );

      case 'Avatar':
        return (
          <div
            className={`vrn-avatar ${getStringProp('size', 'md')}`}
            style={{
              width: getStringProp('size') === 'xs' ? '24px' :
                     getStringProp('size') === 'sm' ? '32px' :
                     getStringProp('size') === 'lg' ? '64px' :
                     getStringProp('size') === 'xl' ? '96px' : '48px',
              height: getStringProp('size') === 'xs' ? '24px' :
                      getStringProp('size') === 'sm' ? '32px' :
                      getStringProp('size') === 'lg' ? '64px' :
                      getStringProp('size') === 'xl' ? '96px' : '48px',
              borderRadius: getStringProp('shape') === 'square' ? '8px' : '50%',
              backgroundColor: getStringProp('source') ? 'transparent' : '#e2e8f0',
              backgroundImage: getStringProp('source') ? `url(${getStringProp('source')})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: getStringProp('size') === 'xs' ? '10px' :
                        getStringProp('size') === 'sm' ? '12px' :
                        getStringProp('size') === 'lg' ? '24px' :
                        getStringProp('size') === 'xl' ? '32px' : '16px',
            }}
          >
            {!getStringProp('source') && getStringProp('fallback', 'U')}
          </div>
        );

      case 'Card':
        return (
          <div
            className={`vrn-card ${getStringProp('shadow', 'md')}`}
            style={{
              padding: getNumberProp('p') ? `${getNumberProp('p') * 4}px` : '16px',
              borderRadius: getStringProp('rounded') === 'none' ? '0' :
                           getStringProp('rounded') === 'sm' ? '4px' :
                           getStringProp('rounded') === 'lg' ? '12px' :
                           getStringProp('rounded') === 'xl' ? '16px' : '8px',
              border: getBooleanProp('border') ? '1px solid #e2e8f0' : 'none',
            }}
          >
            {component.children?.map((child: VRNComponent) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        );

      case 'Divider':
        return (
          <div
            className={`vrn-divider ${getStringProp('orientation', 'horizontal')}`}
            style={{
              width: getStringProp('orientation') === 'vertical' ? `${getNumberProp('thickness', 1)}px` : '100%',
              height: getStringProp('orientation') === 'vertical' ? '100%' : `${getNumberProp('thickness', 1)}px`,
              backgroundColor: getStringProp('color', '#e2e8f0'),
              margin: getNumberProp('spacing') ? `${getNumberProp('spacing') * 4}px 0` : '8px 0',
            }}
          />
        );

      default:
        return (
          <div
            className="vrn-component-unknown"
            style={{
              padding: '8px',
              border: '2px dashed #ccc',
              borderRadius: '4px',
              color: '#666',
              fontSize: '12px',
            }}
          >
            Unknown component: {component.type}
          </div>
        );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const dropData = JSON.parse(data);
        if (dropData.type === 'component' && dropData.componentDefinition) {
          const componentDef = dropData.componentDefinition;
          const newComponent = {
            id: generateId(),
            type: componentDef.name as any,
            props: { ...componentDef.props },
            children: [],
          };
          // Add as child to this component
          addComponent(newComponent, component.id);
        }
      } catch (error) {
        console.error('Failed to parse drop data:', error);
      }
    }
  };

  // Check if this component can accept children
  const canAcceptChildren = !['Text', 'Button', 'Input', 'Image', 'Avatar', 'Divider'].includes(component.type);

  return (
    <div
      className={`vrn-component-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDragOver={canAcceptChildren ? handleDragOver : undefined}
      onDrop={canAcceptChildren ? handleDrop : undefined}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #007acc' : 'none',
        outlineOffset: '2px',
        minHeight: canAcceptChildren && component.children?.length === 0 ? '40px' : 'auto',
        border: canAcceptChildren && component.children?.length === 0 ? '2px dashed #ccc' : 'none',
      }}
    >
      {renderComponent()}
    </div>
  );
};

// Helper function to generate unique IDs
function generateId(): string {
  return `vrn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}