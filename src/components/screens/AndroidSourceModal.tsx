import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidSourceFile } from '../../data/androidProjectSource';
import JSZip from 'jszip';
import {
  Download,
  FileCode,
  FolderTree,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface AndroidSourceModalProps {
  onBack: () => void;
}

export const AndroidSourceModal: React.FC<AndroidSourceModalProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(
    ANDROID_PROJECT_FILES[2] // UrduInputMethodService.kt by default
  );
  const [isZipping, setIsZipping] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add each file to ZIP with its proper nested folder structure
      ANDROID_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Add a gradle-wrapper.properties placeholder
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        'distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n'
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AsaanUrduKeyboard_Android_Studio_Project.zip';
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#145C3A]" />
            <span>Complete Android Native Project & APK Source</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Real Kotlin, Jetpack Compose, InputMethodService, DataStore, and Gradle files ready for Android Studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 bg-[#145C3A] hover:bg-[#0e432a] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            {downloadSuccess ? (
              <Check className="w-4 h-4 text-[#8CCF35]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {isZipping
                ? 'Zipping project...'
                : downloadSuccess
                ? 'Downloaded ZIP!'
                : 'Download Android Project (.zip)'}
            </span>
          </button>
        </div>
      </div>

      {/* Terminal & Build Instructions Callout */}
      <div className="bg-[#0F172A] text-slate-100 p-5 rounded-2xl shadow-md border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-[#8CCF35]" />
            <span className="font-bold">Android Studio Build & Install Commands</span>
          </div>
          <span className="text-[10px] text-slate-500">Android SDK 35 · Kotlin 2.0</span>
        </div>

        <div className="space-y-1 text-slate-300">
          <div><span className="text-emerald-400">$</span> ./gradlew assembleDebug</div>
          <div className="text-[11px] text-slate-400 pl-4">→ Outputs: app/build/outputs/apk/debug/app-debug.apk</div>
          <div className="pt-1"><span className="text-emerald-400">$</span> adb install -r app/build/outputs/apk/debug/app-debug.apk</div>
          <div className="text-[11px] text-slate-400 pl-4">→ Installs Asaan Urdu Keyboard directly on your connected Android phone</div>
        </div>
      </div>

      {/* File Explorer & Code Viewer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden min-h-[560px]">
        {/* Left Tree Explorer */}
        <div className="lg:col-span-4 border-r border-gray-200 p-3 space-y-2 bg-[#F7F9F5]">
          <div className="text-xs font-bold text-gray-700 px-2 py-1 flex items-center gap-1.5">
            <FolderTree className="w-4 h-4 text-[#145C3A]" />
            <span>Project Files Explorer</span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#145C3A] text-white font-medium shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-[#8CCF35]' : 'text-gray-400'
                      }`}
                    />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-8 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="font-mono text-xs font-bold text-gray-800">
                {selectedFile.path}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Code</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-gray-800 bg-[#F8FAFC] p-4 rounded-xl border border-gray-200 overflow-x-auto max-h-[500px] leading-relaxed selection:bg-emerald-200">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
