/// <reference types="node" />
/// <reference types="jest" />
/// <reference types="webpack-env" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare const isDevServer: boolean;
declare const hook: string;
declare const weakHook: string;

interface Window {
  shouldRender: boolean;
  tappConfigs?: { [hook: string]: any };
  eventBus?: EventBus;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}

type Callback<T> = (detail: T | undefined) => void;
declare class EventBus {
  private _lastId;
  private _subscriptions;
  private _getNextId;
  register(eventType: string, schema: any): boolean;

  subscribe<T>(
    eventType: string,
    callback: Callback<T>,
  ): {
    unsubscribe(): void;
  };

  subscribe<T>(
    eventType: string,
    replay: boolean,
    callback: Callback<T>,
  ): {
    unsubscribe(): void;
  };

  publish<T>(eventType: string, detail?: T): void;
}
