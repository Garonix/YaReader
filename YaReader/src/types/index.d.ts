declare module "class-variance-authority" {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module "clsx" {
  export function clsx(...args: any[]): string;
  export type ClassValue = any;
}

declare module "tailwind-merge" {
  export function twMerge(...args: any[]): string;
}

declare module "next-themes" {
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    resolvedTheme: string | undefined;
    themes: string[];
  };
  export interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    storageKey?: string;
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
  }
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}

declare module "next-themes/dist/types" {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    storageKey?: string;
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
  }
}

declare module "@radix-ui/react-slot" {
  export interface SlotProps {
    children?: React.ReactNode;
  }
  export const Slot: React.FC<SlotProps>;
}

declare module "next/link" {
  import { LinkProps as NextLinkProps } from "next/link";
  import * as React from "react";
  
  type LinkProps = {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    children?: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
  
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module "next/font/google" {
  export interface FontOptions {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    display?: string;
    variable?: string;
    preload?: boolean;
    fallback?: string[];
  }
  
  export function Inter(options: FontOptions): {
    className: string;
    style: React.CSSProperties;
    variable: string;
  };
}

declare module "react-swipeable" {
  export interface SwipeableHandlers {
    onTouchStart: React.TouchEventHandler;
    onTouchMove: React.TouchEventHandler;
    onTouchEnd: React.TouchEventHandler;
    onMouseDown: React.MouseEventHandler;
    onClick?: React.MouseEventHandler;
  }

  export interface SwipeableOptions {
    delta?: number;
    preventDefaultTouchmoveEvent?: boolean;
    trackMouse?: boolean;
    trackTouch?: boolean;
    rotationAngle?: number;
    swipeDuration?: number;
    onSwipedLeft?: (eventData: {
      dir: string;
      deltaX: number;
      deltaY: number;
      event: TouchEvent | MouseEvent;
    }) => void;
    onSwipedRight?: (eventData: {
      dir: string;
      deltaX: number;
      deltaY: number;
      event: TouchEvent | MouseEvent;
    }) => void;
    onSwipedUp?: (eventData: {
      dir: string;
      deltaX: number;
      deltaY: number;
      event: TouchEvent | MouseEvent;
    }) => void;
    onSwipedDown?: (eventData: {
      dir: string;
      deltaX: number;
      deltaY: number;
      event: TouchEvent | MouseEvent;
    }) => void;
    onSwiping?: (eventData: {
      dir: string;
      deltaX: number;
      deltaY: number;
      event: TouchEvent | MouseEvent;
    }) => void;
    onSwiped?: (eventData: {
      dir: string;
      deltaX: number;
      deltaY: number;
      event: TouchEvent | MouseEvent;
    }) => void;
  }

  export function useSwipeable(options: SwipeableOptions): SwipeableHandlers;
}

declare module "epubjs" {
  const ePub: (bookPath: string | ArrayBuffer, options?: any) => any;
  export default ePub;
} 