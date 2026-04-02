export const SUBJECTS = [
  "Matematika",
  "Algebra",
  "Geometriya",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Informatika",
  "Ingliz tili",
  "Ona tili",
  "Rus tili",
  "Tarix",
  "Geografiya",
  "Adabiyot",
  "Iqtisodiyot",
  "Huquq",
  "Chizmachilik",
  "Tarbiya",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const GROUP_STATUS_LABELS: Record<string, string> = {
  open: "Ochiq",
  closed: "Yopiq",
};

export const MEMBER_STATUS_LABELS: Record<string, string> = {
  active: "Faol",
  frozen: "Muzlatilgan",
  removed: "O'chirilgan",
};

export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  graded: "Baholangan",
  complained: "Shikoyat qilingan",
  overridden: "Qayta baholangan",
};

export const COMPLAINT_STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  reviewed: "Ko'rib chiqilgan",
  resolved: "Hal qilingan",
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Erkak" },
  { value: "female", label: "Ayol" },
] as const;
