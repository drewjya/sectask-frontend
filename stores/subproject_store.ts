import { isApiError } from "~/types/api/error";
import type { VFile } from "~/types/data/file";
import { type LogData, type ProjectMember } from "~/types/data/project/project";
import type { FindingSidebar } from "~/types/data/sidebar/project";
import type {
  FindingSubproject,
  SubProjectData,
} from "~/types/data/subproject/subproject";

export const subprojectStore = (subprojectId: number) => {
  return defineStore("subproject-store_" + subprojectId.toString(), () => {
    const id = ref<number>();
    const loading = ref(true);
    const name = ref<string>() as Ref<string>;
    const range = ref<RangeDatePickerModel>() as Ref<RangeDatePickerModel>;
    const findings = ref<FindingSubproject[]>();
    const project = ref<FindingSidebar>();
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

    function $reset() {
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
          project.value = subproject.project;
          findings.value = subproject.findings ?? [];
          pm.value = subproject.subprojectMember.find(
            (m) => m.role === Role.PM
          );
          myrole.value = subproject.subprojectMember.find(
            (m) => m.id === app.user?.id
          )?.role;

          console.log();

          logs.value.forEach((ra) => {
            ra.createdAt = new Date(ra.createdAt);
          });
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
