import { isApiError } from "~/types/api/error";
import type { EventFile, VFile } from "~/types/data/file";
import { getRisk, riskFormulaString } from "~/types/data/finding/finding";
import type {
  EventMember,
  ProjectEventHeader,
  SubprojectEventHeader,
} from "~/types/data/project/event";
import { type LogData, type ProjectMember } from "~/types/data/project/project";
import type { ProjectSubproject } from "~/types/data/sidebar/project";
import type { SocketFindingAction } from "~/types/data/subproject/socket";
import type {
  FindingSubproject,
  SubProjectData,
} from "~/types/data/subproject/subproject";
import {
  PROJECT_ACTION,
  PROJECT_EVENT,
  SUBPROJECT_ACTION,
  SUBPROJECT_EVENT,
} from "~/types/enum/event.enum";

// import {SUBPROJECT_ACTION SUBSUBPROJECT_ACTION,, SUBPROJECT_ACTION SUBPROJECT_EVENT m";

export const subprojectStore = (subprojectId: number) => {
  return defineStore("subproject-store_" + subprojectId.toString(), () => {
    const id = ref<number>();
    const loading = ref(true);
    const name = ref<string>() as Ref<string>;
    const socket = useSocket();
    const range = ref<RangeDatePickerModel>() as Ref<RangeDatePickerModel>;
    const findings = ref<FindingSubproject[]>();
    const project = ref<ProjectSubproject>();
    const members = ref<ProjectMember[]>();
    const reports = ref<VFile[]>();
    const attachments = ref<VFile[]>();
    const logs = ref<LogData[]>();
    const error = ref<string>();

    const pm = ref<ProjectMember>();
    const myrole = ref<Role>();
    const notif = useNotification();

    const api = usePrivateApi();
    const app = useApp();
    const router = useRouter();

    const watcher = watchIgnorable(
      [name, range],
      useDebounceFn(() => {
        if (!id.value) {
          return;
        }
        if (!name.value || name.value.length === 0) {
          watcher.ignoreUpdates(() => {
            name.value = "Untitled Subproject";
          });
        }
        const data = {
          name: name.value,
          startDate: range.value?.start,
          endDate: range.value?.end,
        };
        api
          .post(`/subproject/${id.value}/edit`, {
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

    watch(id, (newId) => {
      getSubproject();
    });

    async function $reset() {
      const conn = await socket.getConnection();
      conn.emit(
        PROJECT_ACTION.LEAVE,
        JSON.stringify({ projectId: project.value?.id })
      );
      conn.emit(
        SUBPROJECT_ACTION.LEAVE,
        JSON.stringify({ subprojectId: id.value })
      );
      conn.off(PROJECT_EVENT.HEADER);
      conn.off(PROJECT_EVENT.MEMBER);
      conn.off(SUBPROJECT_EVENT.REPORT);
      conn.off(SUBPROJECT_EVENT.ATTACHMENT);
      conn.off(SUBPROJECT_EVENT.FINDING);
      conn.off(SUBPROJECT_EVENT.HEADER);
      conn.off(SUBPROJECT_EVENT.LOG);
      conn.off(SUBPROJECT_EVENT.DELETE);
      conn.off(SUBPROJECT_EVENT.MEMBER);
      watcher.ignoreUpdates(() => {
        name.value = undefined as any;
        range.value = undefined as any;
      });
      error.value = undefined;
      id.value = undefined;
      findings.value = undefined;
      project.value = undefined;
      members.value = undefined;
      reports.value = undefined;
      attachments.value = undefined;
      logs.value = undefined;
      pm.value = undefined;
      myrole.value = undefined;
      loading.value = true;
    }

    const getSubproject = async () => {
      if (!id.value) {
        return;
      }
      watcher.ignoreUpdates(() => {
        name.value = undefined as any;
        range.value = undefined as any;
      });
      findings.value = undefined;
      project.value = undefined;
      members.value = undefined;
      reports.value = undefined;
      attachments.value = undefined;
      logs.value = undefined;
      loading.value = true;
      error.value = undefined;

      try {
        const response = await api.get<SubProjectData>(
          `/subproject/${id.value}`
        );
        const subproject = response.data;
        if (subproject) {
          watcher.ignoreUpdates(() => {
            range.value = {
              start: new Date(subproject.startDate),
              end: new Date(subproject.endDate),
            };
            name.value = subproject.name;
          });

          id.value = subproject.id;
          logs.value = subproject.recentActivities ?? [];
          reports.value = subproject.reports ?? [];
          members.value = subproject.subprojectMember ?? [];
          attachments.value = subproject.attachments ?? [];
          project.value = {
            name: subproject.project.name,
            endDate: new Date(subproject.project.endDate),
            startDate: new Date(subproject.project.startDate),
            id: subproject.project.id,
          };
          findings.value = subproject.findings ?? [];
          findings.value.forEach((f) => {
            f.risk = getRisk(
              riskFormulaString({
                likelihood: f.likelihood ?? "",
                impact: f.impact ?? "",
              })
            );

            f.status = f.retestHistories?.[0]?.status ?? "-";

            if (f.deletedAt) {
              f.deletedAt = new Date(f.deletedAt);
            }
          });
          pm.value = subproject.subprojectMember.find(
            (m) => m.role === Role.PM
          );
          myrole.value = subproject.subprojectMember.find(
            (m) => m.id === app.user?.id
          )?.role;

          logs.value.forEach((ra) => {
            ra.createdAt = new Date(ra.createdAt);
          });
          logs.value.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          reports.value.forEach((r) => {
            r.createdAt = new Date(r.createdAt);
          });
          attachments.value.forEach((a) => {
            a.createdAt = new Date(a.createdAt);
          });
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
          } else if (err.message === "forbidden") {
            notif.error({
              title: "Forbidden",
              message: "You have no access to this project",
            });
          }
        }
      } finally {
        loading.value = false;
      }
      const conn = await socket.getConnection();

      const val = { subprojectId: id.value };
      conn.emit(SUBPROJECT_ACTION.JOIN, JSON.stringify(val));
      conn.emit(
        PROJECT_ACTION.JOIN,
        JSON.stringify({ projectId: project.value?.id })
      );
      conn.on(PROJECT_EVENT.MEMBER, (data: EventMember) => {
        if (data.type === "remove") {
          if (app.user?.id === data.member.id) {
            router.push("/");
            notif.info({
              title: "Removed",
              message: "You have been removed from the project",
            });
          }
        }
      });
      conn.on(PROJECT_EVENT.HEADER, (data: ProjectEventHeader) => {
        project.value = {
          name: data.name,
          endDate: new Date(data.endDate),
          startDate: new Date(data.startDate),
          id: project.value?.id ?? 0,
        };
      });
      conn.on(SUBPROJECT_EVENT.FINDING, (data: SocketFindingAction) => {
        if (data.type === "add") {
          const findingId = findings.value?.find(
            (e) => e.id === data.finding.findingId
          );
          if (findingId) {
            return;
          }
          findings.value?.push({
            id: data.finding.findingId,
            createdBy: data.finding.owner,
            name: data.finding.name,
            retestHistories: [],
            deletedAt: data.finding.deletedAt
              ? new Date(data.finding.deletedAt)
              : undefined,
          });
        } else if (data.type === "remove") {
          findings.value = findings.value?.filter(
            (e) => e.id !== data.finding.findingId
          );
        } else if (data.type === "edit") {
          findings.value = findings.value?.map((e) => {
            if (e.id === data.finding.findingId) {
              e.name = data.finding.name;
              e.deletedAt = data.finding.deletedAt
                ? new Date(data.finding.deletedAt)
                : undefined;
              e.createdBy = data.finding.owner;
            }
            return e;
          });
        }
      });
      conn.on(SUBPROJECT_EVENT.LOG, (data: LogData) => {
        logs.value?.unshift({
          description: data.description,
          title: data.title,
          createdAt: new Date(data.createdAt),
        });
      });
      conn.on(SUBPROJECT_EVENT.MEMBER, (data: EventMember) => {
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
        } else if (data.type === "promote") {
          members.value = members.value?.map((m) => {
            if (m.id === data.member.id) {
              m.role = Role.CONSULTANT;
              m.name = data.member.name;
            }

            return m;
          });
          myrole.value = members.value?.find(
            (m) => m.id === app.user?.id
          )?.role;
        } else if (data.type === "demote") {
          members.value = members.value?.map((m) => {
            if (m.id === data.member.id) {
              m.role = Role.VIEWER;
              m.name = data.member.name;
            }
            return m;
          });
          myrole.value = members.value?.find(
            (m) => m.id === app.user?.id
          )?.role;
        }
      });
      conn.on(SUBPROJECT_EVENT.REPORT, (data: EventFile) => {
        if (data.type === "add") {
          const find = reports.value?.find((r) => r.id === data.file.id);
          if (find) {
            return;
          }
          reports.value?.push(data.file);
        } else if (data.type === "remove") {
          reports.value = reports.value?.filter((r) => r.id !== data.file.id);
        }
      });
      conn.on(SUBPROJECT_EVENT.ATTACHMENT, (data: EventFile) => {
        if (data.type === "add") {
          const find = attachments.value?.find((r) => r.id === data.file.id);
          if (find) {
            return;
          }

          attachments.value?.push(data.file);
        } else if (data.type === "remove") {
          attachments.value = attachments.value?.filter(
            (r) => r.id !== data.file.id
          );
        }
      });

      conn.on(SUBPROJECT_EVENT.DELETE, (payload: { subprojectId: number }) => {
        console.log(payload);

        notif.info({
          title: "Deleted",
          message: "Subproject has been deleted",
        });
        router.push(`/project/${project.value?.id}`);
      });

      conn.on(SUBPROJECT_EVENT.HEADER, (data: SubprojectEventHeader) => {
        watcher.ignoreUpdates(() => {
          name.value = data.name;
          range.value = {
            start: new Date(data.startDate),
            end: new Date(data.endDate),
          };
        });
      });
    };

    return {
      id,
      loading,
      project,
      pm,
      myrole,
      $reset,
      error,
      name,
      range,
      findings,
      watcher,
      members,
      reports,
      attachments,
      logs,
      getSubproject,
    };
  });
};
