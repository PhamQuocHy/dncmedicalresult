"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import type { ImagingResultDetail } from "@/types";
import { CARD_RADIUS, G, SHADOW } from "@/theme/dashboardTokens";

const DEFAULT_ZOOM = 100;

type Props = {
  detail: ImagingResultDetail;
};

/** Icon tonal bo góc — cùng style Chi tiết kết quả (Google UI) */
function GoogleIcon({
  Icon,
  color,
  bg,
  size = 36,
}: {
  Icon: SvgIconComponent;
  color: string;
  bg: string;
  size?: number;
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "12px",
        bgcolor: bg,
        color,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: size * 0.55 }} />
    </Box>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        borderRadius: "10px",
        px: 1.35,
        py: 1,
        minHeight: 52,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: G.secondary }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: 15,
          fontWeight: 500,
          color: G.ink,
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function ToolBtn({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      size="small"
      aria-label={label}
      onClick={onClick}
      sx={{
        color: active ? "#fff" : "rgba(255,255,255,0.85)",
        width: 30,
        height: 30,
        borderRadius: "8px",
        bgcolor: active ? "rgba(26,115,232,0.45)" : "transparent",
        "&:hover": {
          bgcolor: active ? "rgba(26,115,232,0.55)" : "rgba(255,255,255,0.12)",
        },
      }}
    >
      {children}
    </IconButton>
  );
}

export function ImagingResultView({ detail }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panMode, setPanMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const image = detail.images[active] ?? detail.images[0];

  const resetView = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setPanMode(false);
  }, []);

  const selectImage = useCallback(
    (idx: number) => {
      setActive(idx);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
      setZoom(DEFAULT_ZOOM);
    },
    [],
  );

  const toggleFullscreen = useCallback(async () => {
    const el = viewerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore unsupported / blocked fullscreen */
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) =>
        Math.min(300, Math.max(40, z + (e.deltaY < 0 ? 10 : -10))),
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!panMode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!panMode || !dragging) return;
    setOffset({
      x: dragOrigin.current.ox + (e.clientX - dragOrigin.current.x),
      y: dragOrigin.current.oy + (e.clientY - dragOrigin.current.y),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 1.15fr) minmax(300px, 0.9fr)",
        },
        alignItems: "stretch",
        minHeight: { lg: "calc(100vh - 200px)" },
        mb: { xs: 1, sm: 0 },
      }}
    >
      {/* Viewer — chiều cao cố định, không co giãn theo ảnh */}
      <Box
        ref={viewerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { xs: 560, sm: 600, lg: "100%" },
          minHeight: { xs: 560, sm: 600, lg: 520 },
          maxHeight: { xs: 560, sm: 600, lg: "none" },
          borderRadius: CARD_RADIUS,
          overflow: "hidden",
          bgcolor: "#202124",
          boxShadow: SHADOW,
          position: "relative",
          zIndex: 0,
          ":fullscreen": {
            borderRadius: 0,
            width: "100vw",
            height: "100vh",
            maxHeight: "none",
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.25,
            py: 0.85,
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Stack
            direction="row"
            spacing={0.15}
            sx={{
              bgcolor: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              p: 0.25,
            }}
          >
            <ToolBtn
              label="Phóng to"
              onClick={() => setZoom((z) => Math.min(300, z + 15))}
            >
              <ZoomInRoundedIcon sx={{ fontSize: 18 }} />
            </ToolBtn>
            <ToolBtn
              label="Thu nhỏ"
              onClick={() => setZoom((z) => Math.max(40, z - 15))}
            >
              <ZoomOutRoundedIcon sx={{ fontSize: 18 }} />
            </ToolBtn>
            <ToolBtn
              label="Di chuyển"
              active={panMode}
              onClick={() => setPanMode((v) => !v)}
            >
              <PanToolAltOutlinedIcon sx={{ fontSize: 18 }} />
            </ToolBtn>
            <ToolBtn label="Đặt lại" onClick={resetView}>
              <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
            </ToolBtn>
            <ToolBtn
              label="Xoay trái"
              onClick={() => setRotation((r) => r - 90)}
            >
              <RotateLeftRoundedIcon sx={{ fontSize: 18 }} />
            </ToolBtn>
            <ToolBtn
              label="Xoay phải"
              onClick={() => setRotation((r) => r + 90)}
            >
              <RotateRightRoundedIcon sx={{ fontSize: 18 }} />
            </ToolBtn>
            <ToolBtn
              label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <FullscreenExitRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <FullscreenRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </ToolBtn>
          </Stack>

          <Box
            sx={{
              textAlign: "right",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.4,
              }}
            >
              DOB: {detail.dob} · ID: {detail.patientCode}
            </Typography>
          </Box>
        </Stack>

        <Box
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          sx={{
            position: "relative",
            flex: "1 1 auto",
            minHeight: 0,
            overflow: "hidden",
            cursor: panMode ? (dragging ? "grabbing" : "grab") : "default",
            userSelect: "none",
            touchAction: panMode ? "none" : "pan-y",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              px: 1.5,
              py: 1.25,
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.label}
              draggable={false}
              sx={{
                maxWidth: "92%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: dragging ? "none" : "transform 150ms ease",
                filter: "contrast(1.05) brightness(1.02)",
                pointerEvents: "none",
                borderRadius: "4px",
              }}
            />
          </Box>
          <Typography
            sx={{
              position: "absolute",
              left: 12,
              bottom: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.4,
            }}
          >
            W: {detail.windowLevel.w} L: {detail.windowLevel.l} · Zoom: {zoom}%
            {rotation % 360 !== 0 ? ` · ${((rotation % 360) + 360) % 360}°` : ""}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: 1.5,
            pt: 1.25,
            pb: 1.5,
            bgcolor: "rgba(0,0,0,0.35)",
            flexShrink: 0,
          }}
        >
          <Typography
            align="center"
            sx={{ mb: 1, fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}
          >
            Ảnh {active + 1} / {detail.images.length}
            {image.label ? ` · ${image.label}` : ""}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
              pb: 0.5,
              mx: -0.25,
              px: 0.25,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {detail.images.map((img, idx) => (
              <Box
                key={img.id}
                component="button"
                type="button"
                aria-label={img.label || `Ảnh ${idx + 1}`}
                aria-pressed={idx === active}
                onClick={() => selectImage(idx)}
                sx={{
                  appearance: "none",
                  border: 0,
                  margin: 0,
                  padding: 0,
                  cursor: "pointer",
                  position: "relative",
                  width: { xs: 56, sm: 48 },
                  height: { xs: 56, sm: 48 },
                  flexShrink: 0,
                  borderRadius: "10px",
                  overflow: "hidden",
                  bgcolor: "#000",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  pointerEvents: "auto",
                  boxShadow:
                    idx === active
                      ? `0 0 0 2.5px ${G.blue}`
                      : "0 0 0 1px rgba(255,255,255,0.15)",
                  "&:active": {
                    opacity: 0.85,
                  },
                }}
              >
                <Box
                  component="img"
                  src={img.src}
                  alt={img.label}
                  draggable={false}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "contrast(1.05)",
                    pointerEvents: "none",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Report */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          borderRadius: CARD_RADIUS,
          bgcolor: "#fff",
          boxShadow: SHADOW,
          overflow: "hidden",
          position: "relative",
          zIndex: 0,
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 1.75, sm: 2 } }}>
          <Box sx={{ minWidth: 0, mb: 1.5 }}>
            <Typography
              sx={{
                fontSize: { xs: 18, sm: 19 },
                fontWeight: 500,
                color: G.ink,
                lineHeight: 1.3,
              }}
            >
              {detail.title}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ flexWrap: "wrap", alignItems: "center", mt: 1 }}
            >
              <Chip
                size="small"
                icon={
                  <CheckCircleOutlineRoundedIcon
                    sx={{ fontSize: "18px !important" }}
                  />
                }
                label="Đã có kết quả"
                sx={{
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: G.greenSoft,
                  color: G.green,
                  fontWeight: 500,
                  fontSize: 14,
                  letterSpacing: "0.01em",
                  border: "1px solid rgba(19,115,51,0.16)",
                  "& .MuiChip-icon": {
                    ml: "8px",
                    mr: "-2px",
                    color: G.green,
                  },
                  "& .MuiChip-label": { px: 1 },
                }}
              />
              <Typography sx={{ fontSize: 14.5, color: G.secondary }}>
                {detail.date}
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 1.25,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              mb: 2.5,
            }}
          >
            <MetaCell label="Tên bệnh nhân" value={detail.patientName} />
            <MetaCell label="Mã KCB" value={detail.maKcb} />
            <MetaCell label="Phương thức" value={detail.method} />
            <MetaCell label="Phòng" value={detail.room} />
          </Box>

          <Stack spacing={2.75}>
            <Box>
              <Stack
                direction="row"
                spacing={1.15}
                sx={{ alignItems: "center", mb: 1.15 }}
              >
                <GoogleIcon
                  Icon={ScienceOutlinedIcon}
                  color={G.blueInk}
                  bg={G.blueSoft}
                />
                <Typography
                  sx={{ fontSize: 16, fontWeight: 500, color: G.ink }}
                >
                  Chỉ định lâm sàng
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: 14.5,
                  color: G.secondary,
                  lineHeight: 1.7,
                  pl: 0.25,
                }}
              >
                {detail.indication}
              </Typography>
            </Box>

            <Box>
              <Stack
                direction="row"
                spacing={1.15}
                sx={{ alignItems: "center", mb: 1.35 }}
              >
                <GoogleIcon
                  Icon={ImageOutlinedIcon}
                  color={G.green}
                  bg={G.greenSoft}
                />
                <Typography
                  sx={{ fontSize: 16, fontWeight: 500, color: G.ink }}
                >
                  Các phát hiện chi tiết
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {detail.findings.map((f) => (
                  <Box key={f.title}>
                    <Typography
                      sx={{
                        fontSize: 14.5,
                        fontWeight: 500,
                        color: G.ink,
                        mb: 0.5,
                      }}
                    >
                      {f.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: G.secondary,
                        lineHeight: 1.7,
                      }}
                    >
                      {f.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: G.greenSoft,
                borderRadius: "12px",
                px: 1.75,
                py: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15.5,
                  fontWeight: 500,
                  color: G.green,
                  mb: 0.75,
                }}
              >
                Đánh giá
              </Typography>
              <Typography sx={{ fontSize: 14.5, color: G.ink, lineHeight: 1.7 }}>
                {detail.assessment}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right", pt: 0.5 }}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: G.secondary,
                }}
              >
                {detail.doctor}
              </Typography>
              
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
