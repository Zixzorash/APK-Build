import React from 'react';
import { X, CheckCircle, ExternalLink, ShieldAlert, Layers, Smartphone, Sparkles } from 'lucide-react';

interface PlayStoreGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlayStoreGuideModal({ isOpen, onClose }: PlayStoreGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#181822] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">คู่มือนำส่งแอพขึ้น Google Play Store</h3>
            <p className="text-xs text-gray-400">ขั้นตอนการเตรียมและอัปโหลด Android App Bundle (.aab)</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 text-xs text-gray-300">
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#29293a] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">1</span>
              <span>เลือกรูปแบบไฟล์ผลลัพธ์เป็น AAB (Android App Bundle)</span>
            </div>
            <p className="text-gray-400 pl-8">
              ตั้งแต่เดือนสิงหาคม 2021 ทาง Google Play Console บังคับให้แอพใหม่ทุกแอพต้องส่งเป็นไฟล์ <code>.aab</code> (App Bundle) แทนไฟล์ .apk ทั่วไป
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121218] border border-[#29293a] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">2</span>
              <span>เลือก Target SDK Version ขั้นต่ำที่กำหนด</span>
            </div>
            <p className="text-gray-400 pl-8">
              Google กำหนดให้แอพใหม่ต้องรองรับอย่างน้อย <strong>API Level 34 (Android 14)</strong> หรือแนะนำ <strong>API Level 35 (Android 15)</strong> ซึ่งในระบบ APK Builder Pro ได้ตั้งค่าเป็น Android 15 ให้เรียบร้อยแล้ว
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121218] border border-[#29293a] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">3</span>
              <span>การลงชื่อ Release Keystore</span>
            </div>
            <p className="text-gray-400 pl-8">
              ในแท็บ <strong>การลงชื่อ (Keystore)</strong> ให้เลือก <strong>Production Release Keystore</strong> ใส่ชื่อ Alias และคัดลอก SHA-256 Fingerprint ไว้ เพื่อความปลอดภัยในการอัปเดตเวอร์ชันถัดไป
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121218] border border-[#29293a] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">4</span>
              <span>อัปโหลดเข้าสู่ Google Play Console</span>
            </div>
            <p className="text-gray-400 pl-8">
              เข้าสู่ <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Google Play Console</a> &gt; สร้างแอพ &gt; ไปที่เมนู <strong>Production (การเผยแพร่)</strong> หรือ <strong>Internal Testing</strong> แล้วลากไฟล์ .aab ที่ดาวน์โหลดจากแอพนี้ขึ้นไปได้ทันที!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#252538] text-white text-xs font-bold hover:bg-[#303046] transition-colors"
        >
          เข้าใจแล้ว ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
}
