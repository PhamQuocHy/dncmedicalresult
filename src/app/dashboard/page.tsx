"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Activity,
  Ambulance,
  Bone,
  Brain,
  ClipboardPlus,
  Droplets,
  HeartPulse,
  Hospital,
  Microscope,
  Pill,
  ScanLine,
  Stethoscope,
  Thermometer,
  UserRound,
} from "lucide-react";
import { PatientProfile } from "@/components/patient/PatientProfile";
import { PatientProfileModal } from "@/components/patient/PatientProfileModal";
import { ResultPageHeader } from "@/components/layout/ResultPageHeader";
import { PageFooter } from "@/components/layout/PageFooter";
import { LatestResultsView } from "@/features/dashboard/LatestResultsView";
import { MedicalHistoryList } from "@/features/dashboard/MedicalHistoryList";
import {
  DashboardTopBar,
  MobileBottomNav,
  WelcomeDashboard,
} from "@/features/dashboard/WelcomeDashboard";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchPatientDashboard } from "@/lib/api";
import { contactLinks, labResultDetail } from "@/data/mock";
import type { Patient, Visit } from "@/types";
import {
  BRAND,
  BRAND_DARK,
  CARD_RADIUS,
  INK,
  LINE,
  MUTED,
  SHADOW,
} from "@/theme/dashboardTokens";

type DashboardView = "welcome" | "latest" | "history" | "profile" | "support";

const VIEW_TITLE: Record<Exclude<DashboardView, "welcome" | "latest">, string> =
  {
    history: "Tra cứu lịch sử",
    profile: "Thông tin cá nhân",
    support: "Hỗ trợ dịch vụ",
  };

const bgIcons = [
  { Icon: Stethoscope, className: "top-[10%] left-[4%] h-16 w-16 rotate-[-18deg] opacity-[0.07]" },
  { Icon: HeartPulse, className: "top-[14%] right-[5%] h-14 w-14 rotate-[12deg] opacity-[0.07]" },
  { Icon: Microscope, className: "top-[36%] left-[3%] h-16 w-16 rotate-[8deg] opacity-[0.06]" },
  { Icon: Pill, className: "top-[32%] right-[4%] h-14 w-14 rotate-[-12deg] opacity-[0.07]" },
  { Icon: Thermometer, className: "top-[22%] left-[18%] h-12 w-12 rotate-[16deg] opacity-[0.06]" },
  { Icon: Brain, className: "top-[20%] right-[16%] h-14 w-14 rotate-[-8deg] opacity-[0.06]" },
  { Icon: Hospital, className: "bottom-[18%] left-[6%] h-16 w-16 rotate-[6deg] opacity-[0.07]" },
  { Icon: ScanLine, className: "bottom-[12%] left-[34%] h-14 w-14 rotate-[-10deg] opacity-[0.06]" },
  { Icon: Ambulance, className: "bottom-[16%] right-[7%] h-16 w-16 rotate-[10deg] opacity-[0.07]" },
  { Icon: Droplets, className: "bottom-[6%] right-[28%] h-12 w-12 rotate-[-14deg] opacity-[0.06]" },
  { Icon: ClipboardPlus, className: "bottom-[28%] left-[24%] h-14 w-14 rotate-[8deg] opacity-[0.06]" },
  { Icon: Bone, className: "bottom-[26%] right-[22%] h-14 w-14 rotate-[-6deg] opacity-[0.06]" },
  { Icon: UserRound, className: "top-[46%] left-[10%] h-12 w-12 rotate-[4deg] opacity-[0.05]" },
  { Icon: Activity, className: "top-[48%] right-[10%] h-12 w-12 rotate-[-4deg] opacity-[0.05]" },
] as const;

function parseVisitDate(dateStr: string): Date | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateStr.trim());
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const y = Number(m[3]);
  const date = new Date(y, mo, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

const VIEW_PARAM: DashboardView[] = [
  "welcome",
  "latest",
  "history",
  "profile",
  "support",
];

function parseViewParam(value: string | null): DashboardView | null {
  if (!value) return null;
  return VIEW_PARAM.includes(value as DashboardView)
    ? (value as DashboardView)
    : null;
}

function DashboardLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f8fafb",
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <CircularProgress size={32} thickness={4} sx={{ color: "#1a73e8" }} />
        <Typography sx={{ fontSize: 15, color: "#6B7280" }}>
          Đang tải hồ sơ bệnh nhân...
        </Typography>
      </Stack>
    </Box>
  );
}

function DashboardPageContent() {
  const { ready, handleLogout } = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filters, setFilters] = useState({ q: "", from: "", to: "" });
  const [profileOpen, setProfileOpen] = useState(
    () => searchParams.get("view") === "profile",
  );
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(
    () => searchParams.get("visit"),
  );
  const [activeView, setActiveView] = useState<DashboardView>(() => {
    const fromUrl = parseViewParam(searchParams.get("view")) ?? "welcome";
    // Thông tin mở modal — không dùng trang profile riêng
    return fromUrl === "profile" ? "welcome" : fromUrl;
  });

  const openVisit = useCallback(
    (visitId: string) => {
      setProfileOpen(false);
      setSelectedVisitId(visitId);
      setActiveView("latest");
      router.replace(`/dashboard?view=latest&visit=${visitId}`, {
        scroll: false,
      });
    },
    [router],
  );

  const navigate = useCallback(
    (view: DashboardView) => {
      if (view === "profile") {
        setProfileOpen(true);
        return;
      }
      setProfileOpen(false);
      setActiveView(view);
      if (view === "welcome") {
        setSelectedVisitId(null);
        router.replace("/dashboard", { scroll: false });
      } else if (view === "latest") {
        const id = selectedVisitId;
        if (id) {
          router.replace(`/dashboard?view=latest&visit=${id}`, {
            scroll: false,
          });
        } else {
          router.replace("/dashboard?view=latest", { scroll: false });
        }
      } else {
        setSelectedVisitId(null);
        router.replace(`/dashboard?view=${view}`, { scroll: false });
      }
    },
    [router, selectedVisitId],
  );

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
    if (searchParams.get("view") === "profile") {
      router.replace("/dashboard", { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    const fromUrl = parseViewParam(searchParams.get("view")) ?? "welcome";
    const visitId = searchParams.get("visit");
    if (fromUrl === "profile") {
      setProfileOpen(true);
      setActiveView((prev) => (prev === "profile" ? "welcome" : prev));
      return;
    }
    setActiveView((prev) => (prev === fromUrl ? prev : fromUrl));
    setSelectedVisitId(visitId);
  }, [searchParams]);

  useEffect(() => {
    if (!ready) return;
    void fetchPatientDashboard().then((data) => {
      setPatient(data.patient);
      setVisits(data.visits);
    });
  }, [ready]);

  const latestVisit = visits[0] ?? null;
  const olderVisits = visits.slice(1);
  const selectedVisit = useMemo(() => {
    if (selectedVisitId) {
      return visits.find((v) => v.id === selectedVisitId) ?? latestVisit;
    }
    return latestVisit;
  }, [visits, selectedVisitId, latestVisit]);

  const filteredOlder = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;
    if (to) to.setHours(23, 59, 59, 999);

    return olderVisits.filter((v) => {
      if (q) {
        const hit =
          v.title.toLowerCase().includes(q) ||
          v.doctor.toLowerCase().includes(q) ||
          v.department.toLowerCase().includes(q) ||
          v.previews.some(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.subtitle.toLowerCase().includes(q),
          );
        if (!hit) return false;
      }

      if (from || to) {
        const vd = parseVisitDate(v.date);
        if (!vd) return true;
        if (from && vd < from) return false;
        if (to && vd > to) return false;
      }

      return true;
    });
  }, [olderVisits, filters]);

  if (!ready || !patient) {
    return <DashboardLoading />;
  }

  const showMainChrome =
    activeView === "welcome" ||
    activeView === "history" ||
    activeView === "support";

  const topTab = profileOpen
    ? "info"
    : activeView === "history"
      ? "history"
      : "home";

  const bottomTab = profileOpen
    ? "info"
    : activeView === "history"
      ? "history"
      : activeView === "support"
        ? "support"
        : "home";

  const handleMainNav = (tab: "home" | "history" | "info" | "support") => {
    if (tab === "home") navigate("welcome");
    else if (tab === "history") navigate("history");
    else if (tab === "support") navigate("support");
    else navigate("profile");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafb",
      }}
    >
      {showMainChrome ? (
        <DashboardTopBar
          activeTab={topTab}
          onTabChange={handleMainNav}
          onLogout={handleLogout}
        />
      ) : (
        <ResultPageHeader
          title={
            activeView === "latest"
              ? undefined
              : VIEW_TITLE[activeView as Exclude<DashboardView, "welcome" | "latest">]
          }
          showLogo={activeView === "latest"}
          showBack={activeView !== "latest"}
          onBack={() => navigate("welcome")}
          showDownload={activeView === "latest"}
          showSupport
        />
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          pb: { xs: 9, sm: 0 },
        }}
      >
        <Box
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[#8ab4f8]"
        >
          {bgIcons.map(({ Icon, className }, i) => (
            <Icon
              key={i}
              strokeWidth={1.25}
              className={`absolute ${className}`}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, sm: 10 },
            py: { xs: 2.5, sm: "35px" },
          }}
        >
          {activeView === "welcome" ? (
            <WelcomeDashboard
              patient={patient}
              visits={visits}
              latestVisit={latestVisit}
              lab={labResultDetail}
              onNavigate={navigate}
              onOpenVisit={openVisit}
            />
          ) : activeView === "latest" && selectedVisit ? (
            <LatestResultsView
              patient={patient}
              visit={selectedVisit}
              lab={selectedVisit.labPreviewDetail ?? labResultDetail}
            />
          ) : (
            <Stack spacing={2.25}>
              {activeView === "history" ? (
                <>
                  <PatientProfile patient={patient} compact />
                  <MedicalHistoryList
                    visits={filteredOlder}
                    onSearch={setFilters}
                    totalCount={filteredOlder.length}
                    onOpenVisit={openVisit}
                  />
                </>
              ) : null}
              {activeView === "support" ? (
                <Box
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: CARD_RADIUS,
                    boxShadow: SHADOW,
                    border: `1px solid ${LINE}`,
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Typography
                    sx={{ fontSize: 17, fontWeight: 600, color: INK }}
                  >
                    Hỗ trợ dịch vụ
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.75,
                      fontSize: 15,
                      color: MUTED,
                      lineHeight: 1.6,
                    }}
                  >
                    Liên hệ tổng đài hoặc kênh hỗ trợ khi cần tư vấn, đặt lịch
                    hoặc chăm sóc sau khám.
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    sx={{ mt: 2.5 }}
                  >
                    <Button
                      component="a"
                      href={`tel:${contactLinks.phone}`}
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        bgcolor: BRAND,
                        boxShadow: "none",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: BRAND_DARK,
                          boxShadow: "none",
                        },
                      }}
                    >
                      Gọi {contactLinks.phone}
                    </Button>
                    <Button
                      component={Link}
                      href={contactLinks.messenger}
                      variant="outlined"
                      sx={{
                        borderRadius: 999,
                        borderColor: LINE,
                        color: INK,
                        fontWeight: 500,
                        textTransform: "none",
                      }}
                    >
                      Messenger
                    </Button>
                    <Button
                      component={Link}
                      href={contactLinks.zalo}
                      variant="outlined"
                      sx={{
                        borderRadius: 999,
                        borderColor: LINE,
                        color: INK,
                        fontWeight: 500,
                        textTransform: "none",
                      }}
                    >
                      Zalo
                    </Button>
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          )}
        </Box>
      </Box>

      <PageFooter />

      <MobileBottomNav activeTab={bottomTab} onTabChange={handleMainNav} />

      <PatientProfileModal
        open={profileOpen}
        patient={patient}
        onClose={closeProfile}
      />
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
