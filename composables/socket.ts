import { io, type Socket } from "socket.io-client";
export const useSocket = defineStore("socket-client", () => {
  const app = useApp();
  const socket = ref<Socket>();
  const getConnection = async () => {
    await new Promise((resolve) => {
      if (!socket.value) {
        const url =
          useRuntimeConfig().public.WS_BASE_URL ??
          "http://localhost:3000/event";
        socket.value = io(url, {
          autoConnect: true,
          auth: {
            token: app.getAuthorization,
          },
        });
        resolve(true);
      } else {
        resolve(false);
      }
    });
    return socket.value!;
  };
  return {
    getConnection,
  };
});
