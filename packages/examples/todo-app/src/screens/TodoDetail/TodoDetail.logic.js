import { useState, useEffect } from 'react';
import { todoStore } from '../../store/todoStore';

/**
 * @returns {{
 *   todo: Object | null,
 *   isEditing: boolean,
 *   editTitle: string,
 *   editDescription: string,
 *   onTitleChange: function,
 *   onDescriptionChange: function,
 *   onToggleEdit: function,
 *   onSave: function,
 *   onCancel: function,
 *   onToggleComplete: function,
 *   onDelete: function,
 *   onBack: function,
 *   canSave: boolean
 * }}
 */
export function useTodoDetailLogic(navigation, route) {
  const { todoId } = route.params || {};
  const [todo, setTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (!todoId) return;

    // Subscribe to todo store updates
    const unsubscribe = todoStore.subscribe(() => {
      const currentTodo = todoStore.getTodo(todoId);
      setTodo(currentTodo);
      
      // Update edit fields if not currently editing
      if (!isEditing && currentTodo) {
        setEditTitle(currentTodo.title);
        setEditDescription(currentTodo.description || '');
      }
    });

    // Load initial todo
    const currentTodo = todoStore.getTodo(todoId);
    setTodo(currentTodo);
    if (currentTodo) {
      setEditTitle(currentTodo.title);
      setEditDescription(currentTodo.description || '');
    }

    return unsubscribe;
  }, [todoId, isEditing]);

  const onTitleChange = (newTitle) => {
    setEditTitle(newTitle);
  };

  const onDescriptionChange = (newDescription) => {
    setEditDescription(newDescription);
  };

  const onToggleEdit = () => {
    if (todo) {
      setEditTitle(todo.title);
      setEditDescription(todo.description || '');
    }
    setIsEditing(!isEditing);
  };

  const onSave = () => {
    if (todo && editTitle.trim()) {
      todoStore.updateTodo(todoId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    }
  };

  const onCancel = () => {
    if (todo) {
      setEditTitle(todo.title);
      setEditDescription(todo.description || '');
    }
    setIsEditing(false);
  };

  const onToggleComplete = () => {
    if (todo) {
      todoStore.toggleTodo(todoId);
    }
  };

  const onDelete = () => {
    todoStore.deleteTodo(todoId);
    navigation.goBack();
  };

  const onBack = () => {
    navigation.goBack();
  };

  const canSave = editTitle.trim().length > 0;

  return {
    todo,
    isEditing,
    editTitle,
    editDescription,
    onTitleChange,
    onDescriptionChange,
    onToggleEdit,
    onSave,
    onCancel,
    onToggleComplete,
    onDelete,
    onBack,
    canSave
  };
}