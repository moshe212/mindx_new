# MindX - מערכת אנליטיקה וAI לעסקים

מערכת חכמה לניתוח נתונים עסקיים, צ'אט AI, ויצירת תובנות אוטומטיות.

## תכונות מרכזיות

- **לוח מחוונים אנליטי**: תצוגת KPI מקיפה עם גרפים, דיאגרמות ומדדים עסקיים
- **צ'אט AI**: אינטראקציה בשפה טבעית עם מסד הנתונים הארגוני
- **יועץ עסקי**: כלים אוטומטיים ליצירת מסמכים עסקיים (הצעות מחיר, תוכניות שיווק ועוד)
- **ניהול נתונים**: קליטה וניתוח של קבצים ומידע ארגוני

## טכנולוגיות

- React
- TypeScript
- Tailwind CSS
- Lucide Icons

## התקנה

```bash
# התקנת תלויות
npm install

# הפעלת סביבת פיתוח
npm run dev
```

## הערות

פרויקט זה פותח עבור MindX - מערכת לאנליטיקה עסקית וAI.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
