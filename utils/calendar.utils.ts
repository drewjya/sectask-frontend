type ColorDefinition = {
  main: string;
  container: string;
  onContainer: string;
};
type CalendarType = {
  colorName: string;
  label?: string;
  lightColors?: ColorDefinition;
  darkColors?: ColorDefinition;
};
export const calendarConfig: Record<string, CalendarType> = {
  red: {
    colorName: "red",
    lightColors: {
      container: "#FEE2E2",
      main: "#F87171",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#442C2E",
      main: "#DC2626",
      onContainer: "#FFFFFF",
    },
  },
  blue: {
    colorName: "blue",
    lightColors: {
      container: "#DBEAFE",
      main: "#60A5FA",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2D3748",
      main: "#2563EB",
      onContainer: "#FFFFFF",
    },
  },
  green: {
    colorName: "green",
    lightColors: {
      container: "#D1FAE5",
      main: "#34D399",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2F3A2D",
      main: "#10B981",
      onContainer: "#FFFFFF",
    },
  },
  yellow: {
    colorName: "yellow",
    lightColors: {
      container: "#FEF3C7",
      main: "#FCD34D",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D3D29",
      main: "#F59E0B",
      onContainer: "#FFFFFF",
    },
  },
  purple: {
    colorName: "purple",
    lightColors: {
      container: "#EDE9FE",
      main: "#A78BFA",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2D2440",
      main: "#7C3AED",
      onContainer: "#FFFFFF",
    },
  },
  orange: {
    colorName: "orange",
    lightColors: {
      container: "#FEEBC8",
      main: "#F97316",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D2C21",
      main: "#EA580C",
      onContainer: "#FFFFFF",
    },
  },
  pink: {
    colorName: "pink",
    lightColors: {
      container: "#FED7E2",
      main: "#EC4899",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D1F2D",
      main: "#D946EF",
      onContainer: "#FFFFFF",
    },
  },
  teal: {
    colorName: "teal",
    lightColors: {
      container: "#D1FAE5",
      main: "#34D399",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2F3A2D",
      main: "#10B981",
      onContainer: "#FFFFFF",
    },
  },
  cyan: {
    colorName: "cyan",
    lightColors: {
      container: "#D1FAE5",
      main: "#34D399",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2F3A2D",
      main: "#10B981",
      onContainer: "#FFFFFF",
    },
  },
  lime: {
    colorName: "lime",
    lightColors: {
      container: "#F7FEE7",
      main: "#84CC16",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D4223",
      main: "#65A30D",
      onContainer: "#FFFFFF",
    },
  },
  amber: {
    colorName: "amber",
    lightColors: {
      container: "#FEF3C7",
      main: "#FCD34D",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D3D29",
      main: "#F59E0B",
      onContainer: "#FFFFFF",
    },
  },
  brown: {
    colorName: "brown",
    lightColors: {
      container: "#F7E4DE",
      main: "#A8552D",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D2C2C",
      main: "#923524",
      onContainer: "#FFFFFF",
    },
  },
  grey: {
    colorName: "grey",
    lightColors: {
      container: "#F3F4F6",
      main: "#6B7280",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2D2F32",
      main: "#64748B",
      onContainer: "#FFFFFF",
    },
  },
  "blue-grey": {
    colorName: "blue-grey",
    lightColors: {
      container: "#E4E7EB",
      main: "#64748B",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2D3A3A",
      main: "#64748B",
      onContainer: "#FFFFFF",
    },
  },
  "light-blue": {
    colorName: "light-blue",
    lightColors: {
      container: "#DBEAFE",
      main: "#60A5FA",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2D3748",
      main: "#2563EB",
      onContainer: "#FFFFFF",
    },
  },
  "light-green": {
    colorName: "light-green",
    lightColors: {
      container: "#D1FAE5",
      main: "#34D399",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2F3A2D",
      main: "#10B981",
      onContainer: "#FFFFFF",
    },
  },
  "deep-orange": {
    colorName: "deep-orange",
    lightColors: {
      container: "#FEEBC8",
      main: "#F97316",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#3D2C21",
      main: "#EA580C",
      onContainer: "#FFFFFF",
    },
  },
  "deep-purple": {
    colorName: "deep-purple",
    lightColors: {
      container: "#EDE9FE",
      main: "#A78BFA",
      onContainer: "#000000",
    },
    darkColors: {
      container: "#2D2440",
      main: "#7C3AED",
      onContainer: "#FFFFFF",
    },
  },
};
