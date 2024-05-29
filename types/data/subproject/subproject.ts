import type { VFile } from "../file";
import type { ProjectMember } from "../project/project";

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
  subProjects: SubprojectProject[];
};

export type SubprojectProject = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type LogData = {
  title: string;
  description: string;
  createdAt: Date;
};
