# {{PROJECT_NAME_PASCAL}}

A Visual React Native app created with `create-visual-rn`.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- React Native development environment
- VS Code (for visual editing)

### Installation

```bash
# Install dependencies
npm install

# iOS (macOS only)
npx pod-install ios
npm run ios

# Android
npm run android
```

## 🎨 Visual Editing

1. Open the project in VS Code
2. Install the "Visual RN Editor" extension
3. Open any `.view.vrn` file
4. Click "Open Visual Editor" in the top bar
5. Start designing visually!

## 📁 Project Structure

```
{{PROJECT_NAME_KEBAB}}/
├── src/
│   └── screens/
│       └── Home/
│           ├── Home.view.vrn    # Visual layout
│           ├── Home.logic.js    # Business logic
│           └── Home.js          # Connector
├── visual-rn.config.js          # Framework configuration
└── App.js                       # Root component
```

## 📖 Learn More

- [Visual RN Documentation](https://visual-rn.dev/docs)
- [Component Library](https://visual-rn.dev/components)
- [Examples](https://visual-rn.dev/examples)

## 🛠️ Commands

- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run start` - Start Metro bundler
- `visual-rn create screen <name>` - Create new screen
- `visual-rn create component <name>` - Create new component

## 📝 License

This project is licensed under the MIT License.