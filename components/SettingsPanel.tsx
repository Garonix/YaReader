import React from 'react';
import { ReaderSettings, FontFamily, ThemeOption } from '../types';
import {
  MIN_FONT_SIZE, MAX_FONT_SIZE, FONT_SIZE_STEP,
  LINE_HEIGHT_VALUES, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT,
  MIN_PADDING, MAX_PADDING_X, MAX_PADDING_Y, PADDING_STEP,
  FONT_FAMILIES, THEME_OPTIONS
} from '../constants';
import { CloseIcon, PlusIcon, MinusIcon } from './Icons';

interface SettingsPanelProps {
  isOpen: boolean;
  settings: ReaderSettings;
  onClose: () => void;
  onSettingsChange: (newSettings: ReaderSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, settings, onClose, onSettingsChange }) => {
  const handleFontSizeChange = (increment: boolean) => {
    const newSize = settings.fontSize + (increment ? FONT_SIZE_STEP : -FONT_SIZE_STEP);
    onSettingsChange({ ...settings, fontSize: Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, newSize)) });
  };

  const handleLineHeightChange = (increment: boolean) => {
    const currentIndex = LINE_HEIGHT_VALUES.indexOf(settings.lineHeight);
    let newIndex = currentIndex + (increment ? 1 : -1);
    newIndex = Math.max(0, Math.min(LINE_HEIGHT_VALUES.length - 1, newIndex));
    onSettingsChange({ ...settings, lineHeight: LINE_HEIGHT_VALUES[newIndex] });
  };
  
  const handlePaddingXChange = (increment: boolean) => {
    const newPadding = settings.paddingX + (increment ? PADDING_STEP : -PADDING_STEP);
    onSettingsChange({ ...settings, paddingX: Math.max(MIN_PADDING, Math.min(MAX_PADDING_X, newPadding)) });
  };

  const handlePaddingYChange = (increment: boolean) => {
    const newPadding = settings.paddingY + (increment ? PADDING_STEP : -PADDING_STEP);
    onSettingsChange({ ...settings, paddingY: Math.max(MIN_PADDING, Math.min(MAX_PADDING_Y, newPadding)) });
  };

  const handleFontFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ ...settings, fontFamily: event.target.value as FontFamily });
  };

  const handleThemeChange = (theme: ThemeOption) => {
    onSettingsChange({ ...settings, theme });
  };

  // Common classes for theme-aware elements
  const panelBgColor = settings.theme === 'sepia' ? 'bg-[#f8f0e3]' : 'bg-white dark:bg-slate-800';
  const panelTextColor = settings.theme === 'sepia' ? 'text-[#5b4636]' : 'text-gray-700 dark:text-slate-300';
  const panelBorderColor = settings.theme === 'sepia' ? 'border-[#d4c0a1]' : 'border-gray-300 dark:border-slate-600';
  const panelFocusRingColor = settings.theme === 'sepia' ? 'focus:ring-[#7a5c3d]' : 'focus:ring-indigo-500 dark:focus:ring-indigo-400';
  const buttonBgHover = settings.theme === 'sepia' ? 'hover:bg-[#e0d1b6]' : 'hover:bg-gray-300 dark:hover:bg-slate-600';
  const buttonDisabled = 'disabled:opacity-50 disabled:cursor-not-allowed';
  const buttonBase = `p-2 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 ${panelFocusRingColor}`;
  const controlButtonBg = settings.theme === 'sepia' ? 'bg-[#d4c0a1]' : 'bg-gray-200 dark:bg-slate-700';
  
  const SettingControl: React.FC<{label: string; value: string | number; onIncrement: () => void; onDecrement: () => void; incrementDisabled?: boolean; decrementDisabled?: boolean; children?: React.ReactNode}> = 
    ({ label, value, onIncrement, onDecrement, incrementDisabled, decrementDisabled, children }) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${panelTextColor}`}>{label}</label>
      <div className="flex items-center justify-between">
        <button
          onClick={onDecrement}
          disabled={decrementDisabled}
          className={`${buttonBase} ${controlButtonBg} ${buttonBgHover} ${buttonDisabled}`}
          aria-label={`减少${label}`}
        >
          <MinusIcon className={`w-5 h-5 ${panelTextColor}`} />
        </button>
        <span className={`text-center w-20 tabular-nums ${panelTextColor}`}>{value}</span>
        <button
          onClick={onIncrement}
          disabled={incrementDisabled}
          className={`${buttonBase} ${controlButtonBg} ${buttonBgHover} ${buttonDisabled}`}
          aria-label={`增加${label}`}
        >
          <PlusIcon className={`w-5 h-5 ${panelTextColor}`} />
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out 
                  ${isOpen ? 'bg-black bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto 
                    transform transition-all duration-300 ease-in-out 
                    ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-10'}
                    ${panelBgColor}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${settings.theme === 'sepia' ? 'text-[#4a3b2a]' : 'text-gray-800 dark:text-slate-100'}`}>阅读设置</h2>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-full transition-colors focus:outline-none focus:ring-2 ${panelFocusRingColor}
                        ${settings.theme === 'sepia' ? 'text-[#6e5544] hover:bg-[#e0d1b6]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'}`}
            aria-label="关闭设置面板"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${panelTextColor}`}>主题</label>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map(themeOpt => (
              <button
                key={themeOpt.value}
                onClick={() => handleThemeChange(themeOpt.value)}
                className={`w-full p-2 rounded-md text-sm transition-all duration-150 ease-in-out border
                            ${settings.theme === themeOpt.value 
                                ? (settings.theme === 'sepia' ? 'bg-[#af8f6f] text-white border-[#9a7c5e]' : 'bg-indigo-600 text-white border-indigo-700 dark:bg-indigo-500 dark:border-indigo-600')
                                : (settings.theme === 'sepia' ? `bg-[#e0d1b6] text-[#5b4636] border-[#c8b89a] hover:bg-[#d4c0a1]` : `bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600`)
                            }
                            ${panelFocusRingColor}`}
                aria-pressed={settings.theme === themeOpt.value}
              >
                {themeOpt.label}
              </button>
            ))}
          </div>
        </div>


        <SettingControl
          label="字号"
          value={`${settings.fontSize}px`}
          onIncrement={() => handleFontSizeChange(true)}
          onDecrement={() => handleFontSizeChange(false)}
          incrementDisabled={settings.fontSize >= MAX_FONT_SIZE}
          decrementDisabled={settings.fontSize <= MIN_FONT_SIZE}
        />

        <SettingControl
          label="行高"
          value={settings.lineHeight.toFixed(2)}
          onIncrement={() => handleLineHeightChange(true)}
          onDecrement={() => handleLineHeightChange(false)}
          incrementDisabled={settings.lineHeight >= MAX_LINE_HEIGHT}
          decrementDisabled={settings.lineHeight <= MIN_LINE_HEIGHT}
        />
        
        <SettingControl
          label="水平边距"
          value={`${settings.paddingX}px`}
          onIncrement={() => handlePaddingXChange(true)}
          onDecrement={() => handlePaddingXChange(false)}
          incrementDisabled={settings.paddingX >= MAX_PADDING_X}
          decrementDisabled={settings.paddingX <= MIN_PADDING}
        />

        <SettingControl
          label="垂直边距"
          value={`${settings.paddingY}px`}
          onIncrement={() => handlePaddingYChange(true)}
          onDecrement={() => handlePaddingYChange(false)}
          incrementDisabled={settings.paddingY >= MAX_PADDING_Y}
          decrementDisabled={settings.paddingY <= MIN_PADDING}
        />

        <div className="mb-4">
          <label htmlFor="fontFamily" className={`block text-sm font-medium mb-1 ${panelTextColor}`}>字体</label>
          <select
            id="fontFamily"
            value={settings.fontFamily}
            onChange={handleFontFamilyChange}
            className={`w-full p-2 border rounded-md shadow-sm transition-colors
                        ${panelBorderColor} ${panelBgColor} ${panelTextColor}
                        focus:border-indigo-500 ${panelFocusRingColor}
                        dark:focus:border-indigo-400`}
          >
            {FONT_FAMILIES.map(font => (
              <option key={font.value} value={font.value} style={settings.theme === 'sepia' ? {backgroundColor: '#f8f0e3', color: '#5b4636'} : {}} >{font.label}</option>
            ))}
          </select>
        </div>
        
        <div className="mt-6 flex justify-end">
            <button 
                onClick={onClose}
                className={`px-4 py-2 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${settings.theme === 'sepia' 
                                ? 'bg-[#af8f6f] text-white hover:bg-[#9a7c5e] focus:ring-[#7a5c3d]' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400'
                            }`}
            >
                完成
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;