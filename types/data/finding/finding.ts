import type { VFile } from "../file";
import type { OwnerFinding } from "../subproject/subproject";

export type FindingData = {
  id: number;
  name: string;
  category?: string;
  location?: string;
  method?: string;
  environment?: string;
  application?: string;
  impact?: string;
  likelihood?: string;
  latestUpdate?: Date;
  createdAt: Date;
  status?: string;
  releases?: string;
  descriptionId?: string;
  threatAndRiskId?: string;
  cvssDetail: {
    data: CVSSData;
  };
  createdBy: OwnerFinding;
  subProject: {
    id: number;
    name: string;
    project: {
      id: number;
      name: string;
    };
  };
  testerFinding: TesterFinding[];
  chatRoom: any[];
};

export type TesterFinding = {
  userId: number;
  active: boolean;
  user: {
    id: number;
    name: string;
    profilePicture?: VFile;
    email: string;
  };
};

export enum CVSS_VALUE {
  C0 = "C0",
  C1 = "C1",
  C2 = "C2",
  C3 = "C3",
}

export type CVSSData = {
  e: CVSS_VALUE;
  r: CVSS_VALUE;
  s: CVSS_VALUE;
  u: CVSS_VALUE;
  v: CVSS_VALUE;
  ac: CVSS_VALUE;
  ar: CVSS_VALUE;
  at: CVSS_VALUE;
  au: CVSS_VALUE;
  av: CVSS_VALUE;
  cr: CVSS_VALUE;
  ir: CVSS_VALUE;
  pr: CVSS_VALUE;
  re: CVSS_VALUE;
  sa: CVSS_VALUE;
  sc: CVSS_VALUE;
  si: CVSS_VALUE;
  ui: CVSS_VALUE;
  va: CVSS_VALUE;
  vc: CVSS_VALUE;
  vi: CVSS_VALUE;
  mac: CVSS_VALUE;
  mat: CVSS_VALUE;
  mav: CVSS_VALUE;
  mpr: CVSS_VALUE;
  msa: CVSS_VALUE;
  msc: CVSS_VALUE;
  msi: CVSS_VALUE;
  mui: CVSS_VALUE;
  mva: CVSS_VALUE;
  mvc: CVSS_VALUE;
  mvi: CVSS_VALUE;
};
