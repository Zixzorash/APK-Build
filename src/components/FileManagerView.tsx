import React, { useState, useMemo } from 'react';
import { 
  FolderCheck, 
  Search, 
  Trash2, 
  Download, 
  Smartphone, 
  Package, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Copy, 
  Check, 
  Info, 
  ExternalLink,
  HardDrive,
  Filter,
  X
} from 'lucide-react';
import { BuildResult, OutputFormat } from '../types';
import { HistoryStorage } from '../services/historyStorage';

interface FileManagerViewProps {
  items: Omit<BuildResult, 'blob'>[];
  onReload: () => void;
  onSelectBuild?: (item: Omit<BuildResult, 'blob'>) => void;
}

export function FileManagerView({ items, onReload }: FileManagerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<Omit<BuildResult, 'blob'> | null>(null);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFormat = selectedFormat === 'all' || item.format === selectedFormat;
      return matchesSearch && matchesFormat;
    });
  }, [items, searchTerm, selectedFormat]);

  const totalBytes = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
  }, [items]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('คุณต้องการลบไฟล์นี้ออกจากระบบจัดการใช่หรือไม่?')) {
      HistoryStorage.removeBuild(id);
      if (activeItem?.id === id) setActiveItem(null);
      onReload();
    }
  };

  const handleClearAll = () => {
    if (confirm('คุณต้องการล้างประวัติและไฟล์ทั้งหมดใช่หรือไม่?')) {
      HistoryStorage.clearHistory();
      setActiveItem(null);
      onReload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Storage Stats Bar */}
      <div className="bg-[#181822] rounded-3xl p-5 border border-[#2b2b3a] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FolderCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              ระบบจัดการไฟล์ & ประวัติการแปลง
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#7b88ff]/20 text-[#a3b3ff]">
                {items.length} รายการ
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              พื้นที่ไฟล์ที่คอมไพล์ในเครื่อง: <strong className="text-gray-200">{formatFileSize(totalBytes)}</strong>
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all self-end sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>ล้างไฟล์ทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามชื่อแอพ, Package Name หรือชื่อไฟล์..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#14141c] border border-[#292938] text-white text-xs focus:outline-none focus:border-[#7b88ff] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 bg-[#14141c] rounded-2xl border border-[#292938] shrink-0 overflow-x-auto">
          {['all', 'apk', 'xapk', 'aab'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${
                selectedFormat === fmt
                  ? 'bg-[#28283c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {fmt === 'all' ? 'ทั้งหมด' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Files Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#15151e] border border-[#262636] space-y-3">
          <HardDrive className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-300">ยังไม่พบไฟล์ที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            สร้างหรือแปลงไฟล์ APK, XAPK หรือ AAB ในแถบเครื่องมือหลัก แล้วไฟล์จะปรากฏในระบบจัดการนี้โดยอัตโนมัติ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                activeItem?.id === item.id
                  ? 'bg-[#1e1e2c] border-[#7b88ff] shadow-lg shadow-indigo-500/10'
                  : 'bg-[#161620] border-[#29293a] hover:border-[#383850] hover:bg-[#191926]'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#222232] border border-[#323246] flex items-center justify-center text-indigo-400">
                      {item.format === 'apk' ? (
                        <Smartphone className="w-5 h-5" />
                      ) : item.format === 'xapk' ? (
                        <Package className="w-5 h-5" />
                      ) : (
                        <Layers className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {item.appName}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-mono break-all line-clamp-1">
                        {item.packageName}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {item.format}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 text-xs text-gray-400 font-mono py-2 border-y border-[#222230]">
                  <div className="flex justify-between">
                    <span>เวอร์ชัน:</span>
                    <span className="text-gray-200 font-bold">{item.versionName} ({item.versionCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ขนาดไฟล์:</span>
                    <span className="text-gray-200 font-bold">{formatFileSize(item.fileSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่สร้าง:</span>
                    <span className="text-gray-400">{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 mt-2">
                <span className="text-[10px] text-gray-500 font-mono truncate max-w-[140px]">
                  SHA: {item.sha256.slice(0, 10)}...
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                    title="ลบไฟล์นี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-indigo-400 group-hover:underline flex items-center gap-1">
                    ดูรายละเอียด
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Details Drawer / Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#181824] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                {activeItem.format === 'apk' ? <Smartphone className="w-6 h-6" /> : <Package className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{activeItem.appName}</h3>
                <p className="text-xs text-indigo-300 font-mono">{activeItem.packageName}</p>
              </div>
            </div>

            {/* Detailed Spec Sheet */}
            <div className="bg-[#12121a] rounded-2xl p-4 border border-[#282838] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1f1f2e]">
                <span className="text-gray-400">ชื่อไฟล์เอาต์พุต:</span>
                <span className="text-white font-mono font-bold break-all">{activeItem.fileName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1f1f2e]">
                <span className="text-gray-400">รูปแบบแพ็กเกจ:</span>
                <span className="text-emerald-400 font-bold uppercase">{activeItem.format}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1f1f2e]">
                <span className="text-gray-400">Version Name & Code:</span>
                <span className="text-white font-mono">{activeItem.versionName} (Build #{activeItem.versionCode})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1f1f2e]">
                <span className="text-gray-400">Target SDK:</span>
                <span className="text-emerald-400 font-medium">API Level {activeItem.targetSdk} (Android 15)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1f1f2e]">
                <span className="text-gray-400">ขนาดไฟล์:</span>
                <span className="text-white font-bold">{formatFileSize(activeItem.fileSize)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1f1f2e]">
                <span className="text-gray-400">Checksum (MD5):</span>
                <span className="text-gray-300 font-mono">{activeItem.md5}</span>
              </div>

              {/* SHA-256 Box */}
              <div className="py-1">
                <div className="flex items-center justify-between text-gray-400 mb-1">
                  <span>SHA-256 Signature Fingerprint:</span>
                  <button
                    onClick={() => handleCopySha(activeItem.sha256)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedSha === activeItem.sha256 ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                  </button>
                </div>
                <p className="font-mono text-[10px] text-gray-300 break-all bg-[#0d0d14] p-2 rounded-lg border border-[#20202e]">
                  {activeItem.signFingerprint || activeItem.sha256}
                </p>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                สิทธิ์ Android ที่เปิดใช้งาน ({activeItem.permissions.length}):
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeItem.permissions.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-[#1c1c28] text-indigo-300 border border-[#2a2a3c]"
                  >
                    {p.replace('android.permission.', '')}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleDelete(activeItem.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบไฟล์นี้</span>
              </button>

              <button
                onClick={() => setActiveItem(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#29293c] text-white hover:bg-[#34344e] transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
