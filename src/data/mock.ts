import type {
  FunctionalResultItem,
  ImagingResultDetail,
  LabResultDetail,
  Patient,
  Visit,
} from "@/types";
import { assetPath } from "@/lib/assetPath";

export const MOCK_OTP = "686868";

export const patient: Patient = {
  id: "bn-001",
  fullName: "Nguyễn Thanh Lam",
  initials: "NTL",
  avatarUrl: assetPath("/images/patient-avatar.jpg"),
  maKcb: "25410064",
  bhyt: "GD479123456789",
  bhytType: "Đúng tuyến",
  bhytExpiry: "31/12/2026",
  gender: "Nam",
  dateOfBirth: "15/05/1985",
  bloodType: "O+",
  phone: "0368503413",
  address: "Ninh Kieu, Can Tho",
  allergies: [
    { name: "Penicillin", severity: "danger" },
    { name: "Seafood", severity: "warning" },
  ],
};

export const labResultDetail: LabResultDetail = {
  id: "lab-2026-1025",
  ref: "LAB-2026-1025",
  title: "Kết quả xét nghiệm chi tiết",
  conclusion: "Hemoglobin giảm nhẹ. Kali máu thấp — cần xử trí kịp thời.",
  sampleId: "SID-99281",
  collectedAt: "25/10/2026 07:45",
  verifiedAt: "25/10/2026 09:20",
  equipment: "Roche cobas 8000",
  verifiedBy: "Bs CKII. Lê Thị M",
  criticalAlert: {
    name: "Potassium (K+)",
    value: "2.8",
    unit: "mmol/L",
    ref: "3.5 – 5.1",
  },
  categories: [
    {
      id: "hematology",
      name: "Huyết học",
      indicators: [
        {
          id: "wbc",
          name: "WBC (Bạch cầu)",
          result: 6.8,
          unit: "10^9/L",
          refMin: 4.0,
          refMax: 10.0,
          status: "normal",
          trend: [6.2, 6.5, 6.4, 6.8, 6.7, 6.8],
        },
        {
          id: "rbc",
          name: "RBC (Hồng cầu)",
          result: 4.8,
          unit: "10^12/L",
          refMin: 4.2,
          refMax: 5.4,
          status: "normal",
          trend: [4.6, 4.7, 4.7, 4.8, 4.8, 4.8],
        },
        {
          id: "hgb",
          name: "HGB (Hemoglobin)",
          result: 115,
          unit: "g/L",
          refMin: 130,
          refMax: 175,
          status: "low",
          trend: [128, 125, 122, 120, 118, 115],
        },
        {
          id: "hct",
          name: "HCT (Hematocrit)",
          result: 38.5,
          unit: "%",
          refMin: 40,
          refMax: 50,
          status: "low",
          trend: [41, 40, 39.5, 39, 38.8, 38.5],
        },
        {
          id: "plt",
          name: "PLT (Tiểu cầu)",
          result: 245,
          unit: "10^9/L",
          refMin: 150,
          refMax: 400,
          status: "normal",
          trend: [230, 235, 240, 242, 244, 245],
        },
        {
          id: "mcv",
          name: "MCV",
          result: 88,
          unit: "fL",
          refMin: 80,
          refMax: 100,
          status: "normal",
          trend: [86, 87, 87, 88, 88, 88],
        },
      ],
    },
    {
      id: "biochemistry",
      name: "Hóa sinh",
      indicators: [
        {
          id: "glucose",
          name: "Glucose",
          result: 5.2,
          unit: "mmol/L",
          refMin: 3.9,
          refMax: 5.6,
          status: "normal",
          trend: [5.0, 5.1, 5.3, 5.2, 5.1, 5.2],
        },
        {
          id: "k",
          name: "Potassium (K+)",
          result: 2.8,
          unit: "mmol/L",
          refMin: 3.5,
          refMax: 5.1,
          status: "critical",
          trend: [3.8, 3.5, 3.2, 3.0, 2.9, 2.8],
        },
        {
          id: "na",
          name: "Sodium (Na+)",
          result: 138,
          unit: "mmol/L",
          refMin: 135,
          refMax: 145,
          status: "normal",
          trend: [137, 138, 139, 138, 137, 138],
        },
        {
          id: "creatinine",
          name: "Creatinine",
          result: 78,
          unit: "µmol/L",
          refMin: 62,
          refMax: 106,
          status: "normal",
          trend: [75, 76, 77, 78, 78, 78],
        },
      ],
    },
  ],
};

export const imagingResult: ImagingResultDetail = {
  id: "img-xq-001",
  title: "Chụp X-quang ngực",
  status: "KẾT QUẢ CUỐI CÙNG",
  date: "12/11/2026",
  patientName: "Nguyễn Văn A",
  maKcb: "25410064",
  method: "Digital X-Ray (DX)",
  room: "Radiology - Room 3B",
  indication:
    "Ho kéo dài 2 tuần, nghi ngờ viêm phổi. Đánh giá nhu mô phổi và bóng tim.",
  findings: [
    {
      title: "Phổi và màng phổi",
      description:
        "Hai phổi sáng đều, không thấy ổ đục khu trú. Rốn phổi hai bên rõ, không dày. Khoang màng phổi không có dịch.",
    },
    {
      title: "Tim và trung thất",
      description:
        "Bóng tim trong giới hạn bình thường. Trung thất không lệch, không thấy khối bất thường.",
    },
    {
      title: "Xương và phần mềm",
      description:
        "Khung xương ngực nguyên vẹn, không thấy gãy xương. Phần mềm thành ngực không bất thường.",
    },
  ],
  assessment:
    "Không có tổn thương tim-phổi cấp tính. Hình ảnh X-quang ngực bình thường.",
  doctor: "Dr. Nguyễn Văn Minh",
  dob: "1985-04-12",
  patientCode: "P-982734",
  windowLevel: { w: 4605, l: 2048 },
  images: [
    { id: "slice-1", label: "PA ngực", src: assetPath("/images/xray/chest-01.png") },
    { id: "slice-2", label: "PA góc 2", src: assetPath("/images/xray/chest-02.png") },
    { id: "slice-3", label: "PA góc 3", src: assetPath("/images/xray/chest-03.png") },
    { id: "slice-4", label: "PA góc 4", src: assetPath("/images/xray/chest-04.png") },
    { id: "slice-5", label: "PA góc 5", src: assetPath("/images/xray/chest-05.png") },
    { id: "slice-6", label: "PA góc 6", src: assetPath("/images/xray/chest-06.png") },
    { id: "slice-7", label: "PA góc 7", src: assetPath("/images/xray/chest-07.png") },
    { id: "slice-8", label: "PA góc 8", src: assetPath("/images/xray/chest-08.jpg") },
  ],
};

export const functionalResults: FunctionalResultItem[] = [
  {
    id: "fn-echo",
    kind: "echo",
    title: "Siêu âm tim Doppler màu",
    datetime: "14/10/2026 · 09:30",
    status: "approved",
    statusLabel: "Đã duyệt",
    conclusion:
      "Chức năng tâm thu thất trái bảo tồn (EF 65%). Không hẹp/hở van đáng kể. Áp lực động mạch phổi ước tính trong giới hạn bình thường.",
    tags: [
      { label: "EF: 65%" },
      { label: "PAPs: 25 mmHg" },
      { label: "LVDd: 45 mm" },
    ],
    images: [
      { id: "e1", src: assetPath("/images/functional/echo-01.png") },
      { id: "e2", src: assetPath("/images/functional/echo-02.png") },
      { id: "e3", src: assetPath("/images/functional/echo-03.png") },
    ],
  },
  {
    id: "fn-endo",
    kind: "endo",
    title: "Nội soi dạ dày - tá tràng",
    datetime: "14/10/2026 · 11:15",
    status: "pending",
    statusLabel: "Chờ sinh thiết",
    conclusion:
      "Phát hiện polyp thân vị kích thước nhỏ. Niêm mạc hang vị viêm sung huyết. Đã sinh thiết, chờ kết quả giải phẫu bệnh. CLO test đang chờ.",
    tags: [
      { label: "Polyp thân vị" },
      { label: "Viêm hang vị" },
      { label: "CLO Test: Pending", tone: "warning" },
    ],
    images: [
      { id: "en1", src: assetPath("/images/functional/endo-01.png") },
      { id: "en2", src: assetPath("/images/functional/endo-02.png") },
    ],
  },
  {
    id: "fn-spiro",
    kind: "spiro",
    title: "Đo chức năng hô hấp",
    datetime: "13/10/2026 · 08:00",
    status: "approved",
    statusLabel: "Đã duyệt",
    conclusion:
      "Chức năng thông khí phổi trong giới hạn bình thường. Không có dấu hiệu tắc nghẽn hay hạn chế.",
    metrics: [
      { label: "FVC", value: "3.45 L (98%)" },
      { label: "FEV1", value: "2.95 L (95%)" },
      { label: "FEV1/FVC", value: "85.5 %" },
    ],
  },
];

export const visits: Visit[] = [
  {
    id: "visit-001",
    title: "Khám Nội khoa",
    date: "25/10/2026",
    doctor: "Bác sĩ Nguyễn Văn A",
    department: "Nội khoa",
    status: "Đã có kết quả",
    conclusion:
      "Tình trạng sức khỏe hiện tại ổn định. Kết quả khám lâm sàng và cận lâm sàng chưa ghi nhận bất thường đáng kể. Khuyến nghị tiếp tục theo dõi sức khỏe định kỳ, duy trì chế độ dinh dưỡng hợp lý, tập luyện thường xuyên và tái khám theo hướng dẫn của bác sĩ hoặc khi có dấu hiệu bất thường.",
    previews: [
      {
        id: "p-lab",
        kind: "lab",
        title: "Xét nghiệm",
        subtitle: "Tổng phân tích tế bào máu",
        statusLabel: "Đã có kết quả",
        detailHref: "/ket-qua/xet-nghiem",
      },
      {
        id: "p-img",
        kind: "imaging",
        title: "Chẩn đoán hình ảnh",
        subtitle: "Kết luận: Không phát hiện bất thường trên phim X-quang ngực.",
        detailHref: "/ket-qua/chan-doan-hinh-anh",
      },
      {
        id: "p-fn",
        kind: "functional",
        title: "Thăm dò chức năng",
        subtitle: "Paracetamol 500mg • Vitamin C 500mg",
        detailHref: "/ket-qua/tham-do-chuc-nang",
      },
    ],
    labPreviewDetail: labResultDetail,
  },
  {
    id: "visit-002",
    title: "Theo dõi chuyên khoa tim mạch",
    date: "12/06/2026",
    doctor: "Bác sĩ Trần Văn C",
    department: "Tim mạch",
    status: "Đã xác nhận",
    conclusion:
      "Chức năng tim ổn định, EF bảo tồn. Tiếp tục theo dõi chuyên khoa tim mạch theo lịch hẹn; duy trì thuốc và chế độ sinh hoạt hiện tại.",
    previews: [
      {
        id: "p-fn-2",
        kind: "functional",
        title: "Thăm dò chức năng",
        subtitle: "Siêu âm tim Doppler màu",
        detailHref: "/ket-qua/tham-do-chuc-nang",
      },
    ],
  },
  {
    id: "visit-003",
    title: "Khám tổng quát",
    date: "03/03/2026",
    doctor: "Bác sĩ Lê Thị B",
    department: "Khám bệnh",
    status: "Đã xác nhận",
    conclusion:
      "Khám tổng quát không ghi nhận bất thường cấp tính. Các chỉ số xét nghiệm và siêu âm ổ bụng trong giới hạn bình thường. Tái khám định kỳ hoặc khi có triệu chứng mới.",
    previews: [
      {
        id: "p-lab-3",
        kind: "lab",
        title: "Xét nghiệm",
        subtitle: "Sinh hóa máu cơ bản",
        detailHref: "/ket-qua/xet-nghiem",
      },
      {
        id: "p-img-3",
        kind: "imaging",
        title: "Chẩn đoán hình ảnh",
        subtitle: "Siêu âm ổ bụng",
        detailHref: "/ket-qua/chan-doan-hinh-anh",
      },
    ],
  },
];

export const contactLinks = {
  messenger: "https://m.me/",
  zalo: "https://zalo.me/",
  phone: "0907365115",
};
