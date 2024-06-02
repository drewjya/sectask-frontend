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
  descriptionId: string;
  threatAndRiskId: string;
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
  isEditor: boolean;
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

export type CVSSData = {
  AV: string;
  AC: string;
  AT: string;
  PR: string;
  UI: string;
  VC: string;
  VI: string;
  VA: string;
  SC: string;
  SI: string;
  SA: string;
  E: string;
  CR: string;
  IR: string;
  AR: string;
  MAV: string;
  MAC: string;
  MAT: string;
  MPR: string;
  MUI: string;
  MVC: string;
  MVI: string;
  MVA: string;
  MSC: string;
  MSI: string;
  MSA: string;
  S: string;
  AU: string;
  R: string;
  V: string;
  RE: string;
  U: string;
};

export type RoomChat = {
  id: number;
  title: string;
  createdAt: Date;
  findingId: number;
  createdBy: OwnerFinding;
};
