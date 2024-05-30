import { isApiError } from "~/types/api/error";
import type { VFile } from "~/types/data/file";
import {
  type LogData,
  type ProjectData,
  type ProjectMember,
  type SubprojectProject,
} from "~/types/data/project/project";

export const projectStore = (userId: number) => {
  return defineStore("project-store_" + userId.toString(), () => {
    const id = ref<number>();
    const loading = ref(true);
    
    const name = ref<string>();
    const range = ref<RangeDatePickerModel>();
    const picture = ref<VFile>();
    const subprojects = ref<SubprojectProject[]>();
    const members = ref<ProjectMember[]>();
    const reports = ref<VFile[]>();
    const attachments = ref<VFile[]>();
    const logs = ref<LogData[]>();

    const pm = ref<ProjectMember>();
    const myrole = ref<Role>();

    const notif = useNotification();

    const api = usePrivateApi();
    const app = useApp();
    const router = useRouter();
    watch(id, (newId) => {
      getProject();
    });

    const watcher = watchIgnorable(
      [name, range],
      useDebounceFn(() => {
        if (!id.value) {
          return;
        }
        const data = {
          name: name.value,
          startDate: range.value?.start,
          endDate: range.value?.end,
          members: [],
        };
        api
          .post(`/project/${id.value}/edit`, {
            body: data,
          })
          .then(() => {})
          .catch((error) => {
            if (isApiError(error)) {
              notif.error({
                title: "Error",
                message: error.message,
              });
            } else {
              notif.error({
                title: "Error",
                message: "Try again later",
              });
            }
          });
      })
    );

    function $reset() {
      loading.value = true;
      watcher.ignoreUpdates(() => {
        name.value = undefined;
        range.value = undefined;
      });
      picture.value = undefined;
      subprojects.value = undefined;
      members.value = undefined;
      reports.value = undefined;
      attachments.value = undefined;
    }

    const getProject = async () => {
      if (!id.value) {
        return;
      }
      loading.value = true;
      watcher.ignoreUpdates(() => {
        name.value = undefined;
        range.value = undefined;
      });
      picture.value = undefined;
      subprojects.value = undefined;
      members.value = undefined;
      reports.value = undefined;
      attachments.value = undefined;
      try {
        const response = await api.get<ProjectData>(`/project/${id.value}`);
        const project = response.data;
        if (project) {
          watcher.ignoreUpdates(() => {
            name.value = project.name;
            range.value = {
              start: new Date(project.startDate),
              end: new Date(project.endDate),
            };
          });
          picture.value = project.projectPicture;
          subprojects.value = project.subProjects;
          subprojects.value.forEach((sp) => {
            sp.startDate = new Date(sp.startDate);
            sp.endDate = new Date(sp.endDate);
          });
          members.value = project.members;
          reports.value = project.reports;
          reports.value.forEach((r) => {
            r.createdAt = new Date(r.createdAt);
          });
          reports.value.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          attachments.value = project.attachments;
          attachments.value.forEach((a) => {
            a.createdAt = new Date(a.createdAt);
          });
          attachments.value.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );

          logs.value = project.recentActivities;
          logs.value.forEach((l) => {
            l.createdAt = new Date(l.createdAt);
          });

          pm.value = project.members.find((m) => m.role === Role.PM);
          myrole.value = project.members.find(
            (m) => m.id === app.user?.id
          )?.role;
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
      name,
      range,
      picture,
      subprojects,
      members,
      reports,
      attachments,
      logs,
      pm,
      getProject,
      watcher,
      myrole,
      $reset,
    };
  });
};
