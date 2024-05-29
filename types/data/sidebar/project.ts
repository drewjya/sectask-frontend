export type ProjectSidebar = {
  name: string;
  id: number;
  subproject: SubprojectSidebar[];
};

export type SubprojectSidebar = {
  name: string;
  id: number;
  expanded: boolean;
  findings: FindingSidebar[];
};

export type FindingSidebar = {
  name: string;
  id: number;
};
