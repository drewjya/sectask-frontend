import type { VFile } from "../file";
import type { ProjectMember } from "./project";

export type EventMember = {
  type: string;
  member: ProjectMember;
  docId: number;
};

export type EventHeader = {
  name: string;
  startDate: Date;
  endDate: Date;
  picture?: VFile;
  projectId: number;
};
