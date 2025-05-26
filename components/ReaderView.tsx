
import React, { useEffect, useRef, useCallback } from 'react';
import { ReaderSettings } from '../types';
import { LINE_HEIGHT_VALUES } from '../constants';

interface ReaderViewProps {
  content: string | null;
  settings: ReaderSettings;
  initialScrollTop: number | null; // For restoring scroll position
  onScrollPositionChange: (scrollTop: number) => void;
  onProgressChange: (progress: number) => void; // New prop to report progress
}

// Helper to get the closest Tailwind font size class
const getFontSizeClass = (sizeInPx: number): string => {
  if (sizeInPx <= 12) return 'text-xs'; // 12px
  if (sizeInPx <= 14) return 'text-sm'; // 14px
  if (sizeInPx <= 16) return 'text-base'; // 16px
  if (sizeInPx <= 18) return 'text-lg'; // 18px
  if (sizeInPx <= 20) return 'text-xl'; // 20px
  if (sizeInPx <= 24) return 'text-2xl'; // 24px
  if (sizeInPx <= 30) return 'text-3xl'; // 30px
  if (sizeInPx <= 36) return 'text-4xl'; // 36px
  return 'text-base'; // Default
};

// Helper to get the closest Tailwind line height class
const getLineHeightClass = (targetLineHeight: number): string => {
  const mapping: { [key: number]: string } = {
    1.0: 'leading-none',    // 1
    1.25: 'leading-tight',  // 1.25
    1.375: 'leading-snug',  // 1.375
    1.5: 'leading-normal',  // 1.5
    1.625: 'leading-relaxed',// 1.625
    2.0: 'leading-loose',   // 2
  };
  
  let closestVal = LINE_HEIGHT_VALUES[0];
  for (const val of LINE_HEIGHT_VALUES) {
    if (Math.abs(val - targetLineHeight) < Math.abs(closestVal - targetLineHeight)) {
      closestVal = val;
    }
  }
  return mapping[closestVal] || 'leading-normal';
};

// Helper to get Tailwind padding class (1 unit = 0.25rem = 4px)
const getPaddingClass = (axis: 'x' | 'y', paddingInPx: number): string => {
  const tailwindUnits = Math.round(paddingInPx / 4);
  const safeUnit = Math.max(0, Math.min(tailwindUnits, 96)); 
  return axis === 'x' ? `px-${safeUnit}` : `py-${safeUnit}`;
};

// Debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};


const ReaderView: React.FC<ReaderViewProps> = ({ content, settings, initialScrollTop, onScrollPositionChange, onProgressChange }) => {
  const scrollableRef = useRef<HTMLDivElement>(null);

  const calculateAndSetProgress = useCallback(() => {
    if (scrollableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
      let newProgress = 0;
      if (scrollHeight <= clientHeight) { 
        newProgress = 100;
      } else {
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        newProgress = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));
      }
      if (onProgressChange) {
        onProgressChange(newProgress);
      }
    }
  }, [onProgressChange]); 
  
  const handleScroll = useCallback(() => {
    calculateAndSetProgress();
    if (scrollableRef.current) {
      onScrollPositionChange(scrollableRef.current.scrollTop);
    }
  }, [calculateAndSetProgress, onScrollPositionChange, onProgressChange]); // Added onProgressChange for completeness, though calculateAndSetProgress has it

  const debouncedScrollHandler = useRef(debounce(handleScroll, 250)).current;

  useEffect(() => {
    const element = scrollableRef.current;
    if (element) {
      if (initialScrollTop !== null && content) { 
        setTimeout(() => { 
            if(scrollableRef.current) { 
                 scrollableRef.current.scrollTop = initialScrollTop;
                 calculateAndSetProgress(); 
            }
        }, 0);
      } else {
        element.scrollTop = 0;
        calculateAndSetProgress();
      }
      
      element.addEventListener('scroll', debouncedScrollHandler, { passive: true });
      return () => {
        element.removeEventListener('scroll', debouncedScrollHandler);
      };
    }
  }, [content, initialScrollTop, debouncedScrollHandler, calculateAndSetProgress]);
  
   useEffect(() => {
    const timer = setTimeout(() => {
        calculateAndSetProgress();
    }, 50); 
    return () => clearTimeout(timer);
  }, [content, settings, calculateAndSetProgress]); 

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!scrollableRef.current || !content) return;

      const targetElement = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(targetElement.tagName) || 
          targetElement.isContentEditable ||
          (event.metaKey || event.altKey || event.ctrlKey)) {
        return;
      }
      
      let handled = false;
      const scrollAmountSmall = settings.fontSize * settings.lineHeight * 3; 
      const scrollAmountLarge = scrollableRef.current.clientHeight * 0.9;

      switch (event.key) {
        case 'ArrowDown':
          scrollableRef.current.scrollTop += scrollAmountSmall;
          handled = true;
          break;
        case 'ArrowUp':
          scrollableRef.current.scrollTop -= scrollAmountSmall;
          handled = true;
          break;
        case ' ': 
        case 'PageDown':
          scrollableRef.current.scrollTop += scrollAmountLarge * (event.key === ' ' && event.shiftKey ? -1 : 1);
          handled = true;
          break;
        case 'PageUp':
          scrollableRef.current.scrollTop -= scrollAmountLarge;
          handled = true;
          break;
        case 'Home':
          scrollableRef.current.scrollTop = 0;
          handled = true;
          break;
        case 'End':
          scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
          handled = true;
          break;
      }

      if (handled) {
        event.preventDefault();
        calculateAndSetProgress(); 
        if (scrollableRef.current) {
            onScrollPositionChange(scrollableRef.current.scrollTop);
        }
      }
    };

    if (content) { 
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [content, settings.fontSize, settings.lineHeight, calculateAndSetProgress, onScrollPositionChange]);


  if (content === null) {
    return null;
  }

  const fontSizeClass = getFontSizeClass(settings.fontSize);
  const lineHeightClass = getLineHeightClass(settings.lineHeight);
  const paddingXClass = getPaddingClass('x', settings.paddingX);
  const paddingYClass = getPaddingClass('y', settings.paddingY);
  const fontFamilyClass = settings.fontFamily;

  let viewBgClass = 'bg-white dark:bg-slate-900';
  let viewTextClass = 'text-gray-800 dark:text-slate-200';
  
  if (settings.theme === 'sepia') {
    viewBgClass = 'bg-[#fbf0d9]';
    viewTextClass = 'text-[#5b4636]';
  }

  const readerViewStyles: React.CSSProperties = {
    contain: 'layout paint style',
    scrollBehavior: 'smooth' 
  };

  return (
    <div 
      ref={scrollableRef}
      className={`w-full h-full overflow-y-auto overscroll-y-contain transition-all duration-300 ease-in-out ${paddingXClass} ${paddingYClass} relative ${viewBgClass} ${viewTextClass} focus:outline-none`}
      style={readerViewStyles}
      aria-label="阅读区域"
      tabIndex={-1} 
    >
      <pre
        className={`whitespace-pre-wrap break-words ${fontFamilyClass} ${fontSizeClass} ${lineHeightClass}`}
        aria-live="polite"
      >
        {content}
      </pre>
      {/* Progress indicator removed from here */}
    </div>
  );
};

export default React.memo(ReaderView);
