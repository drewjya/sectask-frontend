import type { VFile } from "../file";
import type { OwnerFinding } from "../subproject/subproject";
import type { User } from "../user";

export type RetestProperty = {
  lastUpdated: Date;
  tester: User;
  version: string;
  status: string;
};
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
  retestProperty?: RetestProperty;
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

export interface RoomChat {
  id: number;
  title: string;
  createdAt: Date;
  findingId: number;
  createdBy: OwnerFinding;
}

export interface RoomChatDetail extends RoomChat {
  chats: Chat[];
}

export interface Chat {
  content: string;
  id: number;
  createdAt: Date;
  sender: OwnerFinding;
  replyChat?: Chat;
}

export interface TestingHistory {
  createdAt: Date;
  status: string;
  id: number;
  version: string;
  tester: User;
}

export interface TestingDetail extends TestingHistory {
  content: string;
}
