import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { BuildLog } from '../types';

interface BuildProgressModalProps {
  isOpen: boolean;
  progressPercent: number;
  currentPhase: string;
  logs: BuildLog[];
  format: string;
}

export function BuildProgressModal({
  isOpen,
  progressPercent,
  currentPhase,
  logs,
  format,
}: BuildProgressModalProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#14141c] rounded-3xl border border-[#2e2e42] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#252535] bg-[#181824] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Cpu className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                กำลังคอมไพล์และสร้าง {format.toUpperCase()}
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                  {progressPercent}%
                </span>
              </h3>
              <p className="text-xs text-gray-400">{currentPhase}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202030] text-[11px] font-mono text-gray-300 border border-[#2e2e44]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Sign V2</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#1b1b26] h-2">
          <div
            className="h-full bg-gradient-to-r from-[#7b88ff] via-[#9373ee] to-[#38e08c] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Terminal Logs Window */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-[#0e0e14]">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#20202e] text-gray-500 text-[11px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>APK BUILDER PRO - ENGINE CONSOLE OUTPUT</span>
          </div>

          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-gray-500 select-none shrink-0 font-mono text-[10px]">
                [{log.timestamp}]
              </span>
              <span
                className={`flex-1 break-words ${
                  log.level === 'success'
                    ? 'text-emerald-400 font-bold'
                    : log.level === 'warn'
                    ? 'text-amber-400'
                    : log.level === 'error'
                    ? 'text-rose-400 font-bold'
                    : 'text-gray-300'
                }`}
              >
                {log.level === 'success' && '✓ '}
                {log.level === 'error' && '✕ '}
                {log.message}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#181824] border-t border-[#252535] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span>ทำงานในหน่วยความจำของอุปกรณ์ (Client-Side Safe)</span>
          </div>
          <span className="font-mono text-gray-500">{progressPercent}/100</span>
        </div>
      </div>
    </div>
  );
}
