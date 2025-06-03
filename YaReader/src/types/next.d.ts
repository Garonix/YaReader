import React from 'react';

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string, options?: { shallow?: boolean }) => void;
    replace: (url: string, options?: { shallow?: boolean }) => void;
    prefetch: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };

  export function usePathname(): string;

  export function useSearchParams(): URLSearchParams;

  export function useParams<T = Record<string, string | string[]>>(): T;

  export interface NavigateOptions {
    scroll?: boolean;
  }

  export function useNavigation(): {
    navigate: (href: string, options?: NavigateOptions) => void;
  };
} 