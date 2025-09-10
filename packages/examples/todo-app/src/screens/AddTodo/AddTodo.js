import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AddTodoView from './AddTodo.view.vrn';
import { useAddTodoLogic } from './AddTodo.logic.js';

export default function AddTodoScreen() {
  const navigation = useNavigation();
  const logic = useAddTodoLogic(navigation);
  
  return <AddTodoView {...logic} />;
}