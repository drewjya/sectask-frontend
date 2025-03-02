import type { OwnerFinding } from "./subproject";

export type SocketSubprojectAction = {
  type: string;
  subproject: {
    subprojectId: number;
    startDate: Date;
    endDate: Date;
    name: string;
  };
};

export type SocketFindingAction = {
  type: string;
  finding: {
    findingId: number;
    name: string;
    deletedAt?: Date;
    impact?: string;
    likelihood?: string;
    status?: string;
    owner: OwnerFinding;
  };
};
