/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    PWD: string;
  }
  
  interface Process {
    browser: boolean;
  }
  
  interface Global {
    document: Document;
    window: Window & typeof globalThis;
    HTMLElement: HTMLElement;
  }
  
  type Timeout = ReturnType<typeof setTimeout>;
} 