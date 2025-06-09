# Development Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   - Opens browser automatically at `http://localhost:3000`
   - Hot module replacement for instant updates
   - TypeScript compilation on-the-fly

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | TypeScript type checking without emitting files |

## Development Workflow

### Making Changes
1. Edit TypeScript files in `src/`
2. Changes are automatically reflected in the browser
3. TypeScript errors appear in the terminal and browser console

### Building for Production
```bash
npm run build
```
- Compiles TypeScript to JavaScript
- Bundles and optimizes all assets
- Outputs to `dist/` directory
- Includes source maps for debugging

### Testing Production Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing before deployment

## Project Structure

```
grid-life/
├── src/                    # Source code
│   ├── main.ts            # Application entry point
│   ├── classes/           # Core simulation classes
│   ├── types/             # TypeScript type definitions
│   └── styles/            # CSS stylesheets
├── docs/                  # Documentation
├── index.html             # Main HTML file (Vite entry point)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config for development
├── tsconfig.build.json    # TypeScript config for building
└── package.json           # Dependencies and scripts
```

## Technology Stack

- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript with modern features
- **ES Modules**: Modern JavaScript module system
- **Canvas API**: For rendering the grid and ants
- **CSS**: Styling with modern features

## Development Features

### Hot Module Replacement (HMR)
- Instant updates when you save files
- Preserves application state when possible
- Fast feedback loop for development

### TypeScript Integration
- Real-time type checking
- IntelliSense and autocomplete
- Compile-time error detection

### Modern JavaScript
- ES2020 target for modern browsers
- Tree shaking for optimal bundle size
- Source maps for debugging

## Debugging

### Browser DevTools
- Source maps allow debugging TypeScript directly
- Console shows TypeScript errors with proper line numbers
- Network tab shows module loading

### TypeScript Errors
- Errors appear in terminal during development
- Also shown in browser console
- Use `npm run type-check` for comprehensive checking

## Performance

### Development
- Vite's esbuild provides extremely fast TypeScript compilation
- Hot reload typically under 100ms
- Lazy loading of modules for faster startup

### Production
- Optimized bundles with tree shaking
- CSS and JavaScript minification
- Gzip compression for smaller file sizes

## Deployment

The `dist/` folder contains everything needed for deployment:
- `index.html` - Main HTML file
- `assets/` - Optimized CSS and JavaScript bundles

Deploy the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.ts
```

**TypeScript errors**:
```bash
# Run type checking to see all errors
npm run type-check
```

**Build failures**:
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

### Getting Help

1. Check the browser console for errors
2. Check the terminal for TypeScript errors
3. Ensure all dependencies are installed: `npm install`
4. Try a clean build: `rm -rf dist && npm run build` 