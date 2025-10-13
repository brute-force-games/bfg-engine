# BFG UI Icons

This directory contains all centralized icon components for the Brute Force Games UI library.

## Available Icons

All icons accept the following props:

```typescript
interface IconProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}
```

### Icon List

| Icon Name | Default Size | Description |
|-----------|--------------|-------------|
| `ArrowRight` | 24x24 | Right-pointing arrow, commonly used for navigation |
| `CheckCircle` | 24x24 | Circle with checkmark, indicates success or completion |
| `Clear` | 16x16 | X icon, used for clearing or closing |
| `ContentCopy` | 24x24 | Copy to clipboard icon |
| `ExpandMore` | 20x20 | Downward chevron, used for expanding/collapsing content |
| `Gamepad` | 24x24 | Game controller icon |
| `Groups` | 24x24 | Multiple people icon, represents groups or teams |
| `History` | 20x20 | Clock with counter-clockwise arrow, represents history or undo |
| `Link` | 24x24 | Chain link icon |
| `OpenInNew` | 24x24 | External link icon, indicates opening in new window/tab |
| `People` | 48x48 | Two people icon, represents users or participants |
| `PersonRemove` | 16x16 | Person with minus sign, for removing users |
| `PlayArrow` | 16x16 | Play button triangle |
| `Refresh` | 16x16 | Circular arrow, for refreshing or reloading |
| `Settings` | 16x16 | Gear icon, for settings and configuration |
| `Wifi` | 24x24 | WiFi signal icon, represents network connectivity |

## Usage

```tsx
import { CheckCircle, Settings, Gamepad } from 'bfg-ui-components';

function MyComponent() {
  return (
    <div>
      <CheckCircle />
      <Settings width={20} height={20} />
      <Gamepad style={{ color: '#1976d2' }} />
    </div>
  );
}
```

## Customization

All icons:
- Use `currentColor` for fill, so they inherit text color from parent
- Accept custom `width` and `height` props
- Accept `style` prop for additional customization
- Maintain a 24x24 viewBox for consistent scaling

## Adding New Icons

When adding new icons:

1. Create a new file in this directory (e.g., `MyIcon.tsx`)
2. Use the standard `IconProps` interface
3. Set reasonable default width/height
4. Ensure SVG uses `fill="currentColor"` for color inheritance
5. Add to `index.ts` exports
6. Update this README with the new icon details

