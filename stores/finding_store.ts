import { isApiError } from "~/types/api/error";
import type {
  CVSSData,
  FindingData,
  RoomChat,
  TesterFinding,
} from "~/types/data/finding/finding";
import type { EventMember } from "~/types/data/project/event";
import type { OwnerFinding } from "~/types/data/subproject/subproject";
import {
  FINDING_ACTION,
  FINDING_EVENT,
  PROJECT_ACTION,
  PROJECT_EVENT,
  SUBPROJECT_ACTION,
  SUBPROJECT_EVENT,
} from "~/types/enum/event.enum";

export const findingStore = defineStore("finding-store", () => {
  type SubprojectFinding = {
    id: number;
    name: string;
    project: {
      id: number;
      name: string;
    };
  };

  const statusList = ["Not Retested", "Not Fixed", "Partially Fixed", "Fixed"];
  const categoryList = ["Infrastructure", "API", "IOS", "Android", "Web"];

  const locationList = ["Internal", "External"];

  const methodList = ["White Box", "Grey Box", "Black Box"];
  const impactList = [
    { label: "Inisgniificant", value: 1 },
    { label: "Minor", value: 2 },
    { label: "Moderate", value: 3 },
    { label: "Major", value: 4 },
    { label: "Catasrophic", value: 5 },
  ];
  const likelihoodList = [
    { label: "Rare", value: 1 },
    { label: "Unlikely", value: 2 },
    { label: "Possible", value: 3 },
    { label: "Likely", value: 4 },
    { label: "Certainly", value: 5 },
  ];

  const socket = useSocket();
  const loading = ref(true);
  const id = ref();
  const notif = useNotification();
  const name = ref<string>() as Ref<string>;
  const category = ref<string>();
  const location = ref<string>();
  const onEdit = ref<boolean>(false);
  const method = ref<string>();
  const isEditor = ref<boolean>(false);
  const environment = ref<string>();
  const application = ref<string>();
  const impact = ref<string>();
  const likelihood = ref<string>();
  const latestUpdate = ref<Date>();
  const createdAt = ref<Date>();
  const status = ref<string>();
  const releases = ref<string>();
  const descriptionId = ref<string>();
  const threatAndRiskId = ref<string>();
  const cvss = ref<CVSSData>();
  const createdBy = ref<OwnerFinding>();
  const subproject = ref<SubprojectFinding>();
  const testerFinding = ref<TesterFinding[]>();
  const discussions = ref<RoomChat[]>();
  const watcher = watchIgnorable(
    [onEdit],
    useDebounceFn(() => {
      if (onEdit.value) {
        return;
      }
      if (!id.value) {
        return;
      }
      if (!name.value || name.value.length === 0) {
        watcher.ignoreUpdates(() => {
          name.value = "Untitled Finding";
        });
      }
      const data = {
        name: name.value,
      };
      api
        .post(`/finding/edit/${id.value}`, {
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

  const findingWatcher = watchIgnorable(
    [category, location, method, environment, application, impact, likelihood],
    useDebounceFn(() => {
      if (!id.value) {
        return;
      }

      const data = {
        category: category.value,
        location: location.value,
        method: method.value,
        environment: environment.value,
        application: application.value,
        impact: impact.value,
        likelihood: likelihood.value,
      };
      api
        .post(`/finding/fprop/${id.value}`, {
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
  const findingRetest = watchIgnorable(
    [latestUpdate, status, releases],
    useDebounceFn(() => {
      if (!id.value) {
        return;
      }

      const data = {
        latestUpdate: latestUpdate.value,
        status: status.value,
        releases: releases.value,
      };
      api
        .post(`/finding/retest/${id.value}`, {
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

  const cvssWatcher = watchIgnorable(
    [cvss],
    useDebounceFn(() => {
      if (!id.value) {
        return;
      }

      const data = cvss.value;
      api
        .post(`/finding/cvss/${id.value}`, {
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
    await reset();
    id.value = undefined;
  }

  const reset = async () => {
    const conn = await socket.getConnection();
    conn.emit(
      PROJECT_ACTION.LEAVE,
      JSON.stringify({ projectId: subproject.value?.project.id })
    );
    conn.emit(
      SUBPROJECT_ACTION.LEAVE,
      JSON.stringify({ subprojectId: subproject.value?.id })
    );
    conn.emit(FINDING_ACTION.LEAVE, JSON.stringify({ findingId: id.value }));
    conn.off(PROJECT_EVENT.MEMBER);
    conn.off(SUBPROJECT_EVENT.MEMBER);
    conn.off(FINDING_EVENT.HEADER);
    conn.off(FINDING_EVENT.CVSS);

    loading.value = true;
    name.value = undefined as any;

    watcher.ignoreUpdates(() => {
      onEdit.value = false;
    });
    discussions.value = undefined;
    findingWatcher.ignoreUpdates(() => {
      category.value = undefined;
      location.value = undefined;
      method.value = undefined;
      environment.value = undefined;
      application.value = undefined;
      impact.value = undefined;
      likelihood.value = undefined;
    });
    findingRetest.ignoreUpdates(() => {
      latestUpdate.value = undefined;
      status.value = undefined;
      releases.value = undefined;
    });
    cvssWatcher.ignoreUpdates(() => {
      cvss.value = undefined;
    });
    isEditor.value = false;
    createdAt.value = undefined;
    descriptionId.value = undefined;
    threatAndRiskId.value = undefined;
    createdBy.value = undefined;
    subproject.value = undefined;
    testerFinding.value = undefined;
  };
  const api = usePrivateApi();
  const app = useApp();
  type FindingEventHeader = {
    name: string;
    findingId: number;
  };
  watch(id, (newId) => {
    getFinding();
  });
  const router = useRouter();

  const getFinding = async () => {
    if (!id.value) {
      return;
    }
    await reset();
    try {
      const response = await api.get<FindingData>(`/finding/${id.value}`);
      const finding = response.data;
      if (finding) {
        name.value = finding.name;
        watcher.ignoreUpdates(() => {
          onEdit.value = false;
        });
        findingWatcher.ignoreUpdates(() => {
          category.value = finding.category;
          location.value = finding.location;
          method.value = finding.method;

          environment.value = undefined;
          application.value = undefined;
          impact.value = undefined;
          likelihood.value = undefined;
          environment.value = finding.environment;
          application.value = finding.application;
          impact.value = finding.impact;
          likelihood.value = finding.likelihood;
        });
        isEditor.value = finding.isEditor;
        findingRetest.ignoreUpdates(() => {
          latestUpdate.value = finding.latestUpdate
            ? new Date(finding.latestUpdate)
            : undefined;

          status.value = finding.status;
          releases.value = finding.releases;
        });
        createdAt.value = new Date(finding.createdAt);
        descriptionId.value = finding.descriptionId;
        threatAndRiskId.value = finding.threatAndRiskId;
        cvssWatcher.ignoreUpdates(() => {
          cvss.value = finding.cvssDetail.data;
        });
        createdBy.value = finding.createdBy;
        subproject.value = finding.subProject;
        testerFinding.value = finding.testerFinding;
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

    const conn = await socket.getConnection();
    conn.emit(FINDING_ACTION.JOIN, JSON.stringify({ findingId: id.value }));
    conn.emit(
      PROJECT_ACTION.JOIN,
      JSON.stringify({ projectId: subproject.value?.project.id })
    );
    conn.emit(
      SUBPROJECT_ACTION.JOIN,
      JSON.stringify({ subprojectId: subproject.value?.id })
    );
    conn.on(FINDING_EVENT.HEADER, (data: FindingEventHeader) => {
      watcher.ignoreUpdates(() => {
        name.value = data.name;
      });
    });
    conn.on(
      FINDING_EVENT.CVSS,
      (data: { findingId: number; cvss: CVSSData }) => {
        cvssWatcher.ignoreUpdates(() => {
          cvss.value = data.cvss;
        });
      }
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
    conn.on(SUBPROJECT_EVENT.MEMBER, (data: EventMember) => {
      console.log(data, app.user?.id, data.member.id);

      if (data.type === "remove") {
        if (app.user?.id === data.member.id) {
          router.push("/");
          notif.info({
            title: "Removed",
            message: "You have been removed from the project",
          });
        }
      } else if (data.type === "promote") {
        if (app.user?.id === data.member.id) {
          isEditor.value = true;
        }
      } else if (data.type === "demote") {
        if (app.user?.id === data.member.id) {
          isEditor.value = false;
        }
      }
    });
  };

  return {
    id,
    loading,

    $reset,

    name,
    category,
    location,
    method,
    isEditor,
    environment,
    application,
    impact,
    likelihood,
    latestUpdate,
    createdAt,
    status,
    releases,
    descriptionId,
    threatAndRiskId,
    cvss,
    createdBy,
    subproject,
    testerFinding,
    onEdit,
    discussions,
    statusList,
    categoryList,
    locationList,
    methodList,
    impactList,
    likelihoodList,
  };
});
