import {
  MOCK_KHTH_ACCOUNTS,
  MOCK_OTP,
  khthPatients,
  patient,
  visits,
} from "@/data/mock";
import type { LookupPayload } from "@/types";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requestOtp(payload: LookupPayload) {
  await delay();
  if (!payload.turnstileToken) {
    throw new ApiError("Vui lòng xác thực chống bot", 400);
  }
  if (payload.maKcb.length < 6 || payload.phone.length < 9) {
    throw new ApiError("Thông tin không hợp lệ", 400);
  }

  const maKcb = payload.maKcb.trim();
  const phone = payload.phone.trim().replace(/\s+/g, "");
  if (maKcb !== patient.maKcb || phone !== patient.phone) {
    throw new ApiError(
      "Mã khám chữa bệnh hoặc số điện thoại chưa đúng vui lòng nhập",
      400,
    );
  }

  return {
    success: true as const,
    message: "Đã gửi mã OTP tới số điện thoại",
    expiresIn: 180,
  };
}

export async function verifyOtp(otp: string) {
  await delay(500);
  if (otp !== MOCK_OTP) {
    throw new ApiError("Mã OTP không đúng", 400);
  }
  return {
    success: true as const,
    token: `mock-token-${Date.now()}`,
    patient,
  };
}

export async function resendOtp() {
  await delay(400);
  return { success: true as const, expiresIn: 180 };
}

export async function fetchPatientDashboard() {
  await delay(300);
  return { patient, visits };
}

export async function logoutApi() {
  await delay(100);
  return { success: true as const };
}

export async function loginKhth(payload: {
  username: string;
  password: string;
}) {
  await delay(500);
  const username = payload.username.trim();
  const password = payload.password;
  if (!username || !password) {
    throw new ApiError("Vui lòng nhập tài khoản và mật khẩu", 400);
  }

  const account = MOCK_KHTH_ACCOUNTS.find(
    (a) => a.username === username && a.password === password,
  );
  if (!account) {
    throw new ApiError("Tài khoản hoặc mật khẩu không đúng", 401);
  }

  return {
    success: true as const,
    token: `khth-token-${Date.now()}`,
    username: account.username,
    displayName: account.displayName,
    role: "khth" as const,
  };
}

export async function fetchKhthPatients() {
  await delay(350);
  return {
    patients: [...khthPatients].sort((a, b) =>
      b.visitDate.localeCompare(a.visitDate),
    ),
  };
}
