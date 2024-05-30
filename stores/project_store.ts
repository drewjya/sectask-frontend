import { isApiError } from "~/types/api/error";
import {
  type ProjectData,
  type ProjectMember,
} from "~/types/data/project/project";

export const projectStore = defineStore("project-store", () => {
  const id = ref();
  watch(id, (newId) => {
    getProject();
  });

  const project = ref<ProjectData>();
  const pm = ref<ProjectMember>();
  const myrole = ref<Role>();
  const loading = ref(true);
  const notif = useNotification();

  const api = usePrivateApi();
  const app = useApp();
  const router = useRouter();

  const getProject = async () => {
    loading.value = true;
    project.value = undefined;
    try {
      const response = await api.get<ProjectData>(`/project/${id.value}`);
      project.value = response.data;
      if (project.value) {
        project.value.startDate = new Date(project.value.startDate);
        project.value.endDate = new Date(project.value.endDate);
        project.value.subProjects.forEach((sp) => {
          sp.startDate = new Date(sp.startDate);
          sp.endDate = new Date(sp.endDate);
        });
        project.value.recentActivities.forEach((ra) => {
          ra.createdAt = new Date(ra.createdAt);
        });
        project.value.reports.forEach((r) => {
          r.createdAt = new Date(r.createdAt);
        });
        project.value.attachments.forEach((a) => {
          a.createdAt = new Date(a.createdAt);
        });
      }
      pm.value = response.data?.members.find((m) => m.role === Role.PM);
      myrole.value = response.data?.members.find(
        (m) => m.id === app.user?.id
      )?.role;
    } catch (error) {
      if (isApiError(error)) {
        if (error.message === "unauthorized") {
          notif.error({
            title: "Unauthorized",
            message: "You are authorized",
          });
          router.push("/login");
        } else if (error.message === "not_found") {
          notif.error({
            title: "Not Found",
            message: "Project not found",
          });
          router.go(-1);
        } else if (error.message === "noaccess") {
          notif.error({
            title: "No Access",
            message: "You have no access to this project",
          });
          router.go(-1);
        }
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    id,
    loading,
    project,
    pm,
    myrole,
  };
});
