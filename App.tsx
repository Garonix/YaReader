
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ReaderSettings, RecentFile } from './types';
import { DEFAULT_SETTINGS, RECENT_FILES_STORAGE_KEY, MAX_RECENT_FILES } from './constants';
import ReaderView from './components/ReaderView';
import SettingsPanel from './components/SettingsPanel';
import { SettingsIcon, UploadIcon, ClockIcon, ExpandIcon } from './components/Icons';

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isRecentFilesOpen, setIsRecentFilesOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialScrollTop, setInitialScrollTop] = useState<number>(0);
  const [readerScrollProgress, setReaderScrollProgress] = useState<number>(0);
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recentFilesButtonRef = useRef<HTMLButtonElement>(null);
  const recentFilesDropdownRef = useRef<HTMLDivElement>(null);

  // Load initial settings and recent files
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('readerSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (e) {
      console.error("未能解析已保存的设置:", e);
    }

    try {
      const savedRecentFiles = localStorage.getItem(RECENT_FILES_STORAGE_KEY);
      let loadedRecentFiles: RecentFile[] = [];
      if (savedRecentFiles) {
        loadedRecentFiles = JSON.parse(savedRecentFiles);
      }
      loadedRecentFiles.sort((a, b) => b.lastAccessed - a.lastAccessed);
      setRecentFiles(loadedRecentFiles);

      if (loadedRecentFiles.length > 0 && !fileContent) { // Load last file only if no file is currently loaded
        const lastOpenFile = loadedRecentFiles[0];
        setFileName(lastOpenFile.name);
        setFileContent(lastOpenFile.content);
        setInitialScrollTop(lastOpenFile.scrollTop || 0);
      }
    } catch (e) {
      console.error("未能解析最近文件列表:", e);
    }
  }, []); // Removed fileContent from dependency array to prevent re-loading on content change

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('readerSettings', JSON.stringify(settings));
    } catch (e) {
      console.error("未能保存设置:", e);
    }
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  // Save recent files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_FILES_STORAGE_KEY, JSON.stringify(recentFiles));
    } catch (e) {
      console.error("未能保存最近文件列表:", e);
    }
  }, [recentFiles]);

  // Handle click outside for recent files dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isRecentFilesOpen &&
        recentFilesButtonRef.current &&
        !recentFilesButtonRef.current.contains(event.target as Node) &&
        recentFilesDropdownRef.current &&
        !recentFilesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRecentFilesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRecentFilesOpen]);

  // Fullscreen API handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenActive(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        // setIsFullscreenActive(true); // Listener will handle this
      } catch (err) {
        console.error(`全屏模式错误: ${err.message} (${err.name})`);
        setError("无法进入全屏模式。请确保浏览器支持或用户已授权。");
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        // setIsFullscreenActive(false); // Listener will handle this
      }
    }
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        if (fileContent) { // Only allow F11 if content is loaded
          event.preventDefault();
          toggleFullscreen();
        }
      } else if (event.key === 'f' || event.key === 'F') {
        const target = event.target as HTMLElement;
        // Prevent toggling fullscreen if an input field, button, or contentEditable has focus, or settings panel is open
        if (
          fileContent &&
          !isSettingsPanelOpen && 
          !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName) &&
          !target.isContentEditable &&
          !event.ctrlKey && !event.metaKey && !event.altKey 
        ) {
          event.preventDefault();
          toggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [toggleFullscreen, fileContent, isSettingsPanelOpen]);


  const addOrUpdateRecentFile = useCallback((fileEntry: RecentFile) => {
    setRecentFiles(prevRecentFiles => {
      const otherFiles = prevRecentFiles.filter(f => f.name !== fileEntry.name);
      const updatedList = [fileEntry, ...otherFiles];
      return updatedList.slice(0, MAX_RECENT_FILES).sort((a, b) => b.lastAccessed - a.lastAccessed);
    });
  }, []); 

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];

    if (file) {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const currentFileName = file.name;
          
          const existingRecentEntry = recentFiles.find(rf => rf.name === currentFileName);
          const newScrollTop = existingRecentEntry ? existingRecentEntry.scrollTop : 0;
          
          const newRecentFileEntry: RecentFile = {
            name: currentFileName,
            content: content,
            lastAccessed: Date.now(),
            scrollTop: newScrollTop,
          };

          addOrUpdateRecentFile(newRecentFileEntry);
          setFileContent(content);
          setFileName(currentFileName);
          setInitialScrollTop(newScrollTop); 
          if (content.length === 0 || content.trim().length === 0) {
            setReaderScrollProgress(100); 
          }
        };
        reader.onerror = () => {
          setError("读取文件出错。");
        };
        reader.readAsText(file, 'UTF-8');
      } else {
        setError("文件类型无效。请上传 .txt 文件。");
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  }, [recentFiles, addOrUpdateRecentFile]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleSettingsChange = (newSettings: ReaderSettings) => {
    setSettings(newSettings);
  };

  const handleScrollPositionChange = useCallback((scrollTop: number) => {
    if (fileName) { 
      setRecentFiles(prev => {
        const now = Date.now();
        let fileUpdated = false;
        const updatedList = prev.map(rf => {
          if (rf.name === fileName) {
            fileUpdated = true;
            return { ...rf, scrollTop: scrollTop, lastAccessed: now };
          }
          return rf;
        });

        if (!fileUpdated && fileContent) { // Should typically not happen if fileName is set
             const newEntry: RecentFile = { name: fileName, content: fileContent, lastAccessed: now, scrollTop };
             updatedList.push(newEntry);
        }
        
        return updatedList
                .sort((a, b) => b.lastAccessed - a.lastAccessed)
                .slice(0, MAX_RECENT_FILES);
      });
    }
  }, [fileName, fileContent]); 

  const handleSelectRecentFile = (selectedFile: RecentFile) => {
    setFileContent(selectedFile.content);
    setFileName(selectedFile.name);
    setInitialScrollTop(selectedFile.scrollTop);
    
    addOrUpdateRecentFile({ ...selectedFile, lastAccessed: Date.now() });
    setIsRecentFilesOpen(false);
     if (selectedFile.content.length === 0 || selectedFile.content.trim().length === 0) {
      setReaderScrollProgress(100);
    }
  };

  const handleProgressChange = useCallback((progress: number) => {
    setReaderScrollProgress(progress);
  }, []);

  const appBgColor = settings.theme === 'sepia' ? 'bg-[#f4e6c3]' : 'bg-gray-100';
  const appTextColor = settings.theme === 'sepia' ? 'text-[#503f31]' : 'text-gray-800';
  
  const headerBgColor = settings.theme === 'sepia' ? 'bg-[#ede0c8]' : 'bg-white';
  const headerTextColor = settings.theme === 'sepia' ? 'text-[#6e5544]' : 'text-gray-700';
  const headerIconColor = settings.theme === 'sepia' ? 'text-[#6e5544]' : 'text-gray-700';
  const fileNameColor = settings.theme === 'sepia' ? 'text-[#6e5544]' : 'text-gray-600';

  const buttonClass = (isPrimary: boolean = true) => `flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base
    ${settings.theme === 'sepia' 
      ? (isPrimary ? 'bg-[#af8f6f] text-white hover:bg-[#9a7c5e] focus:ring-[#7a5c3d]' : 'bg-[#d4c0a1] text-[#5b4636] hover:bg-[#c8b89a] focus:ring-[#7a5c3d]')
      : (isPrimary ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:ring-indigo-500')
    }`;
  
  const iconButtonClass = `p-2 rounded-full transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 
    ${settings.theme === 'sepia' ? 'hover:bg-[#d4c0a1] focus:ring-[#7a5c3d]' : 'hover:bg-gray-200 dark:hover:bg-slate-600 focus:ring-indigo-500 dark:focus:ring-indigo-400'}`;


  const welcomeIconColor = settings.theme === 'sepia' ? 'text-[#a58a66]' : 'text-gray-400 dark:text-gray-500';
  const welcomeTextColor = settings.theme === 'sepia' ? 'text-[#6e5544]' : 'text-gray-700 dark:text-gray-300';
  const welcomeSubTextColor = settings.theme === 'sepia' ? 'text-[#8c6d3e]' : 'text-gray-500 dark:text-gray-400';
  
  const dropdownBg = settings.theme === 'sepia' ? 'bg-[#f8f0e3]' : 'bg-white dark:bg-slate-700';
  const dropdownBorder = settings.theme === 'sepia' ? 'border-[#d4c0a1]' : 'border-gray-300 dark:border-slate-600';
  const dropdownItemHoverBg = settings.theme === 'sepia' ? 'hover:bg-[#e0d1b6]' : 'hover:bg-gray-100 dark:hover:bg-slate-600';
  const dropdownTextColor = settings.theme === 'sepia' ? 'text-[#5b4636]' : 'text-gray-700 dark:text-slate-200';

  let progressIndicatorBgClass = 'bg-gray-800 bg-opacity-70 dark:bg-slate-700 dark:bg-opacity-70';
  let progressIndicatorTextClass = 'text-white dark:text-slate-100';

  if (settings.theme === 'sepia') {
    progressIndicatorBgClass = 'bg-[#7d6a55] bg-opacity-70';
    progressIndicatorTextClass = 'text-[#fbf0d9]';
  }

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${appBgColor} ${appTextColor} dark:bg-slate-800 dark:text-slate-200`}>
      {!isFullscreenActive && (
        <header className={`shadow-md p-3 sm:p-4 flex justify-between items-center sticky top-0 z-40 transition-colors duration-300 ${headerBgColor} dark:bg-slate-700`}>
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={handleImportClick}
              className={buttonClass()}
              aria-label={fileContent ? "更换TXT文件" : "上传TXT文件"}
            >
              <UploadIcon className={`w-5 h-5 ${settings.theme === 'sepia' || settings.theme === 'light' ? 'text-white' : 'text-white'}`} /> {/* Ensure contrast */}
              <span className={`${settings.theme === 'sepia' || settings.theme === 'light' ? 'text-white' : 'text-white'}`}>{fileContent ? "更换" : "上传"}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
              className="hidden"
              aria-hidden="true"
            />
            <div className="relative">
              <button
                ref={recentFilesButtonRef}
                onClick={() => setIsRecentFilesOpen(prev => !prev)}
                className={`${buttonClass(false)} ${recentFiles.length === 0 ? 'hidden sm:hidden' : ''}`}
                aria-label="打开最近文件列表"
                aria-haspopup="true"
                aria-expanded={isRecentFilesOpen}
              >
                <ClockIcon className={`w-5 h-5 ${settings.theme === 'sepia' ? 'text-[#5b4636]' : 'text-slate-700 dark:text-slate-200'}`} />
                <span className="hidden sm:inline">最近</span>
              </button>
              {isRecentFilesOpen && recentFiles.length > 0 && (
                <div
                  ref={recentFilesDropdownRef}
                  className={`absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg py-1 z-50 border ${dropdownBg} ${dropdownBorder}`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="recent-files-button"
                >
                  {recentFiles.map((rf) => (
                    <button
                      key={rf.name}
                      onClick={() => handleSelectRecentFile(rf)}
                      className={`block w-full text-left px-4 py-2 text-sm ${dropdownTextColor} ${dropdownItemHoverBg} truncate`}
                      role="menuitem"
                      title={rf.name}
                    >
                      {rf.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {fileName && <span className={`ml-2 sm:ml-3 text-xs sm:text-sm truncate max-w-[calc(100vw-320px)] sm:max-w-[100px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[250px] ${fileNameColor} dark:text-slate-300`} title={fileName}>{fileName}</span>}
          </div>
          
          <div className="flex items-center gap-x-1 sm:gap-x-2">
            {fileContent && (
              <>
                <button
                  onClick={toggleFullscreen}
                  className={iconButtonClass}
                  aria-label="进入全屏/专注模式"
                  title="进入全屏/专注模式 (F11 或 f)"
                >
                  <ExpandIcon className={`w-6 h-6 ${headerIconColor} dark:text-slate-300`} />
                </button>
                <button
                  onClick={() => setIsSettingsPanelOpen(true)}
                  className={iconButtonClass}
                  aria-label="打开阅读器设置"
                  title="打开阅读器设置"
                >
                  <SettingsIcon className={`w-6 h-6 ${headerIconColor} dark:text-slate-300`} />
                </button>
              </>
            )}
          </div>
        </header>
      )}

      <main className={`flex-grow overflow-hidden relative ${isFullscreenActive ? 'h-full w-full fixed inset-0 z-30' : ''}`}>
        {error && (
          <div 
            className={`p-4 m-4 border rounded text-center transition-all duration-300 ease-in-out animate-pulse
              ${settings.theme === 'sepia' ? 'bg-[#f8d7da] border-[#f5c6cb] text-[#721c24]' : 'bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200'}`}
            role="alert"
          >
            {error}
          </div>
        )}
        {fileContent !== null ? ( 
          <ReaderView 
            content={fileContent} 
            settings={settings} 
            initialScrollTop={initialScrollTop}
            onScrollPositionChange={handleScrollPositionChange}
            onProgressChange={handleProgressChange}
          />
        ) : (
          <div className={`flex flex-col items-center justify-center h-full text-center p-8 ${isFullscreenActive ? 'pt-16' : ''}`}> {/* Add padding top in fullscreen if header is hidden */}
            <UploadIcon className={`w-16 h-16 mb-4 transition-transform duration-300 ease-out group-hover:scale-110 ${welcomeIconColor}`} />
            <h2 className={`text-2xl font-semibold mb-2 ${welcomeTextColor}`}>欢迎使用 雅阅</h2>
            <p className={`max-w-md ${welcomeSubTextColor}`}>
              上传本地 .txt 文件开始您的阅读之旅。 
              调整设置以获得个性化且舒适的体验。
            </p>
             <button
                onClick={handleImportClick}
                className={`${buttonClass()} group mt-6 px-6 py-3 text-lg transform hover:scale-105 hover:shadow-lg active:scale-95`}
                aria-label="选择并上传TXT文件"
              >
                <UploadIcon className="w-5 h-5 transition-transform duration-300 ease-out group-hover:rotate-[-5deg]" />
                <span>上传 .txt 文件</span>
            </button>
          </div>
        )}
        {fileContent && (
          <div 
            className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 text-xs px-2.5 py-1 rounded-full shadow-md transition-opacity duration-200 hover:bg-opacity-80 ${progressIndicatorBgClass} ${progressIndicatorTextClass}`}
            role="status" 
            aria-live="polite" 
            aria-label={`阅读进度 ${readerScrollProgress.toFixed(0)}%`}
          >
            {readerScrollProgress.toFixed(0)}%
          </div>
        )}
      </main>

      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        settings={settings}
        onClose={() => setIsSettingsPanelOpen(false)}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default App;
