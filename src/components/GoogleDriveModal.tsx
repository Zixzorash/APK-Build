import React, { useState } from 'react';
import { X, Download, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { GoogleDriveService } from '../services/googleDriveService';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileDownloaded: (file: File) => void;
}

export function GoogleDriveModal({ isOpen, onClose, onFileDownloaded }: GoogleDriveModalProps) {
  const [urlOrId, setUrlOrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFetch = async () => {
    setErrorMsg('');
    const fileId = GoogleDriveService.extractFileId(urlOrId);
    if (!fileId) {
      setErrorMsg('รูปแบบลิงก์ Google Drive หรือ File ID ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    try {
      setLoading(true);
      const file = await GoogleDriveService.fetchZipFromDrive(fileId, (msg) => {
        setStatusMsg(msg);
      });
      onFileDownloaded(file);
      onClose();
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMsg(e.message || 'เกิดข้อผิดพลาดในการดึงไฟล์จาก Google Drive');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#181822] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            {/* Google Drive Logo */}
            <svg className="w-5 h-5" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.2l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.9c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.1 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">นำเข้าจาก Google Drive</h3>
            <p className="text-xs text-gray-400">ระบุลิงก์แชร์ไฟล์ ZIP จาก Google Drive</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300">
            วางลิงก์ Google Drive (Share Link) หรือ File ID:
          </label>
          <input
            type="text"
            value={urlOrId}
            onChange={(e) => setUrlOrId(e.target.value)}
            placeholder="https://drive.google.com/file/d/1a2B3c.../view?usp=sharing"
            className="w-full px-4 py-3 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white text-xs font-mono focus:outline-none focus:border-[#7b88ff]"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">ไม่สามารถดาวน์โหลดได้:</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {loading && statusMsg && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-[#14141e] border border-[#262638] text-xs text-gray-400 space-y-1.5">
          <p className="font-semibold text-gray-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            คำแนะนำการแชร์ไฟล์ใน Google Drive:
          </p>
          <p>1. คลิกขวาที่ไฟล์ .zip ใน Google Drive เลือก <strong>แชร์ (Share)</strong></p>
          <p>2. ในส่วนการเข้าถึงทั่วไป ให้เปลี่ยนเป็น <strong>&quot;ทุกคนที่มีลิงก์ (Anyone with the link)&quot;</strong></p>
          <p>3. คัดลอกลิงก์มาวางในช่องด้านบนนี้</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#222230] text-gray-300 hover:bg-[#2b2b3e]"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleFetch}
            disabled={loading || !urlOrId.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7b88ff] text-[#0f0f13] hover:bg-[#8f9bff] flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'กำลังดึงไฟล์...' : 'ดึงไฟล์เข้าสู่ตัวสร้าง'}
          </button>
        </div>
      </div>
    </div>
  );
}
