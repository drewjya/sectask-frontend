export function useNotification() {
  const TIMEOUT = 3500;
  const toast = useToast();

  return {
    info: (p: { title?: string; message: string }) => {
      const toastId = `toats-${p.message}`;
      toast.add({
        id: toastId,
        click: () => toast.remove(toastId),
        color: "blue",
        timeout: TIMEOUT,
        title: p.title ?? "Info",
        description: p.message,
      });
    },

    ok: (p: { title?: string; message: string }) => {
      const toastId = `toats-${p.message}`;
      toast.add({
        id: toastId,
        click: () => toast.remove(toastId),
        icon: "i-heroicons-check-circle",
        color: "green",
        timeout: TIMEOUT,
        title: p.title ?? "Success",
        description: p.message,
      });
    },

    warn: (p: { title?: string; message: string }) => {
      const toastId = `toats-${p.message}`;
      toast.add({
        id: toastId,
        click: () => toast.remove(toastId),
        icon: "i-heroicons-exclamation-triangle",
        color: "amber",
        timeout: TIMEOUT,
        title: p.title ?? "Warning",
        description: p.message,
      });
    },

    error: (p: { title?: string; message: string }) => {
      const toastId = `toats-${p.message}`;
      toast.add({
        id: toastId,
        click: () => toast.remove(toastId),
        icon: "i-heroicons-no-symbol",
        color: "red",
        timeout: TIMEOUT,
        title: p.title ?? "Error",
        description: p.message,
      });
    },
  };
}
