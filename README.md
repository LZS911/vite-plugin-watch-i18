# Install

```
npm install vite-plugin-watch-i18
```

# Usage

```typescript
import viteWatchI18Plugin from 'vite-plugin-watch-i18';

export default defineConfig({
  plugins: [react(), viteWatchI18Plugin()]
}
```

# Options

| name | defaultValue | type | description |
| :-: | :-: | :-: | :-: |
| funName | t | string | function call name |
| splitCode | # | string | split code |
| languageDir | ['locale/zh-CN', 'locale/en-US'] | string[] | language package path |
| include | ['src/\*\*/\*.{js,jsx,ts,tsx}', '!src/\*\*/\*.d.ts'] | string[] | include directory |

# Example
