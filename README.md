# Vortex Provider Vite Plugin

## Usage

```typescript
import vortexProviderPlugin from '@f4team-cn/vite-plugin-vortex-provider';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // config types `ProviderManifest`
    vortexProviderPlugin({
      id: 'ID',
      name: 'provider name',
      description: 'provider description',
      index: 'index.html',
      version: [1, 0, 1],
      author: 'author',
      window: [750, 500],
      permission: []
    })
  ]
});
```