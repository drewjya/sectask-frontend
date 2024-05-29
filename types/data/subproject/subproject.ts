import type { VFile } from "../file";
import type { ProjectMember } from "../project/project";
import type { FindingSidebar } from "../sidebar/project";

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
  project: FindingSidebar;
};

export type FindingSubproject = {
  id: number;
  name: string;
  createdBy: OwnerFinding;
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