import type { VFile } from "../file";
import type { ProjectMember, SubprojectProject } from "../project/project";

export type SubProjectData = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  projectId: number;
  attachments: VFile[];
  reports: VFile[];
  recentActivities: LogData[];
  subprojectMember: ProjectMember[];
  findings: FindingSubproject[];
  project: SubprojectProject;
};

export type FindingSubproject = {
  id: number;
  name: string;
  deletedAt?: Date;
  createdBy: OwnerFinding;
  likelihood?: string;
  impact?: string;
  //manual
  risk?: string;
  retestHistories: {
    status: string;
  }[];
  //manual
  status?: string;
};

export type OwnerFinding = {
  id: number;
  name: string;
  profilePicture?: VFile;
};

export type LogData = {
  title: string;
  description: string;
  createdAt: Date;
};
