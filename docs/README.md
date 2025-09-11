# Visual React Native Documentation

Welcome to the comprehensive documentation for Visual React Native - the MVVM framework that revolutionizes React Native development with visual editing capabilities.

## 📚 Documentation Structure

### Getting Started
- **[Getting Started Guide](./getting-started.md)** - Complete walkthrough for new developers
- **[API Reference](./API.md)** - Detailed component and API documentation
- **[Best Practices](./best-practices.md)** - Guidelines for writing maintainable code

### Core Concepts

#### MVVM Architecture
Visual RN uses the Model-View-ViewModel pattern to separate concerns:
- **View** (.view.vrn files) - UI structure editable in visual editor
- **Logic** (.logic.js files) - Business logic and state management  
- **Model** - Data structures and API interfaces

#### Visual Editor
- Edit .view.vrn files visually in VSCode
- Drag & drop components
- Visual style editing with color pickers and sliders
- Real-time preview across devices
- Automatic code generation

#### Component Library
11 core components covering layout and UI needs:
- Layout: Screen, Stack, HStack, Grid
- UI: Text, Button, Input, Card, Avatar, Image

## 🚀 Quick Links

### For Designers
- [Visual Editor Guide](./getting-started.md#using-the-visual-editor)
- [Component Library](./API.md#core-components)
- [Theming System](./API.md#theme-system)

### For Developers  
- [MVVM Architecture](./getting-started.md#understanding-mvvm)
- [Logic Hook Patterns](./API.md#mvvm-architecture)
- [Testing Guide](./best-practices.md#testing)

### For Teams
- [Project Structure](./getting-started.md#project-structure)
- [Collaboration Workflow](./best-practices.md#component-organization)
- [Performance Guidelines](./best-practices.md#performance-optimization)

## 📖 Learning Path

### 1. **Understand the Basics** (30 minutes)
Read the [Getting Started Guide](./getting-started.md) to understand:
- MVVM architecture principles
- Project structure and file organization
- Basic component usage

### 2. **Build Your First Screen** (1 hour)
Follow the tutorial in Getting Started to create:
- A simple profile screen
- Logic hook with state management
- View component with UI layout
- Connection between view and logic

### 3. **Explore Components** (1 hour)
Review the [API Reference](./API.md) to learn:
- All available components and their props
- Theme system and design tokens
- Common patterns and examples

### 4. **Apply Best Practices** (30 minutes)
Study the [Best Practices Guide](./best-practices.md) for:
- Code organization patterns
- Performance optimization techniques
- Testing strategies
- Security considerations

### 5. **Advanced Topics** (ongoing)
- Custom component creation
- Advanced state management
- Complex navigation patterns
- Performance optimization

## 🛠 Development Workflow

### Designer Workflow
1. Open .view.vrn file in VSCode
2. Click "Open Visual Editor"
3. Use visual tools to design UI
4. Preview on different devices
5. Changes auto-save to code

### Developer Workflow  
1. Create logic hooks with state and actions
2. Define component interfaces and data flow
3. Write tests for business logic
4. Handle API integration and error states
5. Review generated connector files

### Team Collaboration
1. Designers work on .view.vrn files visually
2. Developers work on .logic.js files in code
3. Both can work simultaneously without conflicts
4. Auto-generated connector keeps them in sync
5. Standard Git workflow for version control

## 📋 Examples

### Complete Examples
- **[Todo App](../packages/examples/todo-app/)** - Full MVVM example with navigation, state management, and CRUD operations

### Code Snippets
Each documentation page includes practical examples:
- Component usage patterns
- Logic hook implementations  
- Common UI layouts
- Error handling strategies
- Testing approaches

## 🔧 Troubleshooting

### Common Issues

#### Visual Editor Not Opening
- Ensure VSCode extension is installed
- Check that file has .view.vrn extension
- Try reloading VSCode window

#### Components Not Updating
- Verify logic hook returns correct structure
- Check that view receives props correctly
- Ensure connector file is up to date

#### TypeScript Errors
- Run `npm run typecheck` to see all errors
- Check component prop definitions
- Verify import paths are correct

#### Build Failures
- Run `npm run lint` to check code style
- Verify all dependencies are installed
- Check for syntax errors in .view.vrn files

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Examples**: Study the todo app for patterns
- **API Docs**: Reference for all components and APIs

## 🚀 What's Next?

### Current Roadmap
- **v1.0**: 20+ components, animations, Figma integration
- **v2.0**: Real-time collaboration, AI suggestions, marketplace

### Contributing
We welcome contributions! Areas where you can help:
- Additional components
- Documentation improvements  
- Example projects
- Bug fixes and optimizations

### Stay Updated
- Watch the GitHub repository for updates
- Follow our development progress
- Join the community discussions

---

**Ready to get started?** Begin with the [Getting Started Guide](./getting-started.md) and build your first Visual React Native app!