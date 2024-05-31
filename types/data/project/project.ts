import type { VFile } from "../file";

export type ProjectData = {
  id: number;
  name: string;
  archived: boolean;
  startDate: Date;
  endDate: Date;
  ownerId: number;
  attachments: VFile[];
  reports: VFile[];
  recentActivities: LogData[];
  projectPicture?: VFile;
  members: ProjectMember[];
  subProjects: SubprojectProject[];
};

export type SubprojectProject = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type ProjectMember = {
  role: Role;
  id: number;
  name: string;
};




export type LogData = {
  title: string;
  description: string;
  createdAt: Date;
};
