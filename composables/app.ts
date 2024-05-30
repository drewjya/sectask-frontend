import type { User } from "~/types/data/user";

export const useApp = defineStore("sectask-store", () => {
  const accessToken = useCookie("access_token_sectask", {
    maxAge: 60 * 60,
  });
  const refreshToken = useCookie("refresh_token_sectask", {
    maxAge: 60 * 60 * 24 * 30,
  });

  const user = ref<User>();

  const getAuthorization = computed(() => {
    return `Bearer ${accessToken.value ?? "invalid_token"}`;
  });

  const getRefreshToken = computed(() => {
    return `Bearer ${refreshToken.value ?? "invalid_token"}`;
  });

  const isDark = computed({
    get: () => useColorMode().value === "dark",
    set: (value: boolean) =>
      (useColorMode().preference = value ? "dark" : "light"),
  });
  const resetToken = () => {
    accessToken.value = "invalid_token";
    refreshToken.value = "invalid_token";
  };
  const setToken = (token: { accessToken: string; refreshToken: string }) => {
    accessToken.value = token.accessToken;
    refreshToken.value = token.refreshToken;
  };

  const navbarLink: {
    label: string;
    to: string;
  }[] = [];
  const fileUrl = useRuntimeConfig().public.FILE_URL;
  const userName = computed(() => user.value?.name.toUpperCase());
  const userImageUrl = computed(() =>
    user.value?.profilePicture
      ? fileUrl + user.value?.profilePicture?.name
      : undefined
  );
  const sidebar = ref(true);
  return {
    getAuthorization,
    getRefreshToken,
    setToken,
    user,
    isDark,
    resetToken,
    sidebar,
    navbarLink,
    userName,
    userImageUrl,
  };
});
