import JSZip from 'jszip';

export interface SampleTemplate {
  id: string;
  name: string;
  type: 'google_ai_studio' | 'native_gradle';
  description: string;
  badge: string;
  icon: string;
  suggestedPackage: string;
  version: string;
}

export const SAMPLE_TEMPLATES: SampleTemplate[] = [
  {
    id: 'ai-studio-finance',
    name: 'AI Studio: Smart Finance Tracker',
    type: 'google_ai_studio',
    description: 'โปรเจกต์ React + Vite ส่งออกจาก Google AI Studio พร้อมระบบกราฟและ Local Storage',
    badge: 'Google AI Studio',
    icon: '📊',
    suggestedPackage: 'com.aistudio.financetracker',
    version: '1.0.0',
  },
  {
    id: 'ai-studio-iot',
    name: 'AI Studio: Smart Home IoT Dashboard',
    type: 'google_ai_studio',
    description: 'โปรเจกต์ React + Tailwind CSS หน้าควบคุมอุปกรณ์ IoT รองรับ Dark Mode เต็มรูปแบบ',
    badge: 'Google AI Studio',
    icon: '⚡',
    suggestedPackage: 'com.aistudio.smarthome',
    version: '2.1.0',
  },
  {
    id: 'native-kotlin-compose',
    name: 'Native Android: Jetpack Compose Tasks',
    type: 'native_gradle',
    description: 'โปรเจกต์ Native Android (Gradle + Kotlin) พร้อม AndroidManifest.xml และ Gradle scripts',
    badge: 'Native Android (Gradle)',
    icon: '🤖',
    suggestedPackage: 'com.android.pro.tasks',
    version: '1.2.0',
  },
];

export async function createTemplateZip(templateId: string): Promise<File> {
  const zip = new JSZip();

  if (templateId === 'native-kotlin-compose') {
    // Native Android Structure
    zip.file('build.gradle', `plugins {
    id 'com.android.application' version '8.2.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.22' apply false
}`);
    zip.file('settings.gradle', `rootProject.name = "JetpackTasks"
include ':app'`);
    zip.file('app/build.gradle', `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}
android {
    namespace 'com.android.pro.tasks'
    compileSdk 35
    defaultConfig {
        applicationId "com.android.pro.tasks"
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName "1.2.0"
    }
}`);
    zip.file('app/src/main/AndroidManifest.xml', `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.android.pro.tasks">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:label="Jetpack Tasks"
        android:icon="@drawable/ic_launcher">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`);
    zip.file('app/src/main/java/com/android/pro/tasks/MainActivity.kt', `package com.android.pro.tasks
import android.os.Bundle
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }
}`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return new File([blob], 'native-android-tasks.zip', { type: 'application/zip' });
  }

  // Google AI Studio template
  zip.file('metadata.json', JSON.stringify({
    name: templateId === 'ai-studio-finance' ? 'AI Studio Finance Tracker' : 'AI Studio Smart Home',
    description: 'Exported from Google AI Studio',
    majorCapabilities: ['MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API'],
  }, null, 2));

  zip.file('package.json', JSON.stringify({
    name: templateId === 'ai-studio-finance' ? 'finance-tracker' : 'smart-home-iot',
    version: '1.0.0',
    type: 'module',
    scripts: { dev: 'vite', build: 'vite build' },
    dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0', lucide: '^0.400.0' },
  }, null, 2));

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7b88ff"/>
      <stop offset="100%" stop-color="#38e08c"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="28" fill="url(#g)"/>
  <text x="50" y="66" font-size="48" text-anchor="middle">${templateId === 'ai-studio-finance' ? '📈' : '💡'}</text>
</svg>`;
  zip.file('icon.svg', iconSvg);
  zip.file('public/icon.svg', iconSvg);

  zip.file('index.html', `<!doctype html>
<html lang="th">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/icon.svg" />
    <title>${templateId === 'ai-studio-finance' ? 'Finance Tracker Pro' : 'Smart Home Control'}</title>
</head>
<body style="margin:0; background:#0f0f13; color:#fff; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh;">
    <div style="background:#1e1e24; border-radius:24px; padding:32px; border:1px solid #333342; text-align:center; max-width:360px; margin:20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="font-size:48px; margin-bottom:12px;">${templateId === 'ai-studio-finance' ? '📈' : '💡'}</div>
        <h2 style="margin:0 0 8px 0; font-size:22px;">${templateId === 'ai-studio-finance' ? 'Smart Finance Tracker' : 'Smart Home IoT'}</h2>
        <p style="color:#aaa; font-size:14px; margin-bottom:24px;">สร้างจาก Google AI Studio แปลงเป็น APK สำเร็จและทำงานได้ลื่นไหล</p>
        <button style="background:#7b88ff; color:#0f0f13; border:none; padding:12px 24px; border-radius:999px; font-weight:bold; font-size:15px; cursor:pointer;" onclick="alert('แอปทำงานสมบูรณ์!')">
            ทดสอบการทำงาน
        </button>
    </div>
</body>
</html>`);

  zip.file('src/App.tsx', `export default function App() { return <div>App Loaded!</div>; }`);
  zip.file('src/main.tsx', `console.log("App initialized");`);

  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = templateId === 'ai-studio-finance' ? 'google-ai-studio-finance.zip' : 'google-ai-studio-smarthome.zip';
  return new File([blob], filename, { type: 'application/zip' });
}
