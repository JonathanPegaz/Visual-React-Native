import { useState } from 'react';
import { todoStore } from '../../store/todoStore';

/**
 * @returns {{
 *   title: string,
 *   description: string,
 *   onTitleChange: function,
 *   onDescriptionChange: function,
 *   onSave: function,
 *   onCancel: function,
 *   canSave: boolean
 * }}
 */
export function useAddTodoLogic(navigation) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const onDescriptionChange = (newDescription) => {
    setDescription(newDescription);
  };

  const onSave = () => {
    if (title.trim()) {
      todoStore.addTodo({
        title: title.trim(),
        description: description.trim(),
      });
      navigation.goBack();
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const canSave = title.trim().length > 0;

  return {
    title,
    description,
    onTitleChange,
    onDescriptionChange,
    onSave,
    onCancel,
    canSave
  };
}