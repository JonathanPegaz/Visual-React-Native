# Contributing to Visual React Native

We love your input! We want to make contributing to Visual React Native as easy and transparent as possible.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

When you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Report bugs using GitHub's [issue tracker](https://github.com/visual-rn/visual-rn/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/visual-rn/visual-rn/issues/new).

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- VSCode (for extension development)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/visual-rn/visual-rn.git
cd visual-rn

# Install dependencies
npm install

# Bootstrap all packages
npm run bootstrap

# Run development mode
npm run dev
```

### Project Structure

```
visual-rn/
├── packages/
│   ├── core/          # Framework components
│   ├── cli/           # CLI tool
│   └── vscode/        # VSCode extension
├── examples/          # Example projects
├── docs/              # Documentation
└── scripts/           # Build scripts
```

### Testing

```bash
# Run all tests
npm test

# Run tests for a specific package
npm run test --workspace=@visual-rn/core

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@visual-rn/core
```

### Linting

```bash
# Lint all packages
npm run lint

# Fix linting issues
npm run lint:fix
```

## Code Style

- We use TypeScript for type safety
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features

## License

By contributing, you agree that your contributions will be licensed under its MIT License.