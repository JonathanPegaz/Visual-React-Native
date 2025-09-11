# Getting Started with Visual React Native

## Installation

### Prerequisites
- Node.js 16 or higher
- React Native development environment
- VSCode (recommended for visual editing)

### Create Your First App

```bash
# Create a new Visual RN project
npx create-visual-rn my-first-app

# Navigate to the project
cd my-first-app

# Install dependencies
npm install

# Open in VSCode
code .
```

### Install VSCode Extension

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Visual React Native"
4. Click Install

## Project Structure

```
my-first-app/
├── src/
│   ├── screens/           # App screens
│   │   ├── HomeScreen/
│   │   │   ├── index.js                  # Export file
│   │   │   ├── HomeScreen.js             # Auto-generated connector
│   │   │   ├── HomeScreen.view.vrn       # View (designers edit this)
│   │   │   └── HomeScreen.logic.js       # Logic (developers edit this)
│   │   └── ProfileScreen/
│   ├── components/        # Reusable components
│   ├── navigation/        # Navigation setup
│   ├── theme/            # Theme configuration
│   └── utils/            # Utility functions
├── visual-rn.config.js   # Visual RN configuration
├── package.json
└── App.js               # Main app entry point
```

## Understanding MVVM

Visual RN uses the MVVM (Model-View-ViewModel) architecture pattern:

### View (.view.vrn files)
- Contains only UI structure and layout
- No business logic or state management
- Receives data and actions as props
- Editable in the visual editor

### Logic (.logic.js files)
- Contains all business logic and state
- Handles API calls, navigation, form validation
- Returns state and actions to the view
- Written by developers in code

### Model
- Data structures and API interfaces
- Usually in separate files or stores

## Your First Screen

Let's create a simple profile screen to understand the pattern.

### 1. Create the Logic File

```javascript
// src/screens/ProfileScreen/ProfileScreen.logic.js
import { useState, useEffect } from 'react';

export function useProfileLogic(navigation) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/150'
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const actions = {
    startEditing() {
      setIsEditing(true);
    },
    
    cancelEditing() {
      setIsEditing(false);
    },
    
    saveProfile(newData) {
      setUser(prev => ({ ...prev, ...newData }));
      setIsEditing(false);
    },
    
    logout() {
      // Handle logout logic
      navigation.navigate('Login');
    }
  };

  return {
    state: {
      user,
      isEditing
    },
    actions
  };
}
```

### 2. Create the View File

```jsx
// src/screens/ProfileScreen/ProfileScreen.view.vrn
import { Screen, Stack, HStack, Text, Button, Avatar, Input, Card } from '@visual-rn/core';

export default function ProfileView({ state, actions }) {
  const { user, isEditing } = state;

  return (
    <Screen safe bg="gray.50">
      <Stack p={4} spacing={4}>
        {/* Header */}
        <Card p={4}>
          <Stack align="center" spacing={3}>
            <Avatar 
              source={{ uri: user.avatar }} 
              size="xl" 
              fallback={user.name.charAt(0)} 
            />
            
            {isEditing ? (
              <Stack spacing={2} w="100%">
                <Input
                  value={user.name}
                  placeholder="Full Name"
                  onChangeText={(name) => actions.saveProfile({ name })}
                />
                <Input
                  value={user.email}
                  placeholder="Email"
                  type="email"
                  onChangeText={(email) => actions.saveProfile({ email })}
                />
              </Stack>
            ) : (
              <Stack align="center" spacing={1}>
                <Text variant="h2">{user.name}</Text>
                <Text variant="body" color="gray.600">{user.email}</Text>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Actions */}
        <Stack spacing={2}>
          {isEditing ? (
            <HStack spacing={2}>
              <Button 
                variant="primary" 
                flex={1}
                onPress={actions.cancelEditing}
              >
                Cancel
              </Button>
              <Button 
                variant="secondary" 
                flex={1}
                onPress={() => actions.saveProfile({})}
              >
                Save
              </Button>
            </HStack>
          ) : (
            <Button 
              variant="ghost" 
              onPress={actions.startEditing}
            >
              Edit Profile
            </Button>
          )}
          
          <Button 
            variant="danger" 
            onPress={actions.logout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Screen>
  );
}
```

### 3. Connect View and Logic

```javascript
// src/screens/ProfileScreen/ProfileScreen.js (auto-generated)
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ProfileView from './ProfileScreen.view.vrn';
import { useProfileLogic } from './ProfileScreen.logic';

export default function ProfileScreen(props) {
  const navigation = useNavigation();
  const viewModel = useProfileLogic(navigation, props.route);
  
  return <ProfileView {...viewModel} />;
}
```

### 4. Export the Screen

```javascript
// src/screens/ProfileScreen/index.js
export { default } from './ProfileScreen';
```

## Using the Visual Editor

### 1. Open a .view.vrn File
- Open any `.view.vrn` file in VSCode
- Click the "Open Visual Editor" button in the top-right corner
- Or use the command palette: `Ctrl+Shift+P` → "Visual RN: Open Editor"

### 2. Visual Editor Features

#### Component Tree
- See the hierarchy of your components
- Drag and drop to reorder
- Click to select and edit

#### Style Panel
- Edit colors, spacing, typography
- Use color pickers and sliders
- Preview changes instantly

#### Device Preview
- See how your screen looks on different devices
- Switch between iPhone, iPad, Android devices
- Test responsive layouts

#### Bindings Panel
- Connect UI elements to logic functions
- Set up event handlers visually
- Map state to component props

### 3. Making Changes
- All changes are automatically saved to the .view.vrn file
- Changes appear instantly in your React Native app
- No need to manually edit JSX code

## Theming Your App

### 1. Configure Theme

```javascript
// visual-rn.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#007AFF',      // iOS blue
      secondary: '#5856D6',    // iOS purple
      success: '#34C759',      // iOS green
      warning: '#FF9500',      // iOS orange
      error: '#FF3B30',        // iOS red
      
      // Custom brand colors
      brand: '#FF6B6B',
      accent: '#4ECDC4',
      
      // Gray scale
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827'
      }
    },
    
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
      h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
      h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
      body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
      caption: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 }
    },
    
    spacing: {
      // Custom spacing scale (in pixels)
      xs: 2,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      '2xl': 32
    }
  }
};
```

### 2. Using Theme Tokens

```jsx
// Use theme colors
<Text color="primary">Primary color text</Text>
<Text color="gray.600">Gray text</Text>
<Text color="brand">Brand color text</Text>

// Use spacing tokens
<Stack spacing="lg">        {/* 16px spacing */}
<Card p="xl">              {/* 24px padding */}
<Button m="md">            {/* 8px margin */}
```

## Navigation Setup

### 1. Install React Navigation

```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

### 2. Setup Navigation

```javascript
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## State Management

### Local State (in Logic Files)
```javascript
// For component-specific state
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
```

### Global State (Context)
```javascript
// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    // Login logic
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Using Global State in Logic

```javascript
// ProfileScreen.logic.js
import { useAuth } from '../../context/AuthContext';

export function useProfileLogic(navigation) {
  const { user, logout } = useAuth();
  
  const actions = {
    logout: () => {
      logout();
      navigation.navigate('Login');
    }
  };

  return {
    state: { user },
    actions
  };
}
```

## Next Steps

1. **Build More Screens**: Create additional screens following the MVVM pattern
2. **Add Navigation**: Set up tab navigation or drawer navigation
3. **Integrate APIs**: Add data fetching and state management
4. **Customize Theme**: Create your brand's design system
5. **Add Tests**: Write tests for your logic hooks
6. **Deploy**: Build and deploy your app

## Common Patterns

### Loading States
```javascript
// Logic file
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await api.fetchData();
    setData(data);
  } finally {
    setLoading(false);
  }
};

// View file - handle loading in UI
{loading ? (
  <Text>Loading...</Text>
) : (
  <Text>{data}</Text>
)}
```

### Error Handling
```javascript
// Logic file
const [error, setError] = useState(null);

const loadData = async () => {
  try {
    setError(null);
    const data = await api.fetchData();
    setData(data);
  } catch (err) {
    setError(err.message);
  }
};

// View file - show errors
{error && (
  <Card bg="error.100" p={3}>
    <Text color="error.700">{error}</Text>
    <Button onPress={loadData}>Retry</Button>
  </Card>
)}
```

### Form Handling
```javascript
// Logic file
const [form, setForm] = useState({ name: '', email: '' });
const [errors, setErrors] = useState({});

const updateField = (field, value) => {
  setForm(prev => ({ ...prev, [field]: value }));
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: null }));
  }
};

const validateForm = () => {
  const newErrors = {};
  if (!form.name) newErrors.name = 'Name is required';
  if (!form.email) newErrors.email = 'Email is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// View file - form UI
<Stack spacing={3}>
  <Input
    value={form.name}
    onChangeText={(value) => updateField('name', value)}
    placeholder="Name"
    error={errors.name}
  />
  <Input
    value={form.email}
    onChangeText={(value) => updateField('email', value)}
    placeholder="Email"
    type="email"
    error={errors.email}
  />
  <Button onPress={handleSubmit}>Submit</Button>
</Stack>
```

This guide should get you started with Visual React Native. For more advanced topics, check out the [API Documentation](./API.md) and [Best Practices](./best-practices.md).