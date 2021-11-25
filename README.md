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

# Warn

**Currently only supports locale file format**:

```javascript
export default {
  index: {
    confirm: '确认',
  },
};
```

**Not supports**:

```javascript
const Locale = {
  index: {
    confirm: '确认',
  },
};
export default Locale;
```

**The default export file of the language pack is index.ts or index.js**

# Example

## Add

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/main/assets/images/vite-plugin/watch-i18/example/add.gif)

## Modify

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/main/assets/images/vite-plugin/watch-i18/example/modify.gif)

## New Locale

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/main/assets/images/vite-plugin/watch-i18/example/new.gif)

## Param

![example](https://raw.githubusercontent.com/LZS911/LZS911.github.io/main/assets/images/vite-plugin/watch-i18/example/param.gif)
