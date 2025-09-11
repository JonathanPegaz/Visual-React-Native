# Visual React Native - API Documentation

## Core Components

### Layout Components

#### `<Screen>`
Main container component with safe area handling.

```jsx
<Screen safe bg="gray.50" p={4}>
  {children}
</Screen>
```

**Props:**
- `safe?: boolean` - Enable safe area padding (default: false)
- `bg?: string` - Background color token
- `p?: number | string` - Padding (all sides)
- `px?: number | string` - Horizontal padding
- `py?: number | string` - Vertical padding
- `pt?: number | string` - Top padding
- `pb?: number | string` - Bottom padding
- `pl?: number | string` - Left padding
- `pr?: number | string` - Right padding

#### `<Stack>`
Vertical layout container with spacing.

```jsx
<Stack spacing={4} align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>
```

**Props:**
- `spacing?: number` - Space between children (in grid units)
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Cross-axis alignment
- `justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'` - Main-axis alignment
- `flex?: number` - Flex grow value
- `p?: number | string` - Padding (all sides)

#### `<HStack>`
Horizontal layout container with spacing.

```jsx
<HStack spacing={2} justify="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</HStack>
```

**Props:**
- `spacing?: number` - Space between children (in grid units)
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Cross-axis alignment
- `justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'` - Main-axis alignment
- `flex?: number` - Flex grow value
- `wrap?: boolean` - Allow wrapping to next line

#### `<Grid>`
Responsive grid layout system.

```jsx
<Grid cols={2} spacing={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Grid>
```

**Props:**
- `cols?: number | object` - Number of columns or responsive object
- `spacing?: number` - Space between grid items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Item alignment

### UI Components

#### `<Text>`
Typography component with design system variants.

```jsx
<Text variant="h1" color="primary" align="center">
  Hello World
</Text>
```

**Props:**
- `variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'overline'` - Typography variant
- `color?: string` - Color token
- `align?: 'left' | 'center' | 'right'` - Text alignment
- `size?: number | string` - Custom font size
- `weight?: 'normal' | 'bold' | '100' | '200' | ... | '900'` - Font weight
- `onPress?: function` - Make text pressable

#### `<Button>`
Interactive button component with multiple variants.

```jsx
<Button variant="primary" size="large" onPress={handlePress}>
  Click Me
</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'` - Button style variant
- `size?: 'small' | 'medium' | 'large'` - Button size
- `disabled?: boolean` - Disable button interaction
- `loading?: boolean` - Show loading state
- `onPress: function` - Press handler (required)
- `leftIcon?: ReactNode` - Icon on the left
- `rightIcon?: ReactNode` - Icon on the right

#### `<Input>`
Text input field with validation support.

```jsx
<Input
  placeholder="Enter your name"
  value={value}
  onChangeText={setValue}
  error={error}
/>
```

**Props:**
- `value: string` - Input value
- `onChangeText: function` - Change handler
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message
- `type?: 'text' | 'email' | 'password' | 'number'` - Input type
- `disabled?: boolean` - Disable input
- `multiline?: boolean` - Allow multiple lines
- `rows?: number` - Number of rows (multiline only)

#### `<Card>`
Container component with shadow and rounded corners.

```jsx
<Card p={4} shadow="medium">
  <Text>Card content</Text>
</Card>
```

**Props:**
- `shadow?: 'none' | 'small' | 'medium' | 'large'` - Shadow level
- `p?: number | string` - Padding (all sides)
- `bg?: string` - Background color token
- `borderRadius?: number` - Custom border radius

#### `<Avatar>`
User avatar component with fallback support.

```jsx
<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="large"
  fallback="JD"
/>
```

**Props:**
- `source?: ImageSource` - Avatar image source
- `size?: 'small' | 'medium' | 'large' | 'xl' | number` - Avatar size
- `fallback?: string` - Fallback text (usually initials)
- `shape?: 'circle' | 'square'` - Avatar shape

#### `<Image>`
Optimized image component with loading states.

```jsx
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  aspectRatio={16/9}
  borderRadius={8}
/>
```

**Props:**
- `source: ImageSource` - Image source (required)
- `aspectRatio?: number` - Aspect ratio (width/height)
- `fit?: 'cover' | 'contain' | 'fill' | 'stretch'` - Resize mode
- `borderRadius?: number` - Border radius
- `loading?: boolean` - Show loading indicator

## Theme System

### Design Tokens

#### Colors
```javascript
const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    // ... more shades
    900: '#111827'
  }
};
```

#### Spacing
```javascript
const spacing = {
  0: 0,
  1: 4,   // 4px
  2: 8,   // 8px
  3: 12,  // 12px
  4: 16,  // 16px
  5: 20,  // 20px
  6: 24,  // 24px
  8: 32,  // 32px
  10: 40, // 40px
  12: 48, // 48px
  16: 64, // 64px
  20: 80, // 80px
  24: 96  // 96px
};
```

#### Typography
```javascript
const typography = {
  h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
  overline: { fontSize: 12, fontWeight: '600', lineHeight: 16, textTransform: 'uppercase' }
};
```

### Theme Configuration

```javascript
// visual-rn.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#FF6B6B',
      // Override other colors
    },
    typography: {
      h1: { fontSize: 36 },
      // Override typography
    },
    spacing: {
      // Override spacing scale
    }
  }
};
```

## MVVM Architecture

### Logic Hook Pattern

```javascript
// MyScreen.logic.js
export function useMyScreenLogic(navigation, route) {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  });

  const actions = {
    async loadData() {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const data = await api.fetchData();
        setState(prev => ({ ...prev, data, loading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, error, loading: false }));
      }
    },

    navigateToDetail(item) {
      navigation.navigate('Detail', { item });
    }
  };

  useEffect(() => {
    actions.loadData();
  }, []);

  return {
    state,
    actions
  };
}
```

### View Component Pattern

```jsx
// MyScreen.view.vrn
export default function MyScreenView({ state, actions }) {
  if (state.loading) {
    return (
      <Screen safe>
        <Stack align="center" justify="center" flex={1}>
          <Text>Loading...</Text>
        </Stack>
      </Screen>
    );
  }

  if (state.error) {
    return (
      <Screen safe>
        <Stack p={4}>
          <Text color="error">{state.error.message}</Text>
          <Button onPress={actions.loadData}>Retry</Button>
        </Stack>
      </Screen>
    );
  }

  return (
    <Screen safe>
      <Stack p={4}>
        {state.data?.map(item => (
          <Card key={item.id} onPress={() => actions.navigateToDetail(item)}>
            <Text>{item.title}</Text>
          </Card>
        ))}
      </Stack>
    </Screen>
  );
}
```

## CLI Commands

### Create Project
```bash
npx create-visual-rn my-app
```

Options:
- `--typescript` - Use TypeScript
- `--template <name>` - Use specific template

### Available Templates
- `basic` - Basic app with navigation
- `tabs` - App with tab navigation
- `drawer` - App with drawer navigation
- `todo` - Todo app example

## VSCode Extension

### Commands
- `Visual RN: Open Editor` - Open visual editor for .vrn files
- `Visual RN: Generate Component` - Generate new component
- `Visual RN: Update Theme` - Update theme configuration

### File Extensions
- `.view.vrn` - View component files (editable in visual editor)
- `.logic.js` - Logic hook files
- `visual-rn.config.js` - Project configuration

## Best Practices

### Component Organization
```
screens/
  HomeScreen/
    index.js           # Export file
    HomeScreen.js      # Auto-generated connector
    HomeScreen.view.vrn # View component (designers edit)
    HomeScreen.logic.js # Logic hook (developers edit)
    HomeScreen.test.js  # Tests
```

### State Management
- Use built-in React state for component-local state
- Use context or external stores for global state
- Keep state in logic files, never in view files

### Styling
- Use design tokens instead of hardcoded values
- Prefer component variants over custom styles
- Use spacing props for consistent layouts

### Testing
- Test logic hooks separately from view components
- Use React Testing Library for component tests
- Mock navigation and external dependencies