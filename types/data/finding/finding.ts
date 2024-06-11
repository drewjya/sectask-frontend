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
    startDate: Date;
    endDate: Date;
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

export enum DocType {
  THREAT = "THREAT",
  DESCRIPTION = "DESCRIPTION",
}

export type VersionType = {
  id: number;
  findingId: number;
  type: Number;
  content: string;
  createdAt: Date;
  basedOn?: Date;
  user: OwnerFinding;
};

export const riskFormula = (param: { impact: number; likelihood: number }) => {
  return param.impact * param.likelihood;
};



export const getRisk = (total: number) => {
  if (total <= 5) {
    return "Low";
  } else if (total <= 10) {
    return "Medium";
  } else if (total <= 15) {
    return "High";
  } else {
    return "Extreme";
  }
};

const impactList = [
  { label: "Inisgniificant", value: 1 },
  { label: "Minor", value: 2 },
  { label: "Moderate", value: 3 },
  { label: "Major", value: 4 },
  { label: "Catasrophic", value: 5 },
];

export const getImpact = (value?: string) => {
  return impactList.find((item) => item.label === value)?.value || 1;
};
const likelihoodList = [
  { label: "Rare", value: 1 },
  { label: "Unlikely", value: 2 },
  { label: "Possible", value: 3 },
  { label: "Likely", value: 4 },
  { label: "Certainly", value: 5 },
];

export const getLikelihood = (value?: string) => {
  return likelihoodList.find((item) => item.label === value)?.value || 1;
};

export const riskFormulaString = (param: { impact: string; likelihood: string }) => {

  const impact = getImpact(param.impact);
  const likelihood = getLikelihood(param.likelihood);
  return impact * likelihood;
};