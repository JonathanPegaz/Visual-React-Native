import { useState, useEffect } from 'react';
import { todoStore } from '../../store/todoStore';

/**
 * @returns {{
 *   todos: Array<{id: string, title: string, description: string, completed: boolean, createdAt: Date}>,
 *   filter: string,
 *   onAddTodo: function,
 *   onToggleTodo: function,
 *   onDeleteTodo: function,
 *   onFilterChange: function,
 *   onViewTodo: function
 * }}
 */
export function useTodoListLogic(navigation) {
  const [filter, setFilter] = useState('all');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Subscribe to todo store updates
    const unsubscribe = todoStore.subscribe((newTodos) => {
      setTodos(newTodos);
    });

    // Load initial todos
    setTodos(todoStore.getTodos());

    return unsubscribe;
  }, []);

  const onAddTodo = () => {
    navigation.navigate('AddTodo');
  };

  const onToggleTodo = (todoId) => {
    todoStore.toggleTodo(todoId);
  };

  const onDeleteTodo = (todoId) => {
    todoStore.deleteTodo(todoId);
  };

  const onFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const onViewTodo = (todoId) => {
    navigation.navigate('TodoDetail', { todoId });
  };

  return {
    todos,
    filter,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
    onFilterChange,
    onViewTodo
  };
}