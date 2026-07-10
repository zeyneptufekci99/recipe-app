import { toast } from "sonner-native";

export const toastService = {
  success(title: string, message?: string) {
    toast.success(title, {
      description: message,
    });
  },

  error(title: string, message?: string) {
    toast.error(title, {
      description: message,
    });
  },

  info(title: string, message?: string) {
    toast(title, {
      description: message,
    });
  },
};
