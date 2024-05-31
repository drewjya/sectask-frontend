import { isApiError } from "~/types/api/error";
import type {
  CVSSData,
  FindingData,
  TesterFinding,
} from "~/types/data/finding/finding";
import type { OwnerFinding } from "~/types/data/subproject/subproject";
import {
  FINDING_ACTION,
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

  const socket = useSocket();
  const loading = ref(true);
  const id = ref();
  const notif = useNotification();
  const name = ref<string>() as Ref<string>;
  const category = ref<string>();
  const location = ref<string>();
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

    loading.value = true;

    name.value = undefined as any;
    category.value = undefined;
    location.value = undefined;
    method.value = undefined;
    isEditor.value = false;
    environment.value = undefined;
    application.value = undefined;
    impact.value = undefined;
    likelihood.value = undefined;
    latestUpdate.value = undefined;
    createdAt.value = undefined;
    status.value = undefined;
    releases.value = undefined;
    descriptionId.value = undefined;
    threatAndRiskId.value = undefined;
    cvss.value = undefined;
    createdBy.value = undefined;
    subproject.value = undefined;
    testerFinding.value = undefined;
  };
  const api = usePrivateApi();
  const app = useApp();
  watch(id, (newId) => {
    getFinding();
  });
  const router = useRouter();
  const route = useRoute();
  const currentTab = computed({
    get() {
      const index = tabs.findIndex((t) => t.key === route.query.tab);
      return index === -1 ? 0 : index;
    },
    set(value) {
      router.replace({
        query: { tab: tabs[value].key },
      });
      return value;
    },
  });

  const tabs = [
    {
      label: "Document",
      key: "document",
    },
    {
      label: "CVSS",
      key: "cvss",
    },
    {
      label: "Discussion",
      key: "discussion",
    },
  ];
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
        category.value = finding.category;
        location.value = finding.location;
        method.value = finding.method;
        isEditor.value = finding.isEditor;
        environment.value = finding.environment;
        application.value = finding.application;
        impact.value = finding.impact;
        likelihood.value = finding.likelihood;
        latestUpdate.value = finding.latestUpdate
          ? new Date(finding.latestUpdate)
          : undefined;
        createdAt.value = new Date(finding.createdAt);
        status.value = finding.status;
        releases.value = finding.releases;
        descriptionId.value = finding.descriptionId;
        threatAndRiskId.value = finding.threatAndRiskId;
        cvss.value = finding.cvssDetail.data;
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
  };

  return {
    id,
    loading,

    $reset,
    tabs,
    currentTab,
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
  };
});
