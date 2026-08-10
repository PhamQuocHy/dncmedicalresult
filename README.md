# mdnc-patient-portal

Cổng **tra cứu lịch sử khám** và **xem kết quả trực tuyến** cho bệnh nhân  
(Bệnh viện Đại học Nam Cần Thơ — thương hiệu DNC).

> App đang dùng **dữ liệu giả (mock)** để demo. Chưa nối API thật.

---

## Mục lục

1. [Cài đặt môi trường](#1-cài-đặt-môi-trường)
2. [Chạy app](#2-chạy-app)
3. [Dữ liệu test](#3-dữ-liệu-test)
4. [Cách test (checklist)](#4-cách-test-checklist)
5. [Hướng dẫn sử dụng (HDSD)](#5-hướng-dẫn-sử-dụng-hdsd)
6. [Lệnh hay dùng](#6-lệnh-hay-dùng)
7. [Ghi chú nhanh](#7-ghi-chú-nhanh)

---

## 1. Cài đặt môi trường

### Bạn cần gì?

| Thứ cần có | Ghi chú |
| --- | --- |
| Windows / Mac / Linux | Máy tính cá nhân |
| Node.js bản LTS (≥ 20) | Tải tại [nodejs.org](https://nodejs.org) |
| Trình duyệt | Chrome hoặc Edge |

### Kiểm tra Node đã cài chưa

Mở terminal (PowerShell / CMD) rồi gõ:

```bash
node -v
npm -v
```

Nếu hiện ra số version (ví dụ `v20.x.x`) là OK.  
Nếu báo lỗi → cài Node.js, **đóng terminal cũ**, mở lại rồi kiểm tra lại.

### Cài project

Vào thư mục app rồi cài thư viện:

```bash
cd mdnc-patient-portal/frontend
npm install
```

Đợi chạy xong (chỉ cần làm lần đầu, hoặc khi `package.json` đổi).

> **Không cần** tạo file `.env` lúc này — app đang chạy bằng dữ liệu mock.

---

## 2. Chạy app

Trong thư mục `frontend/`:

```bash
npm run dev
```

Mở trình duyệt vào:

**http://localhost:3000**

Thấy trang đăng nhập / tra cứu là thành công.

Muốn tắt server: vào terminal đang chạy rồi nhấn `Ctrl + C`.

---

## 3. Dữ liệu test

Copy các giá trị dưới đây khi đăng nhập và kiểm thử.

### 3.1. Đăng nhập (bắt buộc dùng đúng)

| Trường | Giá trị test | Ghi chú |
| --- | --- | --- |
| **Mã KCB** | `25410064` | Mã khám chữa bệnh |
| **Số điện thoại** | `0368503413` | SĐT đăng ký |
| **OTP** | `686868` | Mã xác thực 6 số |
| Xác minh robot | Tick ô “Xác minh bạn không phải robot” | Bắt buộc trước khi gửi OTP |

Nguồn dữ liệu: file `src/data/mock.ts` (`MOCK_OTP`, `patient`).

### 3.2. Hồ sơ bệnh nhân (sau khi đăng nhập sẽ thấy)

| Trường | Giá trị test |
| --- | --- |
| Họ tên | Nguyễn Thanh Lam |
| Mã KCB | 25410064 |
| Giới tính / Ngày sinh | Nam · 15/05/1985 |
| Nhóm máu | O+ |
| Dị ứng | 2 loại (Penicillin, Seafood) |
| BHYT (6 số cuối) | 456789 |
| Đường huyết gần nhất | 5.2 mmol/L |
| Địa chỉ | Ninh Kieu, Can Tho |
| SĐT | 0368503413 |

### 3.3. Các lần khám (mock)

| STT | Ngày khám | Tên lần khám | Khoa | Bác sĩ | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| 1 (mới nhất) | 25/10/2026 | Khám Nội khoa | Nội khoa | Bác sĩ Nguyễn Văn A | Đã có kết quả |
| 2 | 12/06/2026 | Theo dõi chuyên khoa tim mạch | Tim mạch | Bác sĩ Trần Văn C | Đã xác nhận |
| 3 | 03/03/2026 | Khám tổng quát | Khám bệnh | Bác sĩ Lê Thị B | Đã xác nhận |

### 3.4. Kết quả lần khám mới nhất (25/10/2026)

| Nhóm kết quả | Nội dung ngắn | Link sau khi bấm “Xem” |
| --- | --- | --- |
| Xét nghiệm | Tổng phân tích tế bào máu | `/ket-qua/xet-nghiem` |
| Chẩn đoán hình ảnh | X-quang ngực — không bất thường | `/ket-qua/chan-doan-hinh-anh` |
| Thăm dò chức năng | (demo) Paracetamol / Vitamin C | `/ket-qua/tham-do-chuc-nang` |

Một số chỉ số xét nghiệm mẫu:

| Chỉ số | Kết quả | Đơn vị |
| --- | --- | --- |
| Glucose (đường huyết) | 5.2 | mmol/L |
| Potassium (K+) | 2.8 | mmol/L *(cảnh báo thấp)* |

### 3.5. Liên hệ hỗ trợ (demo)

| Kênh | Giá trị |
| --- | --- |
| Tổng đài | 0907365115 |

### 3.6. URL hay dùng khi test (sau khi đã đăng nhập)

| Màn hình | Đường dẫn |
| --- | --- |
| Dashboard | http://localhost:3000/dashboard |
| Kết quả gần nhất | http://localhost:3000/dashboard?view=latest |
| Lịch sử khám | http://localhost:3000/dashboard?view=history |
| Thông tin cá nhân | http://localhost:3000/dashboard?view=profile |
| Hỗ trợ | http://localhost:3000/dashboard?view=support |

---

## 4. Cách test (checklist)

Làm lần lượt theo bảng dưới. Đánh dấu ✓ khi đúng.

### A. Cài đặt & mở app

| # | Việc cần làm | Kết quả mong đợi |
| --- | --- | --- |
| A1 | `node -v` và `npm -v` | Hiện version, không lỗi |
| A2 | `cd frontend` → `npm install` | Cài xong, không đỏ lỗi |
| A3 | `npm run dev` | Terminal báo sẵn sàng; mở được `http://localhost:3000` |

### B. Đăng nhập

| # | Việc cần làm | Kết quả mong đợi |
| --- | --- | --- |
| B1 | Nhập Mã KCB `25410064`, SĐT `0368503413` | Ô nhập nhận giá trị |
| B2 | Tick xác minh robot | Hiện “Success!” |
| B3 | Bấm gửi / tra cứu | Hiện popup nhập OTP |
| B4 | Nhập OTP `686868` → xác nhận | Vào được `/dashboard` |
| B5 *(âm tính)* | Nhập OTP sai (vd `111111`) | Báo OTP sai; nhập sai nhiều lần sẽ bị khóa tạm |

### C. Dashboard

| # | Việc cần làm | Kết quả mong đợi |
| --- | --- | --- |
| C1 | Xem card hồ sơ | Tên **Nguyễn Thanh Lam**, mã **#25410064** |
| C2 | Xem 4 ô chỉ số | O+ · 2 loại · 456789 · 5.2 mmol/L |
| C3 | Xem “Lần khám gần đây” | Có lần **Khám Nội khoa — 25/10/2026** |
| C4 | Bấm **Xem kết quả mới nhất** | URL thành `?view=latest`, hiện trang kết quả mới |

### D. Kết quả gần nhất

| # | Việc cần làm | Kết quả mong đợi |
| --- | --- | --- |
| D1 | Mở `/dashboard?view=latest` | Có thông tin BN + lần khám Nội khoa |
| D2 | Bấm **Xét nghiệm** | Vào trang kết quả xét nghiệm |
| D3 | Bấm **Chẩn đoán hình ảnh** | Vào trang X-quang / hình ảnh |
| D4 | Bấm **Thăm dò chức năng** | Vào trang thăm dò chức năng |
| D5 | Đọc “Kết luận của bác sĩ” | Có đoạn kết luận demo |
| D6 | Bấm nút quay lại (mũi tên) | Về lại Dashboard |

### E. Lịch sử & hỗ trợ & đăng xuất

| # | Việc cần làm | Kết quả mong đợi |
| --- | --- | --- |
| E1 | Vào lịch sử (`?view=history`) | Thấy các lần khám cũ hơn lần mới nhất |
| E2 | Vào hỗ trợ (`?view=support`) | Có nút gọi / Messenger / Zalo |
| E3 | Bấm **Thoát** | Về trang đăng nhập; vào lại `/dashboard` sẽ bị đá về trang login |

### F. Build (tuỳ chọn)

| # | Việc cần làm | Kết quả mong đợi |
| --- | --- | --- |
| F1 | `npm run build` | Build thành công |
| F2 | `npm run start` | Mở lại được `http://localhost:3000` |

---

## 5. Hướng dẫn sử dụng (HDSD)

### Đăng nhập nhanh (copy làm theo)

1. Mở **http://localhost:3000**
2. Nhập:
   - Mã KCB: **25410064**
   - SĐT: **0368503413**
3. Tick **Xác minh bạn không phải robot**
4. Bấm nút tra cứu
5. Nhập OTP: **686868**
6. Vào Dashboard

### Dùng Dashboard

- Xem thông tin cá nhân, chỉ số sức khỏe, lần khám gần đây.
- Bấm **Xem kết quả mới nhất** để xem kết quả lần khám gần nhất.
- Vào **Tra cứu lịch sử** để xem các lần khám cũ.
- Vào **Hỗ trợ dịch vụ** nếu cần liên hệ.
- Bấm **Thoát** khi xong việc.

### Xem chi tiết kết quả

1. Vào **Kết quả gần nhất**
2. Trong mục **Chi tiết kết quả**, chọn từng dòng (Xét nghiệm / Hình ảnh / Thăm dò)
3. Đọc kết quả chi tiết → bấm quay lại khi xong

---

## 6. Lệnh hay dùng

Chạy trong thư mục `frontend/`:

```bash
npm install      # cài thư viện (lần đầu)
npm run dev      # chạy thử trên máy
npm run build    # đóng gói bản chính thức
npm run start    # chạy bản đã build
npm run lint     # kiểm tra lỗi code cơ bản
```

---

## 7. Ghi chú nhanh

- Toàn bộ **dữ liệu test** nằm ở: `src/data/mock.ts`
- API giả nằm ở: `src/lib/api.ts`
- Khi có backend thật: thay mock bằng API, và bổ sung file `.env.local` nếu cần.
- File thiết kế tham khảo nằm trong thư mục `design/`

---

## Hỗ trợ

- Website bệnh viện: [https://benhviendhnct.com.vn/](https://benhviendhnct.com.vn/)
- Trong app: mục **Hỗ trợ dịch vụ** trên Dashboard

© 2022–2024 Bệnh Viện Đại Học Nam Cần Thơ. All Rights Reserved.
