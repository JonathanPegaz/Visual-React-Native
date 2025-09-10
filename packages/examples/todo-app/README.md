# Visual RN Todo App

A comprehensive Todo application showcasing the Visual React Native framework with MVVM architecture and visual editing capabilities.

## 🌟 Features

- **Complete Todo Management**: Add, edit, delete, and toggle completion status
- **Smart Filtering**: View all, active, or completed todos
- **Rich Detail View**: Full todo details with editing capabilities
- **Visual Editor Support**: Edit UI components visually in VS Code
- **MVVM Architecture**: Clean separation of concerns
- **Navigation**: Multi-screen app with React Navigation
- **State Management**: Custom lightweight store with subscriptions

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. For iOS:
   ```bash
   npm run ios
   ```

3. For Android:
   ```bash
   npm run android
   ```

## 🎨 Visual Editor

Experience the power of Visual React Native's visual editor:

1. Open the project in VS Code
2. Install the "Visual React Native Editor" extension
3. Open any `.view.vrn` file (e.g., `TodoList.view.vrn`)
4. Click "Open Visual Editor" in the command palette or status bar
5. Edit components visually without touching the code!

## 📁 Project Structure

```
src/
  screens/
    TodoList/           # Main todo list screen
      TodoList.view.vrn # Visual component (drag & drop editing)
      TodoList.logic.js # Business logic and state management
      TodoList.js       # Screen connector
      index.js          # Export
    
    AddTodo/            # Add new todo screen
      AddTodo.view.vrn  # Form UI components
      AddTodo.logic.js  # Form logic and validation
      AddTodo.js        # Screen connector
      index.js          # Export
    
    TodoDetail/         # Todo detail and edit screen
      TodoDetail.view.vrn # Detail view with edit mode
      TodoDetail.logic.js # CRUD operations and state
      TodoDetail.js       # Screen connector
      index.js            # Export
  
  store/
    todoStore.js        # Global todo state management
```

## 🏗️ Architecture Highlights

### MVVM Pattern
- **Model**: `todoStore.js` - Data management and business rules
- **View**: `*.view.vrn` - UI components (visually editable)
- **ViewModel**: `*.logic.js` - Screen logic and data binding

### Visual Components Used
- **Screen**: Safe area container with background
- **Stack/HStack**: Flexible layout containers
- **Text**: Typography with variants (h1, h2, body, caption, label)
- **Button**: Interactive elements with multiple variants
- **Input**: Text input with multiline support
- **Card**: Elevated containers with shadows
- **Divider**: Visual separators

### Key Features Demonstrated
1. **Component Composition**: Complex layouts built from simple components
2. **Props System**: Dynamic styling and behavior
3. **State Binding**: Reactive UI updates
4. **Navigation**: Multi-screen workflow
5. **Store Integration**: Centralized state management
6. **Visual Editing**: No-code UI modifications

## 📖 Learning Guide

### For Developers
- Examine the `.logic.js` files to understand state management
- Study the store pattern in `todoStore.js`
- Look at navigation integration in `App.js`

### For Designers
- Open `.view.vrn` files in the Visual Editor
- Experiment with component properties
- Try different layouts and styling options
- See changes reflect immediately in the preview

## 🔄 Todo App Workflow

1. **TodoList Screen**: View all todos with filtering options
2. **Add Todo**: Tap "Add Todo" to create new items
3. **Todo Detail**: Tap any todo to view/edit details
4. **Complete/Delete**: Toggle completion or remove todos
5. **Statistics**: See completion progress

## 💡 MVVM in Action

Each screen demonstrates clean architecture:

```javascript
// Logic Layer (*.logic.js)
export function useTodoListLogic(navigation) {
  const [todos, setTodos] = useState([]);
  
  const onAddTodo = () => navigation.navigate('AddTodo');
  const onToggleTodo = (id) => todoStore.toggleTodo(id);
  
  return { todos, onAddTodo, onToggleTodo };
}

// View Layer (*.view.vrn) - Visually Editable!
export default function TodoListView({ todos, onAddTodo, onToggleTodo }) {
  return (
    <Screen>
      <Button onPress={onAddTodo}>Add Todo</Button>
      {todos.map(todo => (
        <Text key={todo.id} onPress={() => onToggleTodo(todo.id)}>
          {todo.title}
        </Text>
      ))}
    </Screen>
  );
}

// Connector Layer (*.js)
export default function TodoListScreen() {
  const navigation = useNavigation();
  const logic = useTodoListLogic(navigation);
  return <TodoListView {...logic} />;
}
```

## 🎯 Try These Actions

1. **Visual Editing**: Open `TodoList.view.vrn` and modify the layout
2. **Add Features**: Extend the logic in `*.logic.js` files
3. **Styling**: Change colors, spacing, and typography visually
4. **Components**: Add new Visual RN components to screens
5. **Store**: Extend the store with categories or priorities

## 📚 Learn More

- [Visual React Native Documentation](https://visual-rn.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native](https://reactnative.dev)

This Todo App showcases the full power of Visual React Native: write logic in code, design UI visually, and maintain clean architecture throughout!