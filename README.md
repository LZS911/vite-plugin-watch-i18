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

## Add

![example](https://raw.githubusercontent.com/LZS911/vite-plugin-watch-i18/main/src/example/add.gif)

## Modify

![example](https://raw.githubusercontent.com/LZS911/vite-plugin-watch-i18/main/src/example/modify.gif)

## New Locale

![example](https://raw.githubusercontent.com/LZS911/vite-plugin-watch-i18/main/src/example/new.gif)

## Param

![example](https://raw.githubusercontent.com/LZS911/vite-plugin-watch-i18/main/src/example/param.gif)
