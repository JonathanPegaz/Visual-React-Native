# Visual React Native 🎨

> MVVM Framework for React Native with Visual Editor in VSCode

Visual RN revolutionizes React Native development by separating presentation from business logic, enabling designers to visually edit UI without touching code.

## ✨ Features

- **🎯 True MVVM Architecture** - Complete separation of View and Logic
- **🎨 Visual Editor in VSCode** - Edit UI visually without coding
- **📝 Clean Generated Code** - No lock-in, readable output
- **🚀 Designer-Developer Collaboration** - Work in parallel without conflicts
- **📦 Rich Component Library** - Pre-built, customizable components
- **🎭 Theme System** - Design tokens and variants support
- **⚡ Hot Reload** - See changes instantly
- **📱 Responsive Design** - Adaptive layouts for all screens

## 🚀 Quick Start

### Create a new project

```bash
npx create-visual-rn my-app
cd my-app
code .
```

### Project Structure

```
my-app/
├── screens/
│   └── HomeScreen/
│       ├── HomeScreen.view.vrn    # Visual layout (designers edit this)
│       ├── HomeScreen.logic.js    # Business logic (developers edit this)
│       └── HomeScreen.js          # Auto-generated connector
├── components/
├── theme/
└── App.js
```

## 📖 How It Works

### 1. Developers write logic

```javascript
// ProfileScreen.logic.js
export function useProfileLogic() {
  const [user, setUser] = useState(null);
  
  const logout = async () => {
    await auth.signOut();
    navigation.navigate('Login');
  };
  
  return {
    state: { user },
    actions: { logout }
  };
}
```

### 2. Designers create UI visually

```jsx
// ProfileScreen.view.vrn
export default function ProfileView({ state, actions }) {
  return (
    <Screen safe>
      <Stack spacing={4} p={5}>
        <Avatar source={state.user?.avatar} size="xl" />
        <Text variant="h1">{state.user?.name}</Text>
        <Button onPress={actions.logout}>Logout</Button>
      </Stack>
    </Screen>
  );
}
```

### 3. Framework connects them automatically

The framework automatically generates the connector file that binds View and Logic together.

## 🧩 Component Library

### Layout Components
- `<Screen>` - Main container with safe area
- `<Stack>` - Vertical layout with spacing
- `<HStack>` - Horizontal layout
- `<Grid>` - Responsive grid system

### UI Components
- `<Text>` - Typography with variants
- `<Button>` - Interactive buttons
- `<Input>` - Text input fields
- `<Card>` - Container with shadow
- `<Avatar>` - User avatars
- `<Image>` - Optimized images

## 🎨 Visual Editor Features

- **Drag & Drop** - Rearrange components visually
- **Style Editor** - Color pickers, sliders, visual controls
- **Device Preview** - See how it looks on different devices
- **Theme Editor** - Modify design tokens visually
- **Bindings Panel** - Connect UI to logic easily
- **Real-time Updates** - Changes appear instantly

## 📚 Documentation

- [Getting Started](https://visual-rn.dev/docs/getting-started)
- [Component Reference](https://visual-rn.dev/docs/components)
- [Theme System](https://visual-rn.dev/docs/theming)
- [Best Practices](https://visual-rn.dev/docs/best-practices)
- [API Reference](https://visual-rn.dev/docs/api)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repo
git clone https://github.com/visual-rn/visual-rn.git
cd visual-rn

# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap

# Start development
npm run dev
```

## 📦 Packages

This monorepo contains:

- `@visual-rn/core` - Core framework and components
- `create-visual-rn` - CLI for creating new projects
- `visual-rn-editor` - VSCode extension

## 🗺️ Roadmap

### MVP (Current)
- ✅ 10 core components
- ✅ Basic visual editor
- ✅ Theme system
- ✅ CLI tool

### v1.0 (Coming Soon)
- 🔄 20+ components
- 🔄 Animations support
- 🔄 Figma import/export
- 🔄 Device preview

### v2.0 (Future)
- 🎯 Real-time collaboration
- 🎯 AI-powered suggestions
- 🎯 Component marketplace
- 🎯 Cloud sync

## 📄 License

MIT © Visual RN Team

## 🙏 Acknowledgments

Inspired by SwiftUI, Tailwind CSS, and the React Native community.

---

<p align="center">
  Made with ❤️ for the React Native community
</p>