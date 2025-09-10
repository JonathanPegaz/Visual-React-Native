import React from 'react';
import { useEditorStore } from '../store';

export const PropertiesPanel: React.FC = () => {
  const { 
    currentFile,
    selectedComponentId, 
    updateComponent, 
    removeComponent,
    availableComponents 
  } = useEditorStore();

  const selectedComponent = currentFile && selectedComponentId 
    ? findComponentById(currentFile.tree, selectedComponentId)
    : null;

  const componentDef = selectedComponent
    ? availableComponents.find(c => c.name === selectedComponent.type)
    : null;

  if (!selectedComponent) {
    return (
      <aside className="properties-panel">
        <h3>Properties</h3>
        <div className="properties-content">
          <p className="no-selection">Select a component to edit properties</p>
        </div>
      </aside>
    );
  }

  const handlePropChange = (propName: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [propName]: value,
      }
    });
  };

  const handleRemove = () => {
    removeComponent(selectedComponent.id);
  };

  return (
    <aside className="properties-panel">
      <h3>Properties</h3>
      <div className="properties-content">
        <div className="component-info">
          <h4>{selectedComponent.type}</h4>
          <p className="component-id">ID: {selectedComponent.id}</p>
          <button 
            className="btn btn-danger btn-small"
            onClick={handleRemove}
          >
            Remove Component
          </button>
        </div>

        <div className="properties-form">
          {componentDef && renderPropertiesForm(
            selectedComponent, 
            componentDef, 
            handlePropChange
          )}
          
          {/* Bindings section */}
          {currentFile?.logicFile && (
            <div className="bindings-section">
              <h5>Bindings</h5>
              {renderBindingsForm(
                selectedComponent,
                currentFile.logicFile,
                handlePropChange
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

function findComponentById(tree: any, id: string): any {
  if (!tree) return null;
  if (tree.id === id) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findComponentById(child, id);
      if (found) return found;
    }
  }
  
  return null;
}

function renderPropertiesForm(
  component: any, 
  componentDef: any, 
  onChange: (prop: string, value: any) => void
) {
  return (
    <div className="props-form">
      <h5>Component Props</h5>
      {Object.entries(componentDef.props || {}).map(([propName, propConfig]: [string, any]) => (
        <div key={propName} className="prop-field">
          <label>{propName}</label>
          {renderPropInput(
            propName,
            component.props[propName],
            propConfig,
            onChange
          )}
        </div>
      ))}
    </div>
  );
}

function renderPropInput(
  propName: string,
  currentValue: any,
  propConfig: any,
  onChange: (prop: string, value: any) => void
) {
  switch (propConfig.type) {
    case 'string':
      return (
        <input
          type="text"
          value={currentValue || ''}
          onChange={(e) => onChange(propName, e.target.value)}
          placeholder={propConfig.placeholder}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={currentValue || ''}
          onChange={(e) => onChange(propName, parseInt(e.target.value) || 0)}
          min={propConfig.min}
          max={propConfig.max}
        />
      );

    case 'boolean':
      return (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={currentValue || false}
            onChange={(e) => onChange(propName, e.target.checked)}
          />
          <span className="checkmark"></span>
        </label>
      );

    case 'enum':
      return (
        <select
          value={currentValue || propConfig.default}
          onChange={(e) => onChange(propName, e.target.value)}
        >
          {propConfig.options?.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case 'color':
      return (
        <div className="color-input">
          <input
            type="color"
            value={currentValue || '#000000'}
            onChange={(e) => onChange(propName, e.target.value)}
          />
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onChange(propName, e.target.value)}
            placeholder="#000000"
          />
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={currentValue || ''}
          onChange={(e) => onChange(propName, e.target.value)}
        />
      );
  }
}

function renderBindingsForm(
  _component: any,
  logicFile: any,
  onChange: (prop: string, value: any) => void
) {
  return (
    <div className="bindings-form">
      {/* State bindings */}
      {Object.keys(logicFile.state || {}).length > 0 && (
        <div className="binding-group">
          <h6>State</h6>
          {Object.keys(logicFile.state).map(stateKey => (
            <div key={stateKey} className="binding-field">
              <label>{stateKey}</label>
              <button 
                className="btn btn-small"
                onClick={() => onChange('value', `{${stateKey}}`)}
              >
                Bind to value
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action bindings */}
      {Object.keys(logicFile.actions || {}).length > 0 && (
        <div className="binding-group">
          <h6>Actions</h6>
          {Object.keys(logicFile.actions).map(actionKey => (
            <div key={actionKey} className="binding-field">
              <label>{actionKey}</label>
              <button 
                className="btn btn-small"
                onClick={() => onChange('onPress', `{${actionKey}}`)}
              >
                Bind to onPress
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}