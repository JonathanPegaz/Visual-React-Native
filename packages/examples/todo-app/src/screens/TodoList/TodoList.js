import React from 'react';
import { useNavigation } from '@react-navigation/native';
import TodoListView from './TodoList.view.vrn';
import { useTodoListLogic } from './TodoList.logic.js';

export default function TodoListScreen() {
  const navigation = useNavigation();
  const logic = useTodoListLogic(navigation);
  
  return <TodoListView {...logic} />;
}