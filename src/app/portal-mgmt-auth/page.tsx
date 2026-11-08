"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalMgmtAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center text-xs text-slate-500 font-mono">
      Redirecting to Dedicated Management &amp; Admin Gate...
    </div>
  );
}
