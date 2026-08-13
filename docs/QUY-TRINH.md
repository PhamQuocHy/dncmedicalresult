# Tài liệu quy trình — MDNC Patient Portal

| Mục | Nội dung |
| --- | --- |
| **Tên hệ thống** | Cổng tra cứu lịch sử khám & kết quả cận lâm sàng (MDNC Patient Portal) |
| **Đơn vị** | Bệnh viện Đại học Nam Cần Thơ (DNC / MDNC) |
| **Phiên bản tài liệu** | 1.0 |
| **Ngày ban hành** | 13/08/2026 |
| **Trạng thái hệ thống** | Demo Frontend (dữ liệu mock), chưa nối API thật |
| **Đối tượng áp dụng** | BA, Dev, Tester, DevOps, người vận hành nội bộ |

---

## 1. Mục đích & phạm vi

### 1.1. Mục đích

Tài liệu này thống nhất **quy trình nghiệp vụ**, **quy trình phát triển**, **kiểm thử** và **triển khai** cho project MDNC Patient Portal, nhằm:

- Đảm bảo luồng tra cứu kết quả bệnh nhân nhất quán giữa các bên.
- Chuẩn hóa cách làm việc khi sửa code, test và đưa bản lên môi trường demo/production.
- Làm cơ sở bàn giao khi hệ thống chuyển từ mock sang API thật.

### 1.2. Phạm vi

| Trong phạm vi | Ngoài phạm vi (giai đoạn hiện tại) |
| --- | --- |
| Tra cứu bằng Mã KCB + SĐT + OTP | Đăng ký tài khoản bệnh nhân |
| Xem dashboard, lịch sử khám | Quản trị nội bộ / HIS admin |
| Xem kết quả XN / CĐHA / TDCN | Kết nối HIS / LIS / PACS thật |
| Auth phiên client (sessionStorage) | Backend, SSO bệnh viện |
| Deploy static (GitHub Pages) | Hosting nội bộ bệnh viện |

### 1.3. Tài liệu liên quan

| Tài liệu | Vị trí |
| --- | --- |
| Hướng dẫn cài đặt & HDSD | `frontend/README.md` |
| Kiến trúc thành phần FE | `frontend/design/architecture.txt` |
| Mockup UI | `frontend/design/desktop/` |
| Dữ liệu giả | `frontend/src/data/mock.ts` |

---

## 2. Vai trò & trách nhiệm (RACI rút gọn)

| Công việc | BA | Dev | Tester | DevOps / Lead |
| --- | --- | --- | --- | --- |
| Thu thập / cập nhật yêu cầu nghiệp vụ | R | C | C | I |
| Thiết kế UI / luồng màn hình | C | R | C | I |
| Code & review | I | R | I | A |
| Viết / chạy test checklist | C | C | R | I |
| Build & deploy demo | I | C | I | R |
| Duyệt đưa lên production | C | C | C | A |

> **R** = Thực hiện · **A** = Chịu trách nhiệm cuối · **C** = Tư vấn · **I** = Được thông báo

---

## 3. Quy trình nghiệp vụ (bệnh nhân)

### 3.1. Sơ đồ tổng quan

```
[Trang đăng nhập]
        │
        ▼
 Nhập Mã KCB + SĐT
        │
        ▼
 Xác minh chống bot (Turnstile mock)
        │
        ▼
 Gửi yêu cầu OTP  ──(sai thông tin)──► Báo lỗi, cho nhập lại
        │
        ▼
 Nhập OTP (hiệu lực có giới hạn thời gian)
        │
   ┌────┴────┐
 Sai OTP   Đúng OTP
   │           │
 Khóa tạm    Lưu phiên (session)
 sau N lần     │
               ▼
         [Dashboard]
               │
     ┌─────────┼─────────┬──────────┐
     ▼         ▼         ▼          ▼
 Kết quả    Lịch sử   Hồ sơ cá   Hỗ trợ
 gần nhất    khám      nhân
     │
     ├─► Xét nghiệm
     ├─► Chẩn đoán hình ảnh
     └─► Thăm dò chức năng
               │
               ▼
         Thoát / Idle timeout → xóa phiên → về đăng nhập
```

### 3.2. Chi tiết từng bước

#### Bước 1 — Tra cứu / đăng nhập

| Hạng mục | Mô tả |
| --- | --- |
| **Đầu vào** | Mã KCB, Số điện thoại, token chống bot |
| **Điều kiện** | Format hợp lệ (FE validate trước khi gọi API) |
| **Xử lý** | Gọi `requestOtp` (hiện tại: mock trong `src/lib/api.ts`) |
| **Đầu ra thành công** | Mở modal nhập OTP |
| **Đầu ra thất bại** | Thông báo sai thông tin / rate limit |

#### Bước 2 — Xác thực OTP

| Hạng mục | Mô tả |
| --- | --- |
| **Đầu vào** | Mã OTP 6 số |
| **Quy tắc** | Sai tối đa 5 lần → khóa tạm; đếm ngược gửi lại ~60s; OTP có thời hạn ~3 phút (theo thiết kế kiến trúc) |
| **OTP demo** | `686868` |
| **Đầu ra thành công** | Lưu token + thông tin BN vào `sessionStorage` → chuyển `/dashboard` |

#### Bước 3 — Sử dụng Dashboard

| View | URL | Mục đích |
| --- | --- | --- |
| Trang chủ | `/dashboard` | Tóm tắt hồ sơ, lần khám gần đây |
| Kết quả mới nhất | `/dashboard?view=latest` | Danh sách CLS lần khám gần nhất |
| Lịch sử khám | `/dashboard?view=history` | Các lần khám trước |
| Thông tin cá nhân | `/dashboard?view=profile` | Hồ sơ BN |
| Hỗ trợ | `/dashboard?view=support` | Tổng đài / Messenger / Zalo |

#### Bước 4 — Xem chi tiết kết quả

| Loại kết quả | Route | Ghi chú |
| --- | --- | --- |
| Xét nghiệm | `/ket-qua/xet-nghiem` | Bảng chỉ số, cảnh báo bất thường |
| Chẩn đoán hình ảnh | `/ket-qua/chan-doan-hinh-anh` | X-quang / ảnh demo |
| Thăm dò chức năng | `/ket-qua/tham-do-chuc-nang` | Echo / nội soi / … |

#### Bước 5 — Kết thúc phiên

| Cách kết thúc | Hành vi hệ thống |
| --- | --- |
| Bấm **Thoát** | Xóa session → về `/` |
| Idle ~15 phút không thao tác | Tự logout → về `/` |
| Mở route bảo vệ khi chưa login | Redirect về trang đăng nhập |

### 3.3. Dữ liệu test chuẩn (demo)

| Trường | Giá trị |
| --- | --- |
| Mã KCB | `25410064` |
| SĐT | `0368503413` |
| OTP | `686868` |
| Bệnh nhân | Nguyễn Thanh Lam |

Chi tiết checklist test: xem `README.md` mục 4.

---

## 4. Quy trình phát triển phần mềm

### 4.1. Chuẩn bị môi trường (lần đầu)

```
1. Cài Node.js LTS ≥ 20
2. Clone repo
3. cd frontend
4. npm install
5. npm run dev  →  http://localhost:3000
```

> Hiện **không** cần `.env`. Khi nối API thật mới bổ sung `.env.local`.

### 4.2. Luồng làm việc hàng ngày

```
Nhận task (issue / mô tả yêu cầu)
        │
        ▼
 Tạo / chuyển branch feature (theo quy ước team)
        │
        ▼
 Code theo cấu trúc phân tầng (xem 4.3)
        │
        ▼
 Tự kiểm: npm run lint + checklist thủ công liên quan
        │
        ▼
 Commit theo message rõ ràng (tiếng Việt hoặc Anh — thống nhất team)
        │
        ▼
 Push → mở Pull Request → Review
        │
        ▼
 Merge vào main → CI deploy GitHub Pages (nếu đã cấu hình)
```

### 4.3. Quy ước cấu trúc code

Tuân thủ kiến trúc phân tầng trong `design/architecture.txt`:

| Tầng | Thư mục | Được phép |
| --- | --- | --- |
| UI thuần | `src/components/` | Component hiển thị, không gọi API trực tiếp nếu có thể |
| Nghiệp vụ | `src/features/` | Ghép UI + logic theo domain (lookup, lab, imaging…) |
| Trạng thái / bảo mật | `src/hooks/`, `src/lib/session*` | Session, idle timeout, OTP countdown |
| API | `src/lib/api.ts` | Gọi mock / API thật; UI không nhúng fetch rải rác |
| Dữ liệu demo | `src/data/mock.ts` | Chỉ dùng khi chưa có backend |
| Route / page | `src/app/` | Mỏng: nối feature vào route |

**Nguyên tắc:**

1. Ưu tiên sửa trong `features/` đúng domain thay vì phình page.
2. Không hard-code đường dẫn asset tuyệt đối — dùng helper `assetPath` (base path GitHub Pages).
3. Giữ tiếng Việt cho copy UI bệnh nhân.
4. Không commit secret, token thật, `.env` có khóa.

### 4.4. Quy trình thay đổi dữ liệu mock

Khi BA/Tester cần cập nhật case demo:

1. Mở `src/data/mock.ts`.
2. Sửa bệnh nhân / lần khám / kết quả tương ứng.
3. Đồng bộ lại bảng dữ liệu test trong `README.md` (nếu thay đổi giá trị đăng nhập hoặc case chính).
4. Chạy lại checklist mục B–E trong README.

### 4.5. Quy trình chuẩn bị nối API thật (tương lai)

| Bước | Việc cần làm | Owner |
| --- | --- | --- |
| 1 | Chốt contract API (OTP, dashboard, kết quả) với Backend | BA + Dev |
| 2 | Tạo `.env.local` (`NEXT_PUBLIC_API_BASE_URL`, …) | Dev |
| 3 | Thay body mock trong `lib/api.ts` bằng HTTP client thật | Dev |
| 4 | Giữ nguyên UI/features — không đổi route nếu không cần | Dev |
| 5 | Bổ sung xử lý 401/429 theo kiến trúc (interceptor → logout) | Dev |
| 6 | Regression full checklist + test bảo mật phiên | Tester |

---

## 5. Quy trình kiểm thử

### 5.1. Loại kiểm thử áp dụng giai đoạn demo

| Loại | Cách làm | Khi nào |
| --- | --- | --- |
| Smoke | Mở app, đăng nhập, vào dashboard | Mỗi lần deploy / trước demo |
| Chức năng | Checklist README mục 4 (A→F) | Mỗi PR ảnh hưởng UI/luồng |
| Âm tính | OTP sai, chưa tick bot, vào URL bảo vệ khi chưa login | Mỗi release |
| Build | `npm run build` | Trước merge / trước demo chính thức |
| Hồi quy | Lặp checklist sau khi đổi mock hoặc theme | Sau refactor lớn |

### 5.2. Tiêu chí đạt (Definition of Done — chức năng)

Một thay đổi được coi là **xong** khi:

- [ ] Đúng yêu cầu nghiệp vụ đã mô tả
- [ ] Không phá luồng đăng nhập → dashboard → xem kết quả
- [ ] `npm run lint` không lỗi mới (hoặc đã xử lý có chủ đích)
- [ ] `npm run build` thành công (nếu đụng config / route / asset)
- [ ] Đã cập nhật README / tài liệu quy trình nếu đổi dữ liệu test hoặc quy trình
- [ ] Có người review (theo quy ước team)

### 5.3. Báo lỗi

Khi ghi nhận bug, mô tả tối thiểu:

1. **Môi trường:** local / GitHub Pages, trình duyệt, phiên bản
2. **Bước tái hiện** (số thứ tự)
3. **Kết quả thực tế** vs **kết quả mong đợi**
4. **Ảnh / video** (nếu UI)
5. **Mức độ:** Blocker / Major / Minor

---

## 6. Quy trình triển khai (Deploy)

### 6.1. Môi trường

| Môi trường | Mục đích | Cách chạy |
| --- | --- | --- |
| Local Dev | Phát triển | `npm run dev` → `http://localhost:3000` |
| Local Prod-like | Kiểm build static | `npm run build` → `npm run start` |
| Demo online | Demo nội bộ / stakeholder | GitHub Pages: nhánh `gh-pages` |

**URL demo:** https://phamquochy.github.io/dncmedicalresult/

> Lưu ý: mở đúng link Pages. Không mở trang README của repo `main` thay cho app.

### 6.2. Quy trình deploy GitHub Pages (CI)

```
Push / merge vào main
        │
        ▼
 GitHub Actions (.github/workflows/deploy-pages.yml)
        │
        ├─ Node 20
        ├─ npm ci
        ├─ GITHUB_PAGES=true npm run build  → thư mục out/
        └─ Publish out/ lên nhánh gh-pages
        │
        ▼
 Settings → Pages → Source = nhánh gh-pages / (root)
        │
        ▼
 Smoke test trên URL Pages (đăng nhập + xem 1 kết quả)
```

### 6.3. Rollback nhanh (demo)

1. Xác định commit ổn định gần nhất trên `main`.
2. Revert PR / deploy lại từ commit đó (theo quy ước team).
3. Kiểm tra lại Pages source vẫn là `gh-pages`.
4. Smoke test đăng nhập.

---

## 7. Quy trình bảo mật phiên (bắt buộc tuân thủ khi sửa auth)

| Quy tắc | Chi tiết |
| --- | --- |
| Session client | Token lưu `sessionStorage` (key theo code hiện tại, ví dụ `cls_patient_session`) |
| Route bảo vệ | Dùng hook yêu cầu đăng nhập trước khi render dashboard / kết quả |
| Idle logout | ~15 phút không thao tác → xóa phiên |
| Logout tập trung | Mọi lối thoát (nút Thoát, idle, 401 tương lai) đi qua một handler xóa phiên |
| Không log PII | Không `console.log` họ tên, SĐT, kết quả CLS trên bản production |
| Chống bot | Bắt buộc có bước Turnstile (mock hiện tại; thật khi lên production) |

Khi nối backend thật, **bắt buộc** bổ sung: IP binding / 401 interceptor theo `architecture.txt`.

---

## 8. Quản lý thay đổi & phiên bản tài liệu

| Sự kiện | Việc cần làm |
| --- | --- |
| Đổi luồng nghiệp vụ (OTP, view mới…) | Cập nhật mục 3 của tài liệu này + README HDSD |
| Đổi dữ liệu test | Cập nhật README mục 3 + checklist |
| Đổi cách deploy | Cập nhật mục 6 |
| Release demo cho lãnh đạo | Gắn tag / ghi chú phiên bản UI + link Pages |

**Lịch sử sửa tài liệu**

| Phiên bản | Ngày | Người cập nhật | Nội dung |
| --- | --- | --- | --- |
| 1.0 | 13/08/2026 | — | Ban hành lần đầu (demo mock) |

---

## 9. Phụ lục — Lệnh thao tác nhanh

Chạy trong thư mục `frontend/`:

```bash
npm install      # cài dependency
npm run dev      # phát triển
npm run lint     # kiểm tra code
npm run build    # build static → out/
npm run start    # chạy bản đã build
```

---

## 10. Phụ lục — Ma trận màn hình ↔ file chính

| Màn hình | Route | File / feature chính |
| --- | --- | --- |
| Đăng nhập | `/` | `features/lookup/*` |
| Dashboard | `/dashboard` | `app/dashboard/page.tsx`, `features/dashboard/*` |
| Xét nghiệm | `/ket-qua/xet-nghiem` | `features/lab/*` |
| CĐHA | `/ket-qua/chan-doan-hinh-anh` | `features/imaging/*` |
| TDCN | `/ket-qua/tham-do-chuc-nang` | `features/functional/*` |
| API giả | — | `lib/api.ts` ← `data/mock.ts` |

---

*Hết tài liệu quy trình v1.0. Dùng bản này để review nội bộ; chỉnh sửa trước khi ban hành chính thức.*
