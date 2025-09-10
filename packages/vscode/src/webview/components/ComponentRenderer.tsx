import React from 'react';
import { VRNComponent, useEditorStore } from '../store';

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
  const { selectedComponentId, selectComponent } = useEditorStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleChildSelect = (childId: string) => {
    selectComponent(childId);
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'Screen':
        return (
          <div 
            className={`vrn-screen ${component.props['safe'] ? 'safe-area' : ''}`}
            style={{
              backgroundColor: component.props['bg'] || 'transparent',
              padding: component.props['p'] ? `${component.props['p'] * 4}px` : '0',
            }}
          >
            {component.children?.map((child) => (
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
              gap: component.props['spacing'] ? `${component.props['spacing'] * 4}px` : '0',
              alignItems: component.props['align'] || 'stretch',
              justifyContent: component.props['justify'] || 'flex-start',
              padding: component.props['p'] ? `${component.props['p'] * 4}px` : '0',
            }}
          >
            {component.children?.map((child) => (
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
              gap: component.props['spacing'] ? `${component.props['spacing'] * 4}px` : '0',
              alignItems: component.props['align'] || 'center',
              justifyContent: component.props['justify'] || 'flex-start',
            }}
          >
            {component.children?.map((child) => (
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
            className={`vrn-text ${component.props['variant'] || 'body'}`}
            style={{
              color: component.props['color'] || 'inherit',
              textAlign: component.props['align'] || 'left',
            }}
          >
            {component.props['children'] || 'Text'}
          </span>
        );

      case 'Button':
        return (
          <button 
            className={`vrn-button ${component.props['variant'] || 'primary'} ${component.props['size'] || 'medium'}`}
            style={{
              width: component.props['fullWidth'] ? '100%' : 'auto',
            }}
            disabled
          >
            {component.props['children'] || 'Button'}
          </button>
        );

      case 'Input':
        return (
          <input 
            className="vrn-input"
            type={component.props['type'] || 'text'}
            placeholder={component.props['placeholder'] || 'Enter text...'}
            value={component.props['value'] || ''}
            disabled
            readOnly
          />
        );

      case 'Card':
        return (
          <div 
            className="vrn-card"
            style={{
              padding: component.props['p'] ? `${component.props['p'] * 4}px` : '16px',
            }}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                onSelect={() => handleChildSelect(child.id)}
              />
            ))}
          </div>
        );

      case 'Avatar':
        return (
          <div 
            className={`vrn-avatar ${component.props['size'] || 'medium'}`}
            style={{
              backgroundImage: component.props['src'] ? `url(${component.props['src']})` : undefined,
            }}
          >
            {!component.props['src'] && (component.props['name']?.[0] || '👤')}
          </div>
        );

      case 'Image':
        return (
          <div 
            className="vrn-image"
            style={{
              aspectRatio: component.props['aspectRatio'] || '16/9',
              backgroundImage: component.props['src'] ? `url(${component.props['src']})` : undefined,
            }}
          >
            {!component.props['src'] && '🖼️'}
          </div>
        );

      case 'Divider':
        return (
          <hr 
            className="vrn-divider"
            style={{
              margin: component.props['spacing'] ? `${component.props['spacing'] * 4}px 0` : '8px 0',
            }}
          />
        );

      default:
        return (
          <div className="vrn-unknown">
            <span>Unknown: {component.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`component-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {renderComponent()}
      {isSelected && (
        <div className="selection-overlay">
          <div className="selection-handles">
            <div className="handle top-left"></div>
            <div className="handle top-right"></div>
            <div className="handle bottom-left"></div>
            <div className="handle bottom-right"></div>
          </div>
          <div className="component-label">
            {component.type}
          </div>
        </div>
      )}
    </div>
  );
};