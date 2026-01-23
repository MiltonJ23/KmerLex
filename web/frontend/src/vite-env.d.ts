/// <reference types="vite/client" />

/**
 * DÉFINITION DES VARIABLES D'ENVIRONNEMENT
 * Ce fichier permet à TypeScript de comprendre les variables définies dans .env
 * et offre l'autocomplétion sur `import.meta.env`.
 */

interface ImportMetaEnv {
  /** * URL de base de l'API Backend.
   * Utilisée par Axios dans `src/services/api.ts`.
   * @example "http://localhost:3000/api/v1"
   */
  readonly VITE_API_URL: string;

  /**
   * Titre de l'application (Optionnel, utile pour le HTML title dynamique).
   */
  readonly VITE_APP_TITLE?: string;

  /**
   * Version actuelle de l'application (utile pour le footer ou les logs).
   */
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}