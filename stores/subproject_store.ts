import { isApiError } from "~/types/api/error";
import { type ProjectMember } from "~/types/data/project/project";
import type { SubProjectData } from "~/types/data/subproject/subproject";

export const subprojectStore = (subprojectId: number) => {
  return defineStore("subproject-store_" + subprojectId.toString(), () => {
    const id = ref();
    watch(id, (newId) => {
      getSubproject();
    });

    const subproject = ref<SubProjectData>();
    const pm = ref<ProjectMember>();
    const myrole = ref<Role>();
    const loading = ref(true);
    const notif = useNotification();

    const api = usePrivateApi();
    const app = useApp();
    const router = useRouter();
    const route = useRoute();

    const getSubproject = async () => {
      loading.value = true;
      subproject.value = undefined;
      try {
        const response = await api.get<SubProjectData>(
          `/subproject/${id.value}`
        );
        subproject.value = response.data;
        if (subproject.value) {
          console.log(subproject.value?.findings, "MEMBER");

          subproject.value.startDate = new Date(subproject.value.startDate);
          subproject.value.endDate = new Date(subproject.value.endDate);
          subproject.value.createdAt = new Date(subproject.value.createdAt);
          pm.value = subproject.value.subprojectMember.find(
            (m) => m.role === Role.PM
          );
          myrole.value = subproject.value.subprojectMember.find(
            (m) => m.id === app.user?.id
          )?.role;

          subproject.value.recentActivities.forEach((ra) => {
            ra.createdAt = new Date(ra.createdAt);
          });
          subproject.value.reports.forEach((r) => {
            r.createdAt = new Date(r.createdAt);
          });
          subproject.value.attachments.forEach((a) => {
            a.createdAt = new Date(a.createdAt);
          });
        }
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
      subproject,
      pm,
      myrole,
    };
  });
};
