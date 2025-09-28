// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',               // ファイルURL で動作させるため相対パスを指定:contentReference[oaicite:2]{index=2}
  plugins: [react()]        // React プラグインを有効化:contentReference[oaicite:3]{index=3}
});
