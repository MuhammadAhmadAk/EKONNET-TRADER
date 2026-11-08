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
  AlertCircle,
  UserCheck
} from "lucide-react";

interface LiveSelfieScannerProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

export default function LiveSelfieScanner({
  value,
  onChange
}: LiveSelfieScannerProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string>("");
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<any>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) {}
      });
      streamRef.current = null;
    }
  }, []);

  // Start front selfie camera helper with multi-level fallbacks
  const startCamera = useCallback(async (facing: "user" | "environment" = cameraFacing) => {
    stopCamera();
    setCameraError("");
    setIsStartingCamera(true);

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported on this browser. Please use the 'Upload Selfie from Gallery' option.");
      setIsStartingCamera(false);
      return;
    }

    let stream: MediaStream | null = null;

    // Attempt 1: HD user/front camera
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    } catch (e1) {
      // Attempt 2: Standard user facing
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
          console.warn("Selfie camera start failed:", e3);
          setCameraError(e3.message || "Could not access front camera. Please allow camera permissions or upload a photo.");
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
    const nextFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Capture current frame from video stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror horizontally if user facing
        if (cameraFacing === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedPreview(dataUrl);
        stopCamera();
      }
    } catch (e) {
      console.error("Selfie frame capture error:", e);
    }
  };

  // Optional 3-second countdown capture
  const handleCountdownCapture = () => {
    if (countdown !== null) return;
    setCountdown(3);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          handleCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Confirm and use captured photo
  const handleConfirmCaptured = () => {
    if (capturedPreview) {
      onChange(capturedPreview);
      setIsScannerOpen(false);
      setCapturedPreview(null);
    }
  };

  // Retake in modal
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

  // Handle standard file upload
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
    <div className="space-y-3">
      {/* Hidden file input with selfie front capture attribute */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* STATE 1: Already Captured Selfie Preview */}
      {value ? (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-3 text-center">
          <div className="relative inline-block mx-auto rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md">
            <img 
              src={value} 
              alt="Selfie Preview" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full"
            />
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>Face Biometric Verified</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline px-3 py-1.5 rounded-lg bg-orange-500/10 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Selfie</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: Empty Card with Big Full Camera Trigger */
        <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 bg-slate-50/70 dark:bg-black/20 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-orange-500/20 to-rose-500/20 border border-orange-500/40 flex items-center justify-center text-orange-500 shadow-sm">
            <Camera className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Take a Clear Facial Selfie
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Button dabane par poora front camera biometric oval guide ke saath open ho jayega.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            {/* Primary Action: Open Full Selfie Camera */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Open Selfie Camera</span>
            </button>

            {/* Secondary Action: Upload from Gallery */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload from Gallery</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL-SCREEN IMMERSIVE PORTRAIT SELFIE CAMERA MODAL (NOT JUST A CARD)
      ========================================================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
          
          {/* Top Control Strip */}
          <div className="relative z-20 px-4 py-3.5 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Face Biometric Verification
              </span>
              <span className="text-[11px] text-slate-300">• Full Selfie Camera</span>
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

          {/* Central Full Portrait Viewport */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
            {capturedPreview ? (
              /* Review Captured Snapshot */
              <div className="relative max-h-full max-w-full p-4 flex flex-col items-center justify-center">
                <img
                  src={capturedPreview}
                  alt="Captured selfie"
                  className="max-h-[70vh] w-auto object-contain rounded-2xl border border-white/20 shadow-2xl"
                />
                <span className="mt-3 text-xs text-white/90 font-medium">
                  Selfie check: Kiya chehra bilkul saaf aur seedha dikh raha hai?
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
              /* Live Video Viewfinder with Portrait Face Biometric Oval */
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={handleVideoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${cameraFacing === "user" ? "scale-x-[-1]" : ""}`}
                />

                {/* Biometric Face Oval Guide (Vertical / Human Head Shape) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                  <div className="relative w-64 sm:w-72 h-80 sm:h-92 rounded-[50%] border-2 border-dashed border-orange-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] flex items-center justify-center">
                    
                    {/* Pulsing Target Ring */}
                    <div className="absolute inset-0 rounded-[50%] border border-cyan-400/40 animate-ping opacity-25" />

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                      <div className="w-20 h-20 rounded-full bg-orange-500 text-white font-black text-4xl flex items-center justify-center shadow-2xl animate-bounce">
                        {countdown}
                      </div>
                    )}

                    <div className="absolute -bottom-8 inset-x-0 text-center">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-orange-300 border border-orange-500/40">
                        Position face inside oval &amp; look directly at camera
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
                  <span>Retake Selfie</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCaptured}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Selfie</span>
                </button>
              </div>
            ) : (
              /* Shutter Controls */
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleCountdownCapture}
                  disabled={isStartingCamera || !!cameraError || countdown !== null}
                  className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition"
                >
                  3s Timer
                </button>

                {/* Main Shutter Button */}
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={isStartingCamera || !!cameraError || countdown !== null}
                  className="w-18 h-18 rounded-full border-4 border-white/80 bg-gradient-to-tr from-orange-500 to-rose-500 p-1 flex items-center justify-center shadow-2xl active:scale-95 transition disabled:opacity-50"
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-orange-600">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
