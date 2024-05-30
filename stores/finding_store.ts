import { isApiError } from "~/types/api/error";
import type { FindingData } from "~/types/data/finding/finding";

export const findingStore = defineStore("finding-store", () => {
  const id = ref();
  watch(id, (newId) => {
    getFinding();
  });

  const finding = ref<FindingData>();

  const loading = ref(true);
  const notif = useNotification();

  const api = usePrivateApi();
  const app = useApp();
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
    loading.value = true;
    finding.value = undefined;
    try {
      const response = await api.get<FindingData>(`/finding/${id.value}`);
      finding.value = response.data;
      if (finding.value) {
        finding.value.createdAt = new Date(finding.value.createdAt);
        if (finding.value.latestUpdate) {
          finding.value.latestUpdate = new Date(finding.value.latestUpdate);
        }
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
    finding,

    tabs,
    currentTab,
  };
});
