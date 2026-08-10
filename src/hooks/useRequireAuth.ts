"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession, logoutAndRedirect } from "@/lib/session";
import { logoutApi } from "@/lib/api";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";

export function useRequireAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  const handleLogout = async () => {
    try {
      void logoutApi();
    } finally {
      clearSession();
      router.replace("/");
    }
  };

  useIdleTimeout({
    enabled: ready,
    onIdle: () => logoutAndRedirect(),
  });

  return { ready, handleLogout };
}
