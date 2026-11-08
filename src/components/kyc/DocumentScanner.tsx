"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Check,
  AlertCircle
} from "lucide-react";

interface DocumentScannerProps {
  label: string;
  subLabel?: string;
  documentType: "cnic" | "passport" | "license";
  side: "front" | "back";
  value: string;
  onChange: (dataUrl: string) => void;
}

export default function DocumentScanner({
  label,
  subLabel = "National ID, Passport, or Driver's License",
  documentType,
  side,
  value,
  onChange
}: DocumentScannerProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string>("");
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) {}
      });
      streamRef.current = null;
    }
  }, []);

  // Start camera helper with multi-level mobile browser fallbacks
  const startCamera = useCallback(async (facing: "environment" | "user" = cameraFacing) => {
    stopCamera();
    setCameraError("");
    setIsStartingCamera(true);

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported on this browser. Please use the 'Upload from Gallery' option.");
      setIsStartingCamera(false);
      return;
    }

    let stream: MediaStream | null = null;

    // Attempt 1: High-res environment camera
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
    } catch (e1) {
      // Attempt 2: Standard resolution
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: facing }
        });
      } catch (e2) {
        // Attempt 3: Any video device
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          });
        } catch (e3: any) {
          console.warn("All camera attempts failed:", e3);
          setCameraError(e3.message || "Could not access camera. Please allow camera permissions or upload a photo.");
          setIsStartingCamera(false);
          return;
        }
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn("Video play error:", err));
      }
    }
    setIsStartingCamera(false);
  }, [cameraFacing, stopCamera]);

  // When scanner modal opens, automatically start camera
  useEffect(() => {
    if (isScannerOpen) {
      setCapturedPreview(null);
      startCamera(cameraFacing);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScannerOpen, cameraFacing, startCamera, stopCamera]);

  // Ensure stream attaches as soon as the video element mounts
  const handleVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current && node.srcObject !== streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch((err) => console.warn("Ref play error:", err));
    }
  }, []);

  // Toggle front vs rear camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Capture current frame from video stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedPreview(dataUrl);
        stopCamera();
      }
    } catch (e) {
      console.error("Frame capture error:", e);
    }
  };

  // User accepts captured photo
  const handleConfirmCaptured = () => {
    if (capturedPreview) {
      onChange(capturedPreview);
      setIsScannerOpen(false);
      setCapturedPreview(null);
    }
  };

  // User retakes photo
  const handleRetakeInModal = () => {
    setCapturedPreview(null);
    startCamera(cameraFacing);
  };

  // Close scanner modal
  const handleCloseScanner = () => {
    stopCamera();
    setIsScannerOpen(false);
    setCapturedPreview(null);
  };

  // Handle standard file upload from disk or gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please select a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2.5">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Label and Sub-header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            {label}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {subLabel}
          </span>
        </div>
      </div>

      {/* STATE 1: Already Captured / Uploaded Photo Preview Card */}
      {value ? (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-black/60 border border-slate-200 dark:border-white/10 flex items-center justify-center max-h-56">
            <img 
              src={value} 
              alt={label} 
              className="max-h-52 w-auto object-contain rounded-md shadow-sm"
            />
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <CheckCircle2 className="w-3 h-3" />
              <span>Captured</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Photo ready for verification</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline px-2.5 py-1 rounded-lg bg-orange-500/10 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: Empty Card with Clean Actions */
        <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 bg-slate-50/70 dark:bg-black/20 text-center space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {/* Primary Action: Open Full Live Scanner */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Camera className="w-4 h-4" />
              <span>Scan with Camera</span>
            </button>

            {/* Secondary Action: Upload from Disk / Gallery */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from Gallery</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Upload a clear, high-resolution photo of your original government-issued document
          </p>
        </div>
      )}

      {/* =========================================================================
          FULL-SCREEN IMMERSIVE LIVE CAMERA SCANNER MODAL
      ========================================================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
          
          {/* Top Control Strip */}
          <div className="relative z-20 px-4 py-3.5 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                {documentType.toUpperCase()} {side.toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-300">• Scanner</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Flip camera */}
              {!capturedPreview && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white transition"
                  title="Switch Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              {/* Close scanner */}
              <button
                type="button"
                onClick={handleCloseScanner}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Camera Viewport / Preview */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
            {capturedPreview ? (
              /* Review Captured Snapshot */
              <div className="relative max-h-full max-w-full p-4 flex flex-col items-center justify-center">
                <img
                  src={capturedPreview}
                  alt="Captured document"
                  className="max-h-[70vh] w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
                />
                <span className="mt-3 text-xs text-white/90 font-medium">
                  Review clarity: Ensure all text and corners are clearly legible without blur.
                </span>
              </div>
            ) : cameraError ? (
              /* Error State */
              <div className="p-6 text-center space-y-3 max-w-xs text-white">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-xs text-slate-300">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseScanner();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold"
                >
                  Choose from Gallery
                </button>
              </div>
            ) : (
              /* Live Video Viewfinder with Card Frame Guide */
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={handleVideoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Card Outline Guide (1.58:1 Ratio) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                  <div className="relative w-full max-w-[92%] sm:max-w-md aspect-[1.58/1] rounded-xl border-2 border-orange-500/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] flex items-center justify-center">
                    
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-orange-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-orange-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-orange-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-orange-400 rounded-br-lg" />

                    {/* Laser Alignment Line */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-pulse" />

                    <div className="absolute -bottom-8 inset-x-0 text-center">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-orange-300 border border-orange-500/40">
                        Align card completely inside this frame
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="relative z-20 p-5 bg-gradient-to-t from-black/95 to-transparent flex items-center justify-center gap-4">
            {capturedPreview ? (
              /* Actions after capturing */
              <div className="flex items-center gap-3 w-full max-w-sm">
                <button
                  type="button"
                  onClick={handleRetakeInModal}
                  className="flex-1 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCaptured}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </div>
            ) : (
              /* Shutter Button */
              <button
                type="button"
                onClick={handleCapture}
                disabled={isStartingCamera || !!cameraError}
                className="w-18 h-18 rounded-full border-4 border-white/80 bg-gradient-to-tr from-orange-500 to-rose-500 p-1 flex items-center justify-center shadow-2xl active:scale-95 transition disabled:opacity-50"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-orange-600">
                  <Camera className="w-6 h-6" />
                </div>
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
