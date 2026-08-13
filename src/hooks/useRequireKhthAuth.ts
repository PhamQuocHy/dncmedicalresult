"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearKhthSession,
  clearSession,
  getKhthSession,
  logoutAndRedirect,
  type KhthSessionData,
} from "@/lib/session";
import { logoutApi } from "@/lib/api";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";

export function useRequireKhthAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<KhthSessionData | null>(null);

  useEffect(() => {
    const khth = getKhthSession();
    if (!khth) {
      router.replace("/login-khth");
      return;
    }
    setSession(khth);
    setReady(true);
  }, [router]);

  const handleLogout = async () => {
    try {
      void logoutApi();
    } finally {
      clearSession();
      clearKhthSession();
      router.replace("/login-khth");
    }
  };

  useIdleTimeout({
    enabled: ready,
    onIdle: () => logoutAndRedirect(),
  });

  return { ready, session, handleLogout };
}
