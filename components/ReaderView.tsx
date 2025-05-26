
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { ReaderSettings } from '../types';
import { LINE_HEIGHT_VALUES } from '../constants';

interface ReaderViewProps {
  content: string | null;
  settings: ReaderSettings;
  initialScrollTop: number | null;
  onScrollPositionChange: (scrollTop: number) => void;
  onProgressChange: (progress: number) => void;
}

interface TextChunk {
  id: number;
  text: string;
  isLoaded: boolean;
}

const CHUNK_SIZE = 2000; // 每个chunk的段落数
const PRELOAD_OFFSET = 10; // 预加载的chunk数量

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



const ReaderView: React.FC<ReaderViewProps> = ({ content, settings, initialScrollTop, onScrollPositionChange, onProgressChange }) => {
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [textChunks, setTextChunks] = useState<TextChunk[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastChunkRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // 将文本分割成段落
  const paragraphs = useMemo(() => {
    if (!content) return [];
    return content.split(/\n\s*\n|\n/).filter(p => p.trim().length > 0);
  }, [content]);

  // 将段落分块
  const chunkedParagraphs = useMemo(() => {
    const chunks: string[][] = [];
    for (let i = 0; i < paragraphs.length; i += CHUNK_SIZE) {
      chunks.push(paragraphs.slice(i, i + CHUNK_SIZE));
    }
    return chunks;
  }, [paragraphs]);

  // 初始化文本块
  useEffect(() => {
    if (chunkedParagraphs.length > 0) {
      const initialChunks = chunkedParagraphs.map((_, index) => ({
        id: index,
        text: index === 0 ? chunkedParagraphs[0].join('\n\n') : '',
        isLoaded: index === 0
      }));
      setTextChunks(initialChunks);
    }
  }, [chunkedParagraphs]);

  // 加载指定chunk的内容
  const loadChunk = useCallback((chunkIndex: number) => {
    if (chunkIndex < 0 || chunkIndex >= chunkedParagraphs.length) return;
    
    setTextChunks(prevChunks => {
      const newChunks = [...prevChunks];
      if (!newChunks[chunkIndex]?.isLoaded) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, paragraphs.length);
        const chunkText = paragraphs.slice(start, end).join('\n\n');
        newChunks[chunkIndex] = { 
          id: chunkIndex, 
          text: chunkText, 
          isLoaded: true 
        };
      }
      return newChunks;
    });
  }, [chunkedParagraphs, paragraphs]);

  // 预加载附近的chunks
  const preloadAdjacentChunks = useCallback((chunkIndex: number) => {
    const start = Math.max(0, chunkIndex - PRELOAD_OFFSET);
    const end = Math.min(chunkedParagraphs.length - 1, chunkIndex + PRELOAD_OFFSET);
    
    for (let i = start; i <= end; i++) {
      if (!textChunks[i]?.isLoaded) {
        loadChunk(i);
      }
    }
  }, [chunkedParagraphs.length, loadChunk, textChunks]);

  // 使用requestAnimationFrame优化滚动性能
  const rafId = useRef<number|null>(null);
  const isScrolling = useRef(false);

  // 设置IntersectionObserver来检测可见区域
  useEffect(() => {
    let observerInstance: IntersectionObserver | null = null;
    
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      if (isScrolling.current) return;
      
      // 使用requestAnimationFrame批量处理
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const chunkIndex = parseInt(entry.target.getAttribute('data-chunk-index') || '0', 10);
            preloadAdjacentChunks(chunkIndex);
          }
        });
      });
    };

    // 使用更高效的观察器配置
    const options: IntersectionObserverInit = {
      root: scrollableRef.current,
      rootMargin: '300px 0px', // 增加预加载区域
      threshold: 0.01 // 降低阈值以提高响应速度
    };

    observerInstance = new IntersectionObserver(handleIntersect, options);
    observer.current = observerInstance;

    // 观察所有chunk
    const chunkElements = scrollableRef.current?.querySelectorAll('[data-chunk-index]');
    chunkElements?.forEach(el => observerInstance?.observe(el));

    // 添加触摸事件监听器来优化移动端滚动
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isScrolling.current = true;
    };
    
    const handleTouchEnd = () => {
      isScrolling.current = false;
    };
    
    const element = scrollableRef.current;
    element?.addEventListener('touchstart', handleTouchStart, { passive: true });
    element?.addEventListener('touchend', handleTouchEnd, { passive: true });
    element?.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (observerInstance) {
        observerInstance.disconnect();
      }
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchend', handleTouchEnd);
      element?.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [preloadAdjacentChunks, textChunks.length]);



  // 初始加载
  useEffect(() => {
    if (isInitialMount.current && textChunks.length > 0) {
      loadChunk(0);
      if (initialScrollTop && scrollableRef.current) {
        scrollableRef.current.scrollTop = initialScrollTop;
      }
      isInitialMount.current = false;
    }
  }, [initialScrollTop, loadChunk, textChunks.length]);

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

  // 直接使用handleScroll，无需debounce
// const debouncedScrollHandler = useRef(debounce(handleScroll, 250)).current;

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
      
      element.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [content, initialScrollTop, handleScroll, calculateAndSetProgress]);
  
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


  if (content === null || textChunks.length === 0) {
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

    // 优化移动端滚动体验
  const scrollableStyles: React.CSSProperties = {
    WebkitOverflowScrolling: 'touch', // 启用iOS上的弹性滚动
    touchAction: 'pan-y', // 优化触摸滚动
    overscrollBehavior: 'contain', // 防止滚动链
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    position: 'relative',
    WebkitTapHighlightColor: 'transparent', // 移除点击高亮
    backfaceVisibility: 'hidden', // 提升渲染性能
    WebkitFontSmoothing: 'antialiased', // 字体抗锯齿
    transform: 'translateZ(0)', // 触发硬件加速
    willChange: 'scroll-position', // 提示浏览器优化滚动
  };

  const readerViewStyles: React.CSSProperties = {
    contain: 'layout paint style',
    scrollBehavior: 'smooth' 
  };

  return (
    <div
      ref={scrollableRef}
      className={`${viewBgClass} ${viewTextClass} ${fontSizeClass} ${lineHeightClass} ${paddingXClass} ${paddingYClass} ${fontFamilyClass} transition-colors duration-200`}
      style={{ ...readerViewStyles, ...scrollableStyles }}
      aria-label="阅读区域"
      tabIndex={-1}
    >
      <div className={`${fontFamilyClass} ${fontSizeClass} ${lineHeightClass}`}>
        {textChunks.map((chunk, index) => (
          <div 
            key={chunk.id}
            ref={index === textChunks.length - 1 ? lastChunkRef : null}
            data-chunk-index={chunk.id}
            className="mb-4 last:mb-0"
          >
            {chunk.isLoaded ? (
              <div className="whitespace-pre-wrap break-words">
                {chunk.text}
              </div>
            ) : (
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      {/* Progress indicator removed from here */}
    </div>
  );
};

export default React.memo(ReaderView);
