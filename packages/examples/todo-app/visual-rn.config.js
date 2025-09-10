module.exports = {
  // Theme customization
  theme: {
    // Custom theme tokens
    colors: {
      // Override default colors here
      // primary: '#FF6B6B',
    },
  },
  
  // Component settings
  components: {
    // Directory for custom components
    custom: './src/components',
    
    // Components to exclude from visual editor
    exclude: [],
  },
  
  // Editor settings
  editor: {
    defaultDevice: 'iPhone 14',
    gridSize: 8,
    snapToGrid: true,
  },
  
  // Build settings
  build: {
    output: 'visual-rn',
    typescript: false,
  },
};