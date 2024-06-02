import dayjs from "dayjs";
import type { VFile } from "~/types/data/file";

export const getStatus = (props: { startDate: Date; endDate: Date }) => {
  const now = new Date();
  if (now < props.startDate) {
    return {
      value: "Not yet started",
      color: "#EF4444",
    };
  }
  if (now > props.endDate) {
    return {
      value: "Finished",
      color: "#00DC82",
    };
  }
  {
    return {
      value: "Ongoing",
      color: "#FFA500",
    };
  }
};

export const formatDate = (date: Date, format: string) => {
  return dayjs(date).format(format);
};

export const formatImage = (image: VFile|null|undefined) => {
  const runtime = useRuntimeConfig();
  return image ? `${runtime.public.FILE_URL}${image.name}` : undefined;
};
