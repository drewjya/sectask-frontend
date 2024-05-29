import type { ApiError } from "~/types/api/error";
import type { User, UserDto } from "~/types/data/user";

export const useAuth = () => {
  const app = useApp();
  const api = usePublicApi();
  const notif = useNotification();
  const router = useRouter();
  const route = useRoute();
  const login = async (param: { email: string; password: string }) => {
    try {
      const resp = await api.post<UserDto>("/auth/login", {
        body: param,
      });
      app.setToken({
        accessToken: resp.data?.token.accessToken ?? "invalid_token",
        refreshToken: resp.data?.token.refreshToken ?? "invalid_token",
      });
      app.user = resp.data?.user;
      router.push("/");
    } catch (error) {
      const err = error as ApiError;
      notif.error({
        message: err.message,
        title: "Error",
      });
    }
  };
  const register = async (param: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const resp = await api.post<User>("/auth/register", {
        body: param,
      });
      notif.ok({
        message: "User registered successfully",
        title: "Success",
      });
      router.push("/login");
    } catch (error) {
      const err = error as ApiError;
      notif.error({
        message: err.message,
        title: "Error",
      });
    }
  };

  const refreshToken = async () => {
    try {
      const resp = await api.get<UserDto>("/auth/refresh", {
        Authorization: `${app.getRefreshToken}`,
      });
      app.setToken({
        accessToken: resp.data?.token.accessToken ?? "invalid_token",
        refreshToken: resp.data?.token.refreshToken ?? "invalid_token",
      });
      app.user = resp.data?.user;
      return {
        status: true,
        error: undefined,
      };
    } catch (error) {
      const err = error as ApiError;
      console.log(route.path);

      return {
        status: false,
        error: err.message,
      };
    }
  };

  const logout = () => {
    app.resetToken();
    router.push("/login");
  };

  return {
    login,
    refreshToken,
    register,
    logout,
  };
};
