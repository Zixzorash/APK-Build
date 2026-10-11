import React from 'react';
import { 
  History, 
  HelpCircle, 
  ShieldCheck, 
  WifiOff, 
  Sparkles, 
  FolderCheck, 
  Github, 
  Wrench,
  Smartphone
} from 'lucide-react';
import { AppLogo } from './AppLogo';

export type MainNavTab = 'builder' | 'gallery' | 'files';

interface NavbarProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenHistory: () => void;
  onOpenPermissions: () => void;
  onOpenGuide: () => void;
  onOpenGitHub: () => void;
  notificationPermission: NotificationPermission;
  historyCount: number;
}

export function Navbar({
  currentTab,
  onSelectTab,
  onOpenHistory,
  onOpenPermissions,
  onOpenGuide,
  onOpenGitHub,
  notificationPermission,
  historyCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#131318]/95 backdrop-blur-xl border-b border-[#252530] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand & Main View Switcher */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div 
            onClick={() => onSelectTab('builder')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <AppLogo size={38} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  APK Builder <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b88ff] to-[#38e08c]">Pro</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#7b88ff]/15 text-[#9cb0ff] border border-[#7b88ff]/30">
                  M3
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden lg:block">
                แปลง ZIP จาก Google AI Studio & Native Android
              </p>
            </div>
          </div>

          {/* Quick Tab Switcher on Mobile/Tablet */}
          <div className="flex items-center p-1 bg-[#1a1a24] rounded-2xl border border-[#2b2b3c] md:hidden">
            <button
              onClick={() => onSelectTab('builder')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                currentTab === 'builder' ? 'bg-[#2c2c40] text-white' : 'text-gray-400'
              }`}
            >
              สร้าง APK
            </button>
            <button
              onClick={() => onSelectTab('gallery')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                currentTab === 'gallery' ? 'bg-[#2c2c40] text-white' : 'text-gray-400'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => onSelectTab('files')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                currentTab === 'files' ? 'bg-[#2c2c40] text-white' : 'text-gray-400'
              }`}
            >
              ไฟล์
            </button>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center p-1 bg-[#171722] rounded-2xl border border-[#262636]">
          <button
            onClick={() => onSelectTab('builder')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'builder'
                ? 'bg-[#28283c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#7b88ff]" />
            <span>แปลงเป็น APK</span>
          </button>

          <button
            onClick={() => onSelectTab('gallery')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'gallery'
                ? 'bg-[#28283c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>App Gallery</span>
          </button>

          <button
            onClick={() => onSelectTab('files')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'files'
                ? 'bg-[#28283c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ระบบจัดการไฟล์</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Status Indicators & Action Tools */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-end">
          {/* GitHub Publish Button */}
          <button
            onClick={onOpenGitHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1e1e28] text-gray-200 hover:bg-[#282838] border border-[#333344] transition-all"
            title="ส่งออกโค้ดขึ้น GitHub พร้อม CI/CD"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </button>

          {/* Permissions Status Button */}
          <button
            onClick={onOpenPermissions}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              notificationPermission === 'granted'
                ? 'bg-[#1e1e28] text-gray-300 hover:bg-[#282836] border border-[#333344]'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
            title="จัดการสิทธิ์การเข้าถึงพื้นที่จัดเก็บและการแจ้งเตือน"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">สิทธิ์</span>
          </button>

          {/* Google Play Guide */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1e1e28] text-gray-300 hover:bg-[#282836] border border-[#333344] transition-all"
            title="คู่มือนำส่งขึ้น Google Play Store"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Play Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
}
