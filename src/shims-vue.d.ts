/// <reference types="vite/client" />

declare module 'element-plus/dist/locale/zh-tw.mjs';

declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
