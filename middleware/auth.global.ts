export default defineNuxtRouteMiddleware(async (to, from) => {
  const noAuth = ["/login", "/register"];
  const notif = useNotification();
  const toRoute = noAuth.includes(to.path);
  const { error, status } = await useAuth().refreshToken();
  if (!status) {
    if (toRoute) {
      return;
    } else {
      notif.error({
        message: error ?? "",
        title: "Error",
      });
      return navigateTo("/login");
    }
  }
  await useSocket().getConnection();
  return;
});
