import React, { useState } from 'react';
import { X, Download, AlertCircle, HelpCircle, CheckCircle2, Cloud, Sparkles } from 'lucide-react';
import { CloudStorageService, CloudProvider } from '../services/cloudStorageService';

interface CloudStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileDownloaded: (file: File) => void;
  defaultProvider?: CloudProvider;
}

export function CloudStorageModal({
  isOpen,
  onClose,
  onFileDownloaded,
  defaultProvider = 'google_drive',
}: CloudStorageModalProps) {
  const [provider, setProvider] = useState<CloudProvider>(defaultProvider);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFetch = async () => {
    if (!urlInput.trim()) {
      setErrorMsg('กรุณาระบุลิงก์แชร์ไฟล์ของคลาวด์');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setProgressPercent(10);
    setStatusMsg('กำลังวิเคราะห์ลิงก์...');

    try {
      const res = await CloudStorageService.fetchCloudFile(
        urlInput,
        provider,
        (msg, pct) => {
          setStatusMsg(msg);
          if (pct) setProgressPercent(pct);
        }
      );
      onFileDownloaded(res.file);
      onClose();
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMsg(e.message || 'เกิดข้อผิดพลาดในการดึงไฟล์จากคลาวด์');
    } finally {
      setLoading(false);
      setStatusMsg('');
      setProgressPercent(0);
    }
  };

  const getPlaceholder = () => {
    switch (provider) {
      case 'google_drive':
        return 'https://drive.google.com/file/d/1A2B3C.../view?usp=sharing หรือ File ID';
      case 'dropbox':
        return 'https://www.dropbox.com/s/abcdef12345/my-app.zip?dl=0';
      case 'onedrive':
        return 'https://1drv.ms/u/s!Alkn... หรือ https://onedrive.live.com/...';
      case 'direct_url':
        return 'https://example.com/builds/my-app-v1.zip';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#181824] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">นำเข้าจากคลาวด์ (Multi-Cloud Importer)</h3>
            <p className="text-xs text-gray-400">รองรับ Google Drive, Dropbox, Microsoft OneDrive & Direct URL</p>
          </div>
        </div>

        {/* Cloud Provider Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#121218] rounded-2xl border border-[#272738]">
          {/* Google Drive */}
          <button
            type="button"
            onClick={() => { setProvider('google_drive'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              provider === 'google_drive'
                ? 'bg-[#29293c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.2l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.9c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.1 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span className="truncate">G-Drive</span>
          </button>

          {/* Dropbox */}
          <button
            type="button"
            onClick={() => { setProvider('dropbox'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              provider === 'dropbox'
                ? 'bg-[#29293c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {/* Dropbox Blue Diamond Logo */}
            <svg className="w-3.5 h-3.5 text-[#0061fe] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M7.06 1.5L1.5 5.25l5.56 3.75 5.56-3.75-5.56-3.75zm9.88 0l-5.56 3.75 5.56 3.75 5.56-3.75-5.56-3.75zM1.5 12.75l5.56 3.75 5.56-3.75-5.56-3.75-5.56 3.75zm15.44-3.75l-5.56 3.75 5.56 3.75 5.56-3.75-5.56-3.75zM7.06 18l5.56-3.75 5.56 3.75-5.56 3.75-5.56-3.75z"/>
            </svg>
            <span className="truncate">Dropbox</span>
          </button>

          {/* OneDrive */}
          <button
            type="button"
            onClick={() => { setProvider('onedrive'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              provider === 'onedrive'
                ? 'bg-[#29293c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {/* OneDrive Cloud Logo */}
            <svg className="w-3.5 h-3.5 text-[#0078d4] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
            <span className="truncate">OneDrive</span>
          </button>

          {/* Direct URL */}
          <button
            type="button"
            onClick={() => { setProvider('direct_url'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              provider === 'direct_url'
                ? 'bg-[#29293c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Direct URL</span>
          </button>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
            <span>วางลิงก์แชร์ไฟล์ ({CloudStorageService.getProviderLabel(provider)}):</span>
            <span className="text-[11px] text-indigo-400 font-mono">.ZIP Archive</span>
          </label>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-3 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white text-xs font-mono focus:outline-none focus:border-[#7b88ff] transition-colors"
          />
        </div>

        {/* Progress & Error */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">เกิดข้อผิดพลาด:</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                {statusMsg}
              </span>
              <span className="font-mono text-[11px]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#1b1b28] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Instructions Card */}
        <div className="p-3.5 rounded-2xl bg-[#13131c] border border-[#262638] text-xs text-gray-400 space-y-1.5">
          <p className="font-semibold text-gray-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            เคล็ดลับการนำเข้าไฟล์:
          </p>
          {provider === 'dropbox' ? (
            <p>คัดลอกลิงก์แชร์ของ Dropbox (ระบบจะแปลงพารามิเตอร์ <code>?dl=1</code> สำหรับดาวน์โหลดตรงโดยอัตโนมัติ)</p>
          ) : provider === 'onedrive' ? (
            <p>คัดลอกลิงก์แชร์ของ OneDrive ที่ตั้งค่าเป็น &quot;Anyone with the link can view&quot;</p>
          ) : provider === 'google_drive' ? (
            <p>ตั้งค่าสิทธิ์ไฟล์ใน Google Drive เป็น &quot;ทุกคนที่มีลิงก์&quot; (Anyone with the link)</p>
          ) : (
            <p>รองรับ Direct HTTP/HTTPS download link ที่ชี้ตรงไปยังไฟล์ .zip</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#222230] text-gray-300 hover:bg-[#2b2b3e]"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleFetch}
            disabled={loading || !urlInput.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7b88ff] to-[#38e08c] text-[#0f0f13] hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'กำลังดึงไฟล์...' : 'ดึงไฟล์เข้าสู่ตัวสร้าง'}
          </button>
        </div>
      </div>
    </div>
  );
}
