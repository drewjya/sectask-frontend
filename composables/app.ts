export const useApp = defineStore("sectask-store", () => {
  const accessToken = useCookie("access_token_sectask", {
    maxAge: 60 * 60,
  });
  const refreshToken = useCookie("refresh_token_sectask", {
    maxAge: 60 * 60 * 24 * 30,
  });

  const getAuthorization = computed(() => {
    return `Bearer ${accessToken.value ?? "invalid_token"}`;
  });

  const getRefreshToken = computed(() => {
    return `Bearer ${refreshToken.value ?? "invalid_token"} `;
  });

  const setToken = (token: { accessToken: string; refreshToken: string }) => {
    accessToken.value = token.accessToken;
    refreshToken.value = token.refreshToken;
  };
  return {
    getAuthorization,
    getRefreshToken,
    setToken,
  };
});
