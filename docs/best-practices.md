# Visual React Native - Best Practices

## MVVM Architecture Guidelines

### 1. Separation of Concerns

#### ✅ DO: Keep Views Pure
```jsx
// ProfileScreen.view.vrn - GOOD
export default function ProfileView({ state, actions }) {
  return (
    <Screen>
      <Stack spacing={4}>
        <Text>{state.user.name}</Text>
        <Button onPress={actions.logout}>Logout</Button>
      </Stack>
    </Screen>
  );
}
```

#### ❌ DON'T: Put Logic in Views
```jsx
// ProfileScreen.view.vrn - BAD
export default function ProfileView({ state, actions }) {
  const [localState, setLocalState] = useState(); // ❌ No state in views
  
  useEffect(() => {                                // ❌ No effects in views
    fetchUserData();
  }, []);

  const handleLogout = async () => {               // ❌ No business logic in views
    await AuthService.logout();
    navigation.navigate('Login');
  };

  return (
    <Screen>
      <Text>{state.user.name}</Text>
    </Screen>
  );
}
```

#### ✅ DO: Keep Logic in Logic Files
```javascript
// ProfileScreen.logic.js - GOOD
export function useProfileLogic(navigation) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    try {
      const userData = await UserService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    navigation.navigate('Login');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    state: { user, loading },
    actions: { logout, loadUser }
  };
}
```

### 2. State Management

#### ✅ DO: Use Appropriate State Levels
```javascript
// Component-level state for UI-only data
const [isExpanded, setIsExpanded] = useState(false);
const [selectedTab, setSelectedTab] = useState(0);

// Screen-level state for screen-specific data
const [user, setUser] = useState(null);
const [todos, setTodos] = useState([]);

// Global state for app-wide data
const { currentUser, isAuthenticated } = useAuth();
const { theme, setTheme } = useTheme();
```

#### ❌ DON'T: Overuse Global State
```javascript
// BAD - Don't put everything in global state
const globalState = {
  user: {...},
  todos: [...],
  selectedTab: 0,        // ❌ This should be local
  isModalOpen: false,    // ❌ This should be local
  formData: {...},       // ❌ This should be local
  lastClickTime: Date.now() // ❌ This should be local
};
```

### 3. Component Organization

#### ✅ DO: Follow Consistent Structure
```
screens/
  HomeScreen/
    index.js                 # Clean export
    HomeScreen.js           # Auto-generated connector
    HomeScreen.view.vrn     # View component
    HomeScreen.logic.js     # Business logic
    HomeScreen.test.js      # Tests
    components/             # Screen-specific components
      Header/
      TodoItem/
```

#### ✅ DO: Use Descriptive Names
```javascript
// GOOD - Clear and descriptive
export function useUserProfileLogic() { ... }
export function useTodoListLogic() { ... }
export function useShoppingCartLogic() { ... }

// BAD - Vague or confusing
export function useLogic() { ... }
export function useHook() { ... }
export function useStuff() { ... }
```

## Component Design

### 1. Design System Consistency

#### ✅ DO: Use Design Tokens
```jsx
// GOOD - Use theme tokens
<Card p={4} bg="gray.50" shadow="medium">
  <Text variant="h2" color="primary">Title</Text>
  <Text variant="body" color="gray.600">Description</Text>
</Card>
```

#### ❌ DON'T: Use Magic Numbers
```jsx
// BAD - Hardcoded values
<Card p={17} bg="#F8F9FA" style={{ shadowOpacity: 0.1 }}>
  <Text style={{ fontSize: 24, color: '#007AFF' }}>Title</Text>
  <Text style={{ fontSize: 16, color: '#666' }}>Description</Text>
</Card>
```

### 2. Component Composition

#### ✅ DO: Compose Components
```jsx
// GOOD - Composable components
<Screen safe>
  <Header title="Profile" />
  <ScrollView>
    <UserInfo user={state.user} />
    <ActionButtons onEdit={actions.edit} onLogout={actions.logout} />
  </ScrollView>
</Screen>
```

#### ❌ DON'T: Create Monolithic Components
```jsx
// BAD - Everything in one component
<Screen safe>
  <Stack p={4}>
    <HStack justify="space-between">
      <Text variant="h1">Profile</Text>
      <Button size="small" onPress={actions.goBack}>Back</Button>
    </HStack>
    <Avatar source={state.user.avatar} size="xl" />
    <Text variant="h2">{state.user.name}</Text>
    <Text variant="body">{state.user.email}</Text>
    <Text variant="caption">{state.user.bio}</Text>
    <Stack spacing={2}>
      <Button variant="primary" onPress={actions.edit}>Edit Profile</Button>
      <Button variant="secondary" onPress={actions.settings}>Settings</Button>
      <Button variant="danger" onPress={actions.logout}>Logout</Button>
    </Stack>
    {/* ... 50 more lines */}
  </Stack>
</Screen>
```

### 3. Responsive Design

#### ✅ DO: Design for Multiple Screen Sizes
```jsx
// GOOD - Responsive layout
<Grid cols={{ xs: 1, sm: 2, lg: 3 }} spacing={4}>
  {items.map(item => (
    <Card key={item.id}>
      <Text>{item.title}</Text>
    </Card>
  ))}
</Grid>

// Responsive padding
<Stack p={{ xs: 2, sm: 4, lg: 6 }}>
  <Text variant={{ xs: 'body', lg: 'h3' }}>
    {title}
  </Text>
</Stack>
```

## Performance Optimization

### 1. Avoid Unnecessary Re-renders

#### ✅ DO: Memoize Expensive Computations
```javascript
// Logic file
export function useProductListLogic() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filter === 'available') return product.inStock;
      if (filter === 'sale') return product.onSale;
      return true;
    });
  }, [products, filter]);

  return {
    state: { products: filteredProducts, filter },
    actions: { setFilter }
  };
}
```

#### ✅ DO: Use Callback References
```javascript
// Logic file
const handleItemPress = useCallback((itemId) => {
  navigation.navigate('Detail', { itemId });
}, [navigation]);

const handleDelete = useCallback((itemId) => {
  setItems(prev => prev.filter(item => item.id !== itemId));
}, []);

return {
  actions: { handleItemPress, handleDelete }
};
```

### 2. Optimize Lists

#### ✅ DO: Use FlatList for Large Lists
```jsx
// View file - for large datasets
<FlatList
  data={state.items}
  renderItem={({ item }) => (
    <TodoItem 
      todo={item} 
      onPress={() => actions.selectTodo(item.id)}
      onDelete={() => actions.deleteTodo(item.id)}
    />
  )}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  })}
/>
```

## Error Handling

### 1. Graceful Error Handling

#### ✅ DO: Handle Errors at Multiple Levels
```javascript
// Logic file
export function useDataLogic() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.fetchData();
      setData(result);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError({
        message: 'Failed to load data. Please try again.',
        retry: loadData
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { data, error, loading },
    actions: { loadData, retry: loadData }
  };
}
```

#### ✅ DO: Show User-Friendly Error Messages
```jsx
// View file
{state.error && (
  <Card bg="error.50" borderColor="error.200" p={4}>
    <HStack align="center" spacing={3}>
      <Text color="error.600">⚠️</Text>
      <Stack flex={1}>
        <Text variant="body" color="error.700">
          {state.error.message}
        </Text>
        {state.error.retry && (
          <Button 
            size="small" 
            variant="ghost" 
            onPress={state.error.retry}
          >
            Try Again
          </Button>
        )}
      </Stack>
    </HStack>
  </Card>
)}
```

### 2. Loading States

#### ✅ DO: Provide Clear Loading Feedback
```jsx
// View file
{state.loading ? (
  <Stack align="center" spacing={3} p={8}>
    <ActivityIndicator size="large" color="primary" />
    <Text variant="body" color="gray.600">
      Loading your data...
    </Text>
  </Stack>
) : (
  <DataList data={state.data} />
)}
```

## Testing

### 1. Test Logic Separately

#### ✅ DO: Test Business Logic
```javascript
// HomeScreen.logic.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeLogic } from './HomeScreen.logic';

const mockNavigation = {
  navigate: jest.fn()
};

describe('useHomeLogic', () => {
  it('should load todos on mount', async () => {
    const { result } = renderHook(() => useHomeLogic(mockNavigation));
    
    expect(result.current.state.loading).toBe(true);
    
    await act(async () => {
      await result.current.actions.loadTodos();
    });
    
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.todos).toHaveLength(3);
  });

  it('should handle todo toggle', () => {
    const { result } = renderHook(() => useHomeLogic(mockNavigation));
    
    act(() => {
      result.current.actions.toggleTodo('1');
    });
    
    expect(result.current.state.todos[0].completed).toBe(true);
  });
});
```

### 2. Test View Components

#### ✅ DO: Test View Rendering
```javascript
// HomeScreen.view.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeView from './HomeScreen.view.vrn';

const mockProps = {
  state: {
    todos: [
      { id: '1', title: 'Test Todo', completed: false }
    ],
    loading: false
  },
  actions: {
    toggleTodo: jest.fn(),
    addTodo: jest.fn()
  }
};

describe('HomeView', () => {
  it('should render todos', () => {
    const { getByText } = render(<HomeView {...mockProps} />);
    
    expect(getByText('Test Todo')).toBeTruthy();
  });

  it('should call toggleTodo when todo is pressed', () => {
    const { getByText } = render(<HomeView {...mockProps} />);
    
    fireEvent.press(getByText('Test Todo'));
    
    expect(mockProps.actions.toggleTodo).toHaveBeenCalledWith('1');
  });
});
```

## Security

### 1. Data Validation

#### ✅ DO: Validate Input Data
```javascript
// Logic file
const updateProfile = async (profileData) => {
  // Validate before sending
  const validation = validateProfileData(profileData);
  if (!validation.valid) {
    setErrors(validation.errors);
    return;
  }

  try {
    await api.updateProfile(profileData);
    setUser(profileData);
  } catch (error) {
    setError('Failed to update profile');
  }
};

function validateProfileData(data) {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
```

### 2. Secure Data Handling

#### ✅ DO: Handle Sensitive Data Carefully
```javascript
// Logic file
import { SecureStore } from 'expo-secure-store';

export function useAuthLogic() {
  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      
      // Store sensitive data securely
      await SecureStore.setItemAsync('authToken', response.token);
      
      // Don't store sensitive data in state
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email
        // Don't store: password, token, sensitive fields
      });
    } catch (error) {
      setError('Login failed');
    }
  };
}
```

## Accessibility

### 1. Accessibility Labels

#### ✅ DO: Add Accessibility Support
```jsx
// View file
<Button
  onPress={actions.addTodo}
  accessibilityLabel="Add new todo item"
  accessibilityHint="Opens form to create a new todo"
>
  Add Todo
</Button>

<Text
  variant="h1"
  accessibilityRole="header"
  accessibilityLevel={1}
>
  My Todos
</Text>
```

### 2. Focus Management

#### ✅ DO: Manage Focus for Screen Readers
```jsx
// View file with form
<Stack spacing={4}>
  <Input
    ref={nameInputRef}
    value={form.name}
    onChangeText={(value) => actions.updateField('name', value)}
    placeholder="Name"
    accessibilityLabel="Full name"
    autoFocus
  />
  <Input
    value={form.email}
    onChangeText={(value) => actions.updateField('email', value)}
    placeholder="Email"
    accessibilityLabel="Email address"
    onSubmitEditing={() => nameInputRef.current?.focus()}
  />
</Stack>
```

## Code Organization

### 1. File Naming Conventions

```
// Screen files
screens/HomeScreen/HomeScreen.view.vrn
screens/HomeScreen/HomeScreen.logic.js
screens/HomeScreen/HomeScreen.test.js

// Component files
components/TodoItem/TodoItem.view.vrn
components/TodoItem/TodoItem.logic.js
components/TodoItem/TodoItem.test.js

// Service files
services/AuthService.js
services/TodoService.js

// Utility files
utils/validation.js
utils/formatting.js
utils/constants.js
```

### 2. Import Organization

```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { useNavigation } from '@react-navigation/native';

// 3. Internal imports (services, utils)
import { TodoService } from '../../services/TodoService';
import { formatDate } from '../../utils/formatting';

// 4. Relative imports
import { useTodoStore } from './hooks/useTodoStore';
```

Following these best practices will help you build maintainable, scalable, and high-quality Visual React Native applications.