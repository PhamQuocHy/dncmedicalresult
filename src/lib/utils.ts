import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function validateMaKcb(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Vui lòng nhập mã khám chữa bệnh";
  if (trimmed.length < 6) return "Mã khám chữa bệnh không hợp lệ";
  return null;
}

export function validatePhone(value: string) {
  const trimmed = value.trim().replace(/\s/g, "");
  if (!trimmed) return "Vui lòng nhập số điện thoại";
  if (!/^(0|\+84)[0-9]{8,10}$/.test(trimmed)) {
    return "Số điện thoại không đúng định dạng";
  }
  return null;
}

export function statusLabelVi(status: string) {
  switch (status) {
    case "normal":
      return "Bình thường";
    case "low":
      return "Giảm";
    case "high":
      return "Tăng";
    case "critical":
      return "Nghiêm trọng";
    default:
      return status;
  }
}
