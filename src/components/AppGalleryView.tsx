import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Star, 
  Code2, 
  Play, 
  Layers, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  X,
  Smartphone,
  Eye
} from 'lucide-react';
import { GALLERY_APPS, GalleryApp, generateGalleryAppZip } from '../data/appGalleryData';

interface AppGalleryViewProps {
  onRemixApp: (file: File, suggestedConfig?: { name: string; package: string; version: string }) => void;
}

export const CATEGORIES = [
  'ทั้งหมด',
  'AI & Data',
  'Productivity',
  'Games & 3D',
  'Native Android',
] as const;

export function AppGalleryView({ onRemixApp }: AppGalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingApp, setInspectingApp] = useState<GalleryApp | null>(null);
  const [remixingId, setRemixingId] = useState<string | null>(null);

  const filteredApps = useMemo(() => {
    return GALLERY_APPS.filter((app) => {
      const matchCat = selectedCategory === 'ทั้งหมด' || app.category === selectedCategory;
      const matchSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleRemix = async (app: GalleryApp) => {
    try {
      setRemixingId(app.id);
      const zipFile = await generateGalleryAppZip(app);
      onRemixApp(zipFile, {
        name: app.name.split(':')[0].trim(),
        package: app.suggestedPackage,
        version: app.version,
      });
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถโหลดโปรเจกต์ตัวอย่างได้');
    } finally {
      setRemixingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-[#1a1a2c] to-emerald-950/40 rounded-3xl p-6 lg:p-8 border border-[#2d2d42] shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#38e08c] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Explore the App Gallery
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            คลังแอพพลิเคชันสำเร็จรูปพร้อม Remix
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            เริ่มต้นโปรเจกต์ของคุณได้อย่างรวดเร็วด้วยการสำรวจ App Gallery เลือกแอพที่คุณชอบ ดูโครงสร้างสถาปัตยกรรมโค้ด และกด <strong>&quot;Remix & แปลงเป็น APK&quot;</strong> เพื่อนำไปต่อยอดและติดตั้งได้ทันที
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาแอพในคลังตามชื่อ, ฟีเจอร์ หรือเทคโนโลยี..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#14141c] border border-[#292938] text-white text-xs focus:outline-none focus:border-[#7b88ff] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center p-1 bg-[#14141c] rounded-2xl border border-[#292938] overflow-x-auto shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#28283c] text-white shadow-sm ring-1 ring-[#7b88ff]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-[#181822] rounded-3xl p-5 border border-[#2a2a3c] hover:border-[#7b88ff]/60 transition-all flex flex-col justify-between group shadow-xl hover:shadow-indigo-500/10"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-4xl p-2 rounded-2xl bg-[#1f1f2e] border border-[#2e2e42] shadow-inner">
                  {app.icon}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{app.stars}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
                {app.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                {app.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {app.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#202030] text-indigo-300 border border-[#2e2e42]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#242436] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setInspectingApp(app)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#20202e] text-gray-300 hover:bg-[#28283a] transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>ดูโครงสร้าง</span>
              </button>

              <button
                type="button"
                onClick={() => handleRemix(app)}
                disabled={remixingId === app.id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7b88ff] to-[#38e08c] text-[#0f0f13] hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {remixingId === app.id ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>กำลังนำเข้า...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Remix เป็น APK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Code Modal */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#181824] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
            <button
              onClick={() => setInspectingApp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-[#222234] border border-[#333348]">
                {inspectingApp.icon}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{inspectingApp.name}</h3>
                <p className="text-xs text-gray-400">พัฒนาโดย {inspectingApp.author} • v{inspectingApp.version}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12121a] border border-[#272738] space-y-3 text-xs">
              <div>
                <span className="text-gray-400">เฟรมเวิร์ก:</span>
                <p className="text-white font-mono font-bold mt-0.5">{inspectingApp.codeHighlights.framework}</p>
              </div>
              <div>
                <span className="text-gray-400">สไตล์และการแสดงผล:</span>
                <p className="text-emerald-400 font-mono mt-0.5">{inspectingApp.codeHighlights.styling}</p>
              </div>
              <div>
                <span className="text-gray-400">ฟีเจอร์เด่นภายในแอพ:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-300 mt-1">
                  {inspectingApp.codeHighlights.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInspectingApp(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#222232] text-gray-300 hover:bg-[#2b2b40]"
              >
                ปิด
              </button>

              <button
                type="button"
                onClick={() => {
                  const appToRemix = inspectingApp;
                  setInspectingApp(null);
                  handleRemix(appToRemix);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7b88ff] to-[#38e08c] text-[#0f0f13] flex items-center gap-2 hover:opacity-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Remix แอพนี้ทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
