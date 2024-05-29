export enum Role {
  PM = "PM",
  VIEWER = "VIEWER",
  CONSULTANT = "CONSULTANT",
  TECHNICAL_WRITER = "TECHNICAL_WRITER",
  DEVELOPER = "DEVELOPER",
}

export const roleLabel = (role: Role) => {
  switch (role) {
    case Role.PM:
      return "Project Manager";
    case Role.VIEWER:
      return "Viewer";
    case Role.CONSULTANT:
      return "Consultant";
    case Role.TECHNICAL_WRITER:
      return "Technical Writer";
    case Role.DEVELOPER:
      return "Developer";
  }
};

export const roleIcon = (role: Role) => {
  switch (role) {
    case "DEVELOPER":
      return "i-heroicons-code-bracket";
    case "VIEWER":
      return "i-heroicons-eye";
    case "CONSULTANT":
      return "i-heroicons-beaker";
    case "TECHNICAL_WRITER":
      return "i-heroicons-pencil";
    case "PM":
      return "i-heroicons-briefcase";
  }
};
