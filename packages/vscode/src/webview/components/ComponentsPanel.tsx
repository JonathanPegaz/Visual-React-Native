import React from 'react';
import { useEditorStore, type ComponentDefinition, type VRNComponent } from '../store';

export const ComponentsPanel: React.FC = () => {
  const { availableComponents, addComponent } = useEditorStore();

  const groupedComponents = availableComponents?.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category]?.push(component);
    return acc;
  }, {} as Record<string, ComponentDefinition[]>) || {};

  const handleAddComponent = (componentDef: ComponentDefinition) => {
    const newComponent: VRNComponent = {
      id: generateId(),
      type: componentDef.name as VRNComponent['type'],
      props: { ...componentDef.props },
      children: [],
    };

    addComponent(newComponent);
  };

  if (!availableComponents || availableComponents.length === 0) {
    return (
      <aside className="components-panel">
        <h3>Components</h3>
        <div className="loading">
          <p>Loading components...</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="components-panel">
      <h3>Components</h3>
      <div className="component-list">
        {Object.entries(groupedComponents).map(([category, components]) => (
          <div key={category} className="component-category">
            <h4>{category}</h4>
            <div className="component-items">
              {components.map((component) => (
                <div
                  key={component.name}
                  className="component-item"
                  draggable
                  onClick={() => handleAddComponent(component)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      type: 'component',
                      componentDefinition: component
                    }));
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  title={`Drag to add ${component.name} or click to add to root`}
                >
                  <span className="component-icon">{component.icon}</span>
                  <span className="component-name">{component.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

function generateId(): string {
  return `vrn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}