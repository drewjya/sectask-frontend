import { isApiError } from "~/types/api/error";
import type { EventFile, VFile } from "~/types/data/file";
import type { EventHeader, EventMember } from "~/types/data/project/event";
import {
  type LogData,
  type ProjectData,
  type ProjectMember,
  type SubprojectProject,
} from "~/types/data/project/project";
import type { SocketSubprojectAction } from "~/types/data/subproject/socket";
import { PROJECT_ACTION, PROJECT_EVENT } from "~/types/enum/event.enum";

export const projectStore = (userId: number) => {
  return defineStore("project-store_" + userId.toString(), () => {
    const id = ref<number>();
    const error = ref<string>();
    const socket = useSocket();
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

    async function $reset() {
      const conn = await socket.getConnection();
      conn.emit(PROJECT_ACTION.LEAVE, JSON.stringify({ projectId: id.value }));
      conn.off(PROJECT_EVENT.REPORT);
      conn.off(PROJECT_EVENT.ATTACHMENT);
      conn.off(PROJECT_EVENT.SUBPROJECT);
      loading.value = true;
      error.value = undefined;
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
      error.value = undefined;
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
      } catch (err) {
        if (isApiError(err)) {
          error.value = err.message;
          if (err.message === "unauthorized") {
            notif.error({
              title: "Unauthorized",
              message: "You are authorized",
            });
            router.push("/login");
          } else if (err.message === "not_found") {
            notif.error({
              title: "Not Found",
              message: "Project not found",
            });
          } else if (err.message === "noaccess") {
            notif.error({
              title: "No Access",
              message: "You have no access to this project",
            });
          }
        }
      } finally {
        loading.value = false;
      }
      if (error.value) {
        return;
      }
      const conn = await socket.getConnection();

      conn.emit(PROJECT_ACTION.JOIN, JSON.stringify({ projectId: id.value }));
      conn.on(PROJECT_EVENT.SUBPROJECT, (data: SocketSubprojectAction) => {
        if (data.type === "add") {
          subprojects.value?.push({
            id: data.subproject.subprojectId,
            startDate: new Date(data.subproject.startDate),
            endDate: new Date(data.subproject.endDate),
            name: data.subproject.name,
          });
        }
      });
      conn.on(PROJECT_EVENT.REPORT, (data: EventFile) => {
        if (data.type === "add") {
          reports.value?.push(data.file);
        } else if (data.type === "remove") {
          reports.value = reports.value?.filter((r) => r.id !== data.file.id);
        }
      });
      conn.on(PROJECT_EVENT.ATTACHMENT, (data: EventFile) => {
        if (data.type === "add") {
          attachments.value?.push(data.file);
        } else if (data.type === "remove") {
          attachments.value = attachments.value?.filter(
            (r) => r.id !== data.file.id
          );
        }
      });
      conn.on(PROJECT_EVENT.MEMBER, (data: EventMember) => {
        if (data.type === "add") {
          members.value?.push({
            id: data.member.id,
            name: data.member.name,
            role: data.member.role,
          });
        } else if (data.type === "remove") {
          if (app.user?.id === data.member.id) {
            router.push("/");
            notif.info({
              title: "Removed",
              message: "You have been removed from the project",
            });
          }
          members.value = members.value?.filter((m) => m.id !== data.member.id);
        }
      });

      conn.on(PROJECT_EVENT.HEADER, (data: EventHeader) => {
        watcher.ignoreUpdates(() => {
          name.value = data.name;
          range.value = {
            start: new Date(data.startDate),
            end: new Date(data.endDate),
          };
        });
        picture.value = data.picture;
      });
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
      error,
    };
  });
};
