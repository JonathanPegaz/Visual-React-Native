import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import TodoDetailView from './TodoDetail.view.vrn';
import { useTodoDetailLogic } from './TodoDetail.logic.js';

export default function TodoDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const logic = useTodoDetailLogic(navigation, route);
  
  return <TodoDetailView {...logic} />;
}