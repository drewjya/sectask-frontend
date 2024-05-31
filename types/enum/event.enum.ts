export const PROJECT_EVENT = {
  ONLINE: "onlineProjectMember",
  ATTACHMENT: "projectAttachment",
  REPORT: "projectReport",
  MEMBER: "projectMember",
  SUBPROJECT: "projectSubProject",
  HEADER: "projectHeader",
  LOG: "projectLog",
  SIDEBAR: "projectSidebar",
};

export const PROJECT_ACTION = {
  JOIN: "onProjectJoin",
  LEAVE: "onProjectLeave",
  ONLINE_MEMBER: "getOnlineProjectMember",
};

export const SUBPROJECT_EVENT = {
  SIDEBAR: "subprojectSidebar",
  ONLINE: "onlineSubprojectMember",
  ATTACHMENT: "subprojectAttachment",
  REPORT: "subprojectReport",
  MEMBER: "subprojectMember",
  HEADER: "subprojectHeader",
  LOG: "subprojectLog",
  FINDING: "subprojectFinding",
};

export const SUBPROJECT_ACTION = {
  JOIN: "onSubprojectJoin",
  LEAVE: "onSubprojectLeave",
  ONLINE_MEMBER: "getOnlineSubprojectMember",
};

export const FINDING_EVENT = {
  SIDEBAR: "findingSidebar",
  ONLINE: "onlineFindingMember",
  FINDINGPROP: "findingProperty",
  REPORT: "findingRetest",
  CVSS: "findingCVSS",
};

export const FINDING_ACTION = {
  JOIN: "onFindingJoin",
  LEAVE: "onFindingLeave",
  ONLINE_MEMBER: "getOnlineFindingMember",
};
