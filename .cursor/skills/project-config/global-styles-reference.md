# Global Styles & UnoCSS Configuration

## Overview

This project uses **UnoCSS** for atomic CSS and a minimal `index.css` for essential global styles.

## Style Architecture

### UnoCSS (Primary)

UnoCSS handles most styling through atomic classes. Configuration is in `uno.config.ts`:

```typescript
import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // Default preset
    presetAttributify(), // Attribute mode
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
  },
  theme: {
    colors: {
      // Extend theme colors here
    },
  },
})
```

### Global CSS (Minimal)

`src/index.css` contains only essential global styles:

```css
/* Use UnoCSS for most styles, keep only necessary global styles here */

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Import Order

In `main.tsx`, imports must follow this order:

```typescript
import 'antd/dist/reset.css' // Ant Design reset first
import 'virtual:uno.css' // UnoCSS styles
import './index.css' // Global styles last
```

## Best Practices

### ✅ DO

- Use UnoCSS atomic classes for styling
- Use shortcuts like `flex-center`, `flex-between` when available
- Keep `index.css` minimal - only essential global styles
- Use attribute mode for conditional styling: `<div flex items-center justify-between>`

### ❌ DON'T

- Don't add component-specific styles to `index.css`
- Don't create separate CSS files for components (use UnoCSS instead)
- Don't use inline styles unless necessary (prefer UnoCSS classes)

## Adding New Styles

### Adding UnoCSS Shortcuts

Edit `uno.config.ts`:

```typescript
shortcuts: {
  'flex-center': 'flex items-center justify-center',
  'flex-between': 'flex items-center justify-between',
  'card': 'bg-white rounded-lg shadow p-4', // New shortcut
}
```

### Adding Global Styles

Only add to `index.css` if:

- It's truly global (applies to all elements)
- It can't be achieved with UnoCSS
- It's a CSS reset or base style

## Examples

### Using UnoCSS Classes

```tsx
// ✅ Good - Use UnoCSS
<div className="flex items-center justify-between p-4 bg-white rounded-lg">
  <span>Content</span>
  <button>Action</button>
</div>

// ✅ Good - Use shortcuts
<div className="flex-center p-4">
  <span>Centered content</span>
</div>

// ✅ Good - Attribute mode
<div flex items-center justify-between p-4>
  <span>Content</span>
</div>
```

### Avoiding Custom CSS

```tsx
// ❌ Bad - Don't create custom CSS files
import './Component.css'

// ✅ Good - Use UnoCSS instead
<div className="flex items-center gap-4">
```
