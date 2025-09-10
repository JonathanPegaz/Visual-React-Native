/**
 * Simple Todo Store
 * A lightweight state management solution for the Visual RN Todo App
 */

let todoId = 1;
let todos = [
  {
    id: '1',
    title: 'Welcome to Visual RN!',
    description: 'This is your first todo item. You can edit, complete, or delete it.',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Try the Visual Editor',
    description: 'Open any .view.vrn file in VS Code and click "Open Visual Editor" to see the magic!',
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: '3',
    title: 'Learn about MVVM',
    description: 'Visual RN uses MVVM architecture. Check out the .logic.js files to see how business logic is separated.',
    completed: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  }
];

const subscribers = [];

export const todoStore = {
  // Get all todos
  getTodos() {
    return [...todos];
  },

  // Get a single todo by id
  getTodo(id) {
    return todos.find(todo => todo.id === id) || null;
  },

  // Add a new todo
  addTodo({ title, description = '' }) {
    const newTodo = {
      id: String(todoId++),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    todos.unshift(newTodo); // Add to beginning
    this.notify();
    return newTodo;
  },

  // Update an existing todo
  updateTodo(id, updates) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex] = {
        ...todos[todoIndex],
        ...updates,
        id, // Prevent id from being overwritten
      };
      this.notify();
      return todos[todoIndex];
    }
    return null;
  },

  // Toggle todo completion status
  toggleTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.notify();
      return todo;
    }
    return null;
  },

  // Delete a todo
  deleteTodo(id) {
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    
    if (todos.length < initialLength) {
      this.notify();
      return true;
    }
    return false;
  },

  // Clear completed todos
  clearCompleted() {
    const initialLength = todos.length;
    todos = todos.filter(todo => !todo.completed);
    
    if (todos.length < initialLength) {
      this.notify();
      return true;
    }
    return false;
  },

  // Get statistics
  getStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;

    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },

  // Subscribe to changes
  subscribe(callback) {
    subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  },

  // Notify all subscribers
  notify() {
    subscribers.forEach(callback => {
      try {
        callback([...todos]);
      } catch (error) {
        console.error('Error in todo store subscriber:', error);
      }
    });
  },

  // Reset store (useful for testing)
  reset() {
    todos = [];
    todoId = 1;
    this.notify();
  },
};