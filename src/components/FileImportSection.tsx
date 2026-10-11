import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  HardDrive, 
  Sparkles, 
  CheckCircle2, 
  FileArchive, 
  Layers, 
  ExternalLink,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { ProjectAnalysis } from '../types';
import { SAMPLE_TEMPLATES, createTemplateZip } from '../services/templateService';

interface FileImportSectionProps {
  onFileLoaded: (file: File) => void;
  analysis: ProjectAnalysis | null;
  currentFileName: string | null;
  onOpenCloudStorage: () => void;
  onExploreGallery?: () => void;
  isProcessing: boolean;
}

export function FileImportSection({
  onFileLoaded,
  analysis,
  currentFileName,
  onOpenCloudStorage,
  onExploreGallery,
  isProcessing,
}: FileImportSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'cloud' | 'samples'>('device');
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.zip')) {
        alert('กรุณาเลือกไฟล์ .zip ที่ถูกต้อง');
        return;
      }
      onFileLoaded(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.zip')) {
        alert('กรุณาเลือกไฟล์ .zip ที่ถูกต้อง');
        return;
      }
      onFileLoaded(file);
    }
  };

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setIsLoadingTemplate(templateId);
      const file = await createTemplateZip(templateId);
      onFileLoaded(file);
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถโหลดเทมเพลตได้');
    } finally {
      setIsLoadingTemplate(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-[#181820] rounded-3xl p-5 lg:p-6 border border-[#2b2b3a] shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Source Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7b88ff] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7b88ff]"></span>
            ขั้นตอนที่ 1 : นำเข้าไฟล์ซอร์สโค้ด
          </span>
          <h2 className="text-lg lg:text-xl font-bold text-white mt-1">
            เลือกไฟล์ ZIP โปรเจกต์
          </h2>
        </div>

        {/* Source Switcher Pill Tabs */}
        <div className="flex items-center p-1 bg-[#121217] rounded-2xl border border-[#262634] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('device')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'device'
                ? 'bg-[#2a2a3b] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>อุปกรณ์</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cloud');
              onOpenCloudStorage();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cloud'
                ? 'bg-[#2a2a3b] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {/* Multi-cloud icon */}
            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
            <span>คลาวด์ (Drive/Dropbox/OneDrive)</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'samples'
                ? 'bg-[#2a2a3b] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ตัวอย่างทดสอบ</span>
          </button>

          {onExploreGallery && (
            <button
              onClick={onExploreGallery}
              className="hidden lg:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-[#252536] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>App Gallery</span>
            </button>
          )}
        </div>
      </div>

      {/* Main File Drop Area or Templates view */}
      {activeTab === 'samples' ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            เลือกโปรเจกต์ตัวอย่างพร้อมทดสอบแปลงเป็น APK ได้ทันทีโดยไม่ต้องเตรียมไฟล์ ZIP เอง:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isLoadingTemplate === tmpl.id
                    ? 'border-[#7b88ff] bg-[#222232]'
                    : 'border-[#2c2c3e] bg-[#14141c] hover:border-[#7b88ff]/60 hover:bg-[#1b1b26]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tmpl.type === 'google_ai_studio'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{tmpl.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{tmpl.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#252535] flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono text-[11px]">{tmpl.version}</span>
                  <button className="text-[#7b88ff] font-semibold text-xs flex items-center gap-1 hover:underline">
                    {isLoadingTemplate === tmpl.id ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      'ใช้ไฟล์นี้'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={handleFileChange}
            className="hidden"
          />

          {!analysis ? (
            /* Upload Drop Area */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-[#7b88ff] bg-[#7b88ff]/10 scale-[0.99]'
                  : 'border-[#323246] hover:border-[#7b88ff]/70 bg-[#13131a] hover:bg-[#161622]'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2a2a40] to-[#1a1a28] border border-[#3d3d58] flex items-center justify-center text-indigo-400 shadow-lg group-hover:scale-105 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <p className="text-base sm:text-lg font-bold text-white">
                  ลากไฟล์ ZIP มาวางที่นี่ หรือ <span className="text-[#7b88ff] underline decoration-indigo-400 underline-offset-4">คลิกเลือกจากอุปกรณ์</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md mx-auto">
                  รองรับ ZIP ที่ส่งออกจาก <strong>Google AI Studio</strong> (React/Vite/Web) และ <strong>Native Android App</strong> (Gradle/Java/Kotlin)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#1e1e2c] text-indigo-300 border border-[#2e2e42]">
                  📁 พื้นที่จัดเก็บเครื่อง
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#1e1e2c] text-emerald-300 border border-[#2e2e42]">
                  📦 ไฟล์ .ZIP ทุกประเภท
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#1e1e2c] text-teal-300 border border-[#2e2e42]">
                  ⚡ แปลงไฟล์ในเครื่อง 100%
                </span>
              </div>
            </div>
          ) : (
            /* Selected File Analysis Card */
            <div className="bg-[#12121a] rounded-2xl p-4 sm:p-5 border border-[#303044] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {analysis.iconDataUrl ? (
                  <div className="w-14 h-14 rounded-2xl bg-[#1c1c28] border-2 border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg relative group">
                    <img
                      src={analysis.iconDataUrl}
                      alt="App Icon from ZIP"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold" title="ตรวจพบไอคอนจาก ZIP อัตโนมัติ">
                      ✓
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#20202e] border border-[#36364e] flex items-center justify-center text-emerald-400 shrink-0">
                    <FileArchive className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white break-all">{currentFileName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      analysis.detectedType === 'google_ai_studio'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : analysis.detectedType === 'native_gradle'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {analysis.detectedType === 'google_ai_studio'
                        ? 'Google AI Studio App'
                        : analysis.detectedType === 'native_gradle'
                        ? 'Native Android (Gradle)'
                        : 'Web App'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1.5 font-mono">
                    <span>ขนาด: <strong className="text-gray-200">{formatFileSize(analysis.totalSize)}</strong></span>
                    <span>ไฟล์ภายใน: <strong className="text-gray-200">{analysis.fileCount} รายการ</strong></span>
                    {analysis.iconFileName && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        ✓ ใช้ไอคอน: {analysis.iconFileName}
                      </span>
                    )}
                    {analysis.hasPackageJson && <span className="text-indigo-300">✓ package.json</span>}
                    {analysis.hasGradle && <span className="text-emerald-300">✓ build.gradle</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#222232] text-gray-200 hover:bg-[#2c2c40] border border-[#35354a] transition-all flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>เปลี่ยนไฟล์</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
