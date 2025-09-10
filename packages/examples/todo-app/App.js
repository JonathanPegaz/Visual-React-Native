import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from '@visual-rn/core';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import TodoListScreen from './src/screens/TodoList';
import AddTodoScreen from './src/screens/AddTodo';
import TodoDetailScreen from './src/screens/TodoDetail';

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="TodoList"
            screenOptions={{
              headerShown: false, // We'll use our own headers
            }}
          >
            <Stack.Screen
              name="TodoList"
              component={TodoListScreen}
              options={{ title: 'My Todos' }}
            />
            <Stack.Screen
              name="AddTodo"
              component={AddTodoScreen}
              options={{ title: 'Add Todo' }}
            />
            <Stack.Screen
              name="TodoDetail"
              component={TodoDetailScreen}
              options={{ title: 'Todo Details' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;