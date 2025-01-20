import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.node, // Define el entorno global para el navegador
      ecmaVersion: 12, // Configura la versión de ECMAScript (especificada como ES2021 en tu ejemplo)
      sourceType: "module", // Define el tipo de módulo (en este caso, módulo ES)
    },
    plugins: {
      "@eslint/js": pluginJs, // Agrega el plugin @eslint/js correctamente como un objeto
    },
    rules: {
      "no-console": "off", // Permite el uso de console.log
      indent: ["error", 2], // Configura la indentación a 2 espacios
      semi: ["error", "always"], // Exige el uso de punto y coma
    },
  },
  pluginJs.configs.recommended, // Agrega la configuración recomendada de ESLint JS directamente aquí
];
