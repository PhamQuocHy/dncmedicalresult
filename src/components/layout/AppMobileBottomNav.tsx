"use client";

import { useRouter } from "next/navigation";
import {
  MobileBottomNav,
  type NavTab,
} from "@/features/dashboard/WelcomeDashboard";

/** Bottom nav dùng trên các trang ngoài dashboard (vd. /ket-qua/*). */
export function AppMobileBottomNav({
  activeTab = "home",
}: {
  activeTab?: NavTab;
}) {
  const router = useRouter();

  const onTabChange = (tab: NavTab) => {
    if (tab === "home") router.push("/dashboard");
    else if (tab === "history") router.push("/dashboard?view=history");
    else if (tab === "support") router.push("/dashboard?view=support");
    else router.push("/dashboard?view=profile");
  };

  return <MobileBottomNav activeTab={activeTab} onTabChange={onTabChange} />;
}
