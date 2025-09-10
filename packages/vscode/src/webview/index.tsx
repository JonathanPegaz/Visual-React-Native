import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisualEditor } from './components/VisualEditor';
import './styles.css';

// Initialize React app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<VisualEditor />);