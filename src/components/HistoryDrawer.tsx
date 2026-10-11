import React from 'react';
import { X, Trash2, Smartphone, Package, Layers, Calendar, ExternalLink, HardDrive } from 'lucide-react';
import { BuildResult } from '../types';
import { HistoryStorage } from '../services/historyStorage';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Omit<BuildResult, 'blob'>[];
  onReloadHistory: () => void;
}

export function HistoryDrawer({ isOpen, onClose, items, onReloadHistory }: HistoryDrawerProps) {
  if (!isOpen) return null;

  const handleClear = () => {
    if (confirm('คุณต้องการล้างประวัติการสร้างทั้งหมดใช่หรือไม่?')) {
      HistoryStorage.clearHistory();
      onReloadHistory();
    }
  };

  const handleRemove = (id: string) => {
    HistoryStorage.removeBuild(id);
    onReloadHistory();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#15151e] border-l border-[#2e2e42] shadow-2xl flex flex-col p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252535]">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white">ประวัติการสร้าง APK</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
              {items.length} รายการ
            </span>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                title="ล้างทั้งหมด"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              ยังไม่มีประวัติการสร้าง APK
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#1c1c28] border border-[#2d2d40] space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#28283a] text-indigo-400">
                      {item.format === 'apk' ? <Smartphone className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.appName}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">{item.packageName}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {item.format}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-[#262638] font-mono">
                  <span>ขนาด: {formatFileSize(item.fileSize)}</span>
                  <span>v{item.versionName}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]" title={item.sha256}>
                    SHA: {item.sha256.slice(0, 16)}...
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-[11px] text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
