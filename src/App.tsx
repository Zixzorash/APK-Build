import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { Navbar, MainNavTab } from './components/Navbar';
import { FileImportSection } from './components/FileImportSection';
import { BuildConfiguration } from './components/BuildConfiguration';
import { BuildProgressModal } from './components/BuildProgressModal';
import { BuildSuccessCard } from './components/BuildSuccessCard';
import { CloudStorageModal } from './components/CloudStorageModal';
import { PermissionsModal } from './components/PermissionsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PlayStoreGuideModal } from './components/PlayStoreGuideModal';
import { FileManagerView } from './components/FileManagerView';
import { AppGalleryView } from './components/AppGalleryView';
import { GitHubPublishModal } from './components/GitHubPublishModal';
import { AppConfig, BuildLog, BuildResult, ProjectAnalysis } from './types';
import { ApkBuilderEngine } from './services/apkBuilderEngine';
import { notificationService } from './services/notificationService';
import { HistoryStorage } from './services/historyStorage';
import { Zap, Github, Layers, ArrowRight } from 'lucide-react';

const DEFAULT_CONFIG: AppConfig = {
  appName: 'My App Pro',
  packageName: 'com.aistudio.myapp',
  versionName: '1.0.0',
  versionCode: 1,
  minSdkVersion: 24, // Android 7.0+
  targetSdkVersion: 35, // Android 15 (Latest)
  outputFormat: 'apk',
  signType: 'debug',
  enableOfflineCache: true,
  enableNotifications: true,
  enableHardwareAcceleration: true,
  permissions: {
    internet: true,
    storage: true,
    camera: false,
    notifications: true,
    vibrate: true,
    networkState: true,
  },
  keystore: {
    alias: 'apkbuilder_key',
    organization: 'APK Builder Pro Mobile Org',
    validityYears: 30,
  },
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainNavTab>('builder');
  const [file, setFile] = useState<File | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [sourceZip, setSourceZip] = useState<JSZip | null>(null);
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  // Build status
  const [isBuilding, setIsBuilding] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [buildLogs, setBuildLogs] = useState<BuildLog[]>([]);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);

  // Modals
  const [cloudStorageOpen, setCloudStorageOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<Omit<BuildResult, 'blob'>[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setHistoryItems(HistoryStorage.getHistory());
    setNotificationPermission(notificationService.getNotificationPermission());
  }, []);

  const handleFileLoaded = async (loadedFile: File) => {
    try {
      setFile(loadedFile);
      setCurrentFileName(loadedFile.name);
      setBuildResult(null);

      const res = await ApkBuilderEngine.analyzeZip(loadedFile);
      setAnalysis(res.analysis);
      setSourceZip(res.zip);

      // Auto update configuration from zip analysis
      setConfig(prev => ({
        ...prev,
        appName: res.analysis.title || prev.appName,
        packageName: res.analysis.suggestedPackageName || prev.packageName,
        customIconBlob: res.analysis.iconBlob,
        customIconUrl: res.analysis.iconDataUrl,
        customIconName: res.analysis.iconFileName,
      }));
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถอ่านไฟล์ ZIP ได้ กรุณาตรวจสอบว่าเป็นไฟล์ .zip ที่ถูกต้อง');
    }
  };

  const handleRemixFromGallery = async (remixZip: File, suggestedMeta?: { name: string; package: string; version: string }) => {
    await handleFileLoaded(remixZip);
    if (suggestedMeta) {
      setConfig(prev => ({
        ...prev,
        appName: suggestedMeta.name,
        packageName: suggestedMeta.package,
        versionName: suggestedMeta.version,
      }));
    }
    setCurrentTab('builder');
  };

  const handleStartBuild = async () => {
    if (!sourceZip) {
      alert('กรุณาเลือกไฟล์ ZIP ก่อนเริ่มกระบวนการ');
      return;
    }

    const startTime = Date.now();
    setIsBuilding(true);
    setProgressPercent(0);
    setCurrentPhase('กำลังเตรียมความพร้อม');
    setBuildLogs([]);
    setBuildResult(null);

    try {
      const result = await ApkBuilderEngine.build(
        sourceZip,
        config,
        (pct, phase, log) => {
          setProgressPercent(pct);
          setCurrentPhase(phase);
          setBuildLogs(prev => [...prev, log]);
        }
      );

      // Save to storage
      HistoryStorage.saveBuild(result);
      setHistoryItems(HistoryStorage.getHistory());

      const durationSec = Math.round((Date.now() - startTime) / 1000);
      const sizeMb = (result.fileSize / (1024 * 1024)).toFixed(2);

      // Trigger Celebration & Audio/Web Notification
      setTimeout(() => {
        setIsBuilding(false);
        setBuildResult(result);

        // Confetti celebration
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#7b88ff', '#38e08c', '#9373ee', '#ffffff'],
          });
        } catch {
          // ignore
        }

        // Detailed system notification
        notificationService.notifyBuildComplete(result.appName, result.format, {
          durationSec,
          sizeMb,
        });
      }, 500);
    } catch (err: unknown) {
      setIsBuilding(false);
      const e = err as Error;
      console.error('Build failure:', e);
      notificationService.notifyBuildError(config.appName, e.message);
      alert('เกิดข้อผิดพลาดในการแปลงไฟล์: ' + e.message);
    }
  };

  const handleReset = () => {
    setBuildResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f14] text-[#e3e2e6] selection:bg-[#7b88ff]/30">
      {/* Top App Bar with Tab Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenPermissions={() => setPermissionsOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
        onOpenGitHub={() => setGithubOpen(true)}
        notificationPermission={notificationPermission}
        historyCount={historyItems.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* VIEW 1: Main Builder */}
        {currentTab === 'builder' && (
          <div className="space-y-6">
            {/* Hero Banner / Quick Feature Highlights */}
            <div className="bg-gradient-to-r from-[#171724] via-[#1a1a2b] to-[#141d24] border border-[#2b2b3e] rounded-3xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7b88ff]/20 text-[#a3b3ff] border border-[#7b88ff]/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Google AI Studio & Native Android Engine</span>
                    </span>
                    <span className="text-xs text-emerald-400 font-medium hidden sm:inline">• Android 15 Ready</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    แปลงไฟล์ ZIP เป็น APK & XAPK พร้อมลงชื่ออัตโนมัติ
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
                    รองรับการนำเข้าจาก <strong>อุปกรณ์, Google Drive, Dropbox, OneDrive</strong> และ <strong>App Gallery</strong> พร้อมแจ้งเตือนแบบเรียลไทม์และส่งขึ้น GitHub หรือ Play Store
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentTab('gallery')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#222234] text-amber-300 hover:bg-[#2b2b42] border border-amber-500/20 transition-all"
                  >
                    <span>สำรวจ App Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setGithubOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#222234] text-white hover:bg-[#2b2b42] border border-[#35354a] transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Publish to GitHub</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Build Success Card vs Build Inputs */}
            {buildResult ? (
              <BuildSuccessCard
                result={buildResult}
                onReset={handleReset}
                onOpenGuide={() => setGuideOpen(true)}
              />
            ) : (
              <div className="space-y-6">
                {/* Step 1: File Import Section (Device + Multi-Cloud Storage) */}
                <FileImportSection
                  onFileLoaded={handleFileLoaded}
                  analysis={analysis}
                  currentFileName={currentFileName}
                  onOpenCloudStorage={() => setCloudStorageOpen(true)}
                  onExploreGallery={() => setCurrentTab('gallery')}
                  isProcessing={isBuilding}
                />

                {/* Step 2: Build & Package Configuration */}
                <BuildConfiguration
                  config={config}
                  onChangeConfig={setConfig}
                  onStartBuild={handleStartBuild}
                  isBuilding={isBuilding}
                  canBuild={Boolean(sourceZip)}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: App Gallery */}
        {currentTab === 'gallery' && (
          <AppGalleryView onRemixApp={handleRemixFromGallery} />
        )}

        {/* VIEW 3: File Manager */}
        {currentTab === 'files' && (
          <FileManagerView
            items={historyItems}
            onReload={() => setHistoryItems(HistoryStorage.getHistory())}
          />
        )}
      </main>

      {/* Multi-Stage Build Progress & Terminal Modal */}
      <BuildProgressModal
        isOpen={isBuilding}
        progressPercent={progressPercent}
        currentPhase={currentPhase}
        logs={buildLogs}
        format={config.outputFormat}
      />

      {/* Multi-Cloud Storage Modal (Google Drive, Dropbox, OneDrive, Direct URL) */}
      <CloudStorageModal
        isOpen={cloudStorageOpen}
        onClose={() => setCloudStorageOpen(false)}
        onFileDownloaded={handleFileLoaded}
      />

      {/* GitHub Publish Modal */}
      <GitHubPublishModal
        isOpen={githubOpen}
        onClose={() => setGithubOpen(false)}
        sourceZip={sourceZip}
        config={config}
      />

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={permissionsOpen}
        onClose={() => setPermissionsOpen(false)}
        notificationPermission={notificationPermission}
        onPermissionUpdated={() => setNotificationPermission(notificationService.getNotificationPermission())}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={historyItems}
        onReloadHistory={() => setHistoryItems(HistoryStorage.getHistory())}
      />

      {/* Play Store Guide Modal */}
      <PlayStoreGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#20202c] py-6 px-4 text-center text-xs text-gray-500 space-y-1">
        <p>
          APK Builder Pro © 2026 • สถาปัตยกรรม Material Design 3 • รองรับทุกเวอร์ชัน Android รุ่นล่าสุด (Android 15 Ready)
        </p>
        <p className="text-[11px] text-gray-600">
          ทำงานแบบออฟไลน์เต็มรูปแบบ (Offline-First) • รองรับ Google Drive, Dropbox, OneDrive & GitHub Export
        </p>
      </footer>
    </div>
  );
}
