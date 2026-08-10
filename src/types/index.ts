export type Allergy = {
  name: string;
  severity: "danger" | "warning";
};

export type Patient = {
  id: string;
  fullName: string;
  initials: string;
  avatarUrl?: string;
  maKcb: string;
  bhyt: string;
  bhytType?: string;
  bhytExpiry?: string;
  gender: string;
  dateOfBirth: string;
  bloodType: string;
  phone: string;
  address: string;
  allergies: Allergy[];
};

export type LabIndicatorStatus = "normal" | "low" | "high" | "critical";

export type LabIndicator = {
  id: string;
  name: string;
  result: number | string;
  unit: string;
  refMin: number;
  refMax: number;
  status: LabIndicatorStatus;
  trend: number[];
};

export type LabCategory = {
  id: string;
  name: string;
  indicators: LabIndicator[];
};

export type LabResultDetail = {
  id: string;
  ref: string;
  title: string;
  conclusion: string;
  categories: LabCategory[];
  sampleId: string;
  collectedAt: string;
  verifiedAt: string;
  equipment: string;
  verifiedBy: string;
  criticalAlert?: {
    name: string;
    value: string;
    unit: string;
    ref: string;
  };
};

export type ImagingFinding = {
  title: string;
  description: string;
};

export type ImagingResultDetail = {
  id: string;
  title: string;
  status: string;
  date: string;
  patientName: string;
  maKcb: string;
  method: string;
  room: string;
  indication: string;
  findings: ImagingFinding[];
  assessment: string;
  doctor: string;
  images: { id: string; label: string; src: string }[];
  windowLevel: { w: number; l: number };
  dob: string;
  patientCode: string;
};

export type FunctionalMetric = {
  label: string;
  value: string;
};

export type FunctionalResultItem = {
  id: string;
  title: string;
  datetime: string;
  status: "approved" | "pending";
  statusLabel: string;
  conclusion: string;
  kind?: "echo" | "endo" | "spiro";
  tags?: { label: string; tone?: "default" | "warning" }[];
  metrics?: FunctionalMetric[];
  images?: { id: string; src: string }[];
};

export type VisitPreviewKind = "lab" | "imaging" | "functional";

export type VisitPreview = {
  id: string;
  kind: VisitPreviewKind;
  title: string;
  subtitle: string;
  statusLabel?: string;
  detailHref: string;
};

export type Visit = {
  id: string;
  title: string;
  date: string;
  doctor: string;
  department: string;
  status: string;
  /** Kết luận tổng của lần khám */
  conclusion?: string;
  previews: VisitPreview[];
  labPreviewDetail?: LabResultDetail;
};

export type LookupPayload = {
  maKcb: string;
  phone: string;
  turnstileToken: string;
};
